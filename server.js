const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const fs = require("fs");

// Server & Port
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews";
const PORT = process.env.PORT || 3000;
mongoose.connect(MONGODB_URI);

// Initialize Express
const app = express();

// Handlebars
const handlebars = require("express-handlebars");
// handlebars.registerPartial('article-tile', '{{name}}');
app.engine("handlebars", handlebars({ defaultLayout: "main" }), handlebars({partialsDir: ['views/partials/']}));
app.set("view engine", "handlebars");


// Middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/MongoNews", {useNewUrlParser: true});

// Routes
var routes = require("./routes/routes.js");

app.use(routes);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
