const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Server & Port
// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoNews";
const PORT = 3000;

// Initialize Express
const app = express();

// Handlebars
const exhbars = require("express-handlebars");

app.engine("handlebars", exhbars({ defaultLayout: "main" }));
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
