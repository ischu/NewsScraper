// Dependencies
const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

// Routes

// GET Index

router.get("/", function(req, res) {
    res.render("index");
})

// A GET route for scraping the London Times website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.thetimes.co.uk/").then(function(response) {

      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.Item-content").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Adding headline, summary and link to each corresponding object param
        result.headline = $(this)
          .children("h3.Item-headline")
          .text();
        result.summary = $(this)
          .children("p.Item-dip")
          .text();
        result.link = $(this)
          .children("a.Item-cta")
          .attr("href")
  
        // Create new Article Obj.
        db.Article.create(result)
          .then(function(dbArticle) {
            // log result
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });
  
  // Route for getting all Articles from the db
  router.get("/articles", function(req, res) {
    // Grab all Article Documents
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

module.exports = router;