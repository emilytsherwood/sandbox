var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var exphbs = require("express-handlebars");

var app = express();
var PORT = process.env.PORT || 8080;

var db = require("./models");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Set the engine up for handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Links the static content (i.e. css and images)
app.use(express.static(__dirname + '/public'));

require("./controllers/sandbox_controller.js")(app);

app.use(methodOverride("_method"));

db.sequelize.sync().then(function() {
    app.listen(PORT, function () {
console.log("App listening this awesome PORT: " + PORT);
    });
});