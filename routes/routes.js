// Dependencies
const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

// Routes

// GET Index

router.get("/", function(req, res) {
  // find all Articles
  db.Article.find({}).limit(6)
  .then(function(data){
      var hbsObj = {
        articles: data
      };
      console.log(hbsObj)
      res.render("index", hbsObj);
  })
  .catch(function(err){
    ers.json(err)
  });
});

// A GET route for scraping the London Times website
router.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.thetimes.co.uk/").then(function(response) {

      var $ = cheerio.load(response.data);
  
      // Grabs Article Divs
      $("div.Item-content").each(function(i, element) {
        var result = {};
  
        // Adding headline, summary and link to each corresponding object param
        result.headline = $(this)
          .children("h3.Item-headline")
          .text();
        result.summary = $(this)
        // showOnWide is the large screen summary version- might be worth switching this for responsiveness
          .children("p.Item-dip")
          .children("span.u-showOnWide")
          .text();
        result.link = 
          "https://www.thetimes.co.uk"+
          $(this)
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
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // finds Article by id, updates the comment by id
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
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