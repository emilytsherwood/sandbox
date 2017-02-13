 // Require functions from the models folder (index.js and burger.js)
var db = require("../models");
var passport = require('passport');
var path = require("path");
// page routes   
module.exports = function(app){
    app.get('/past', function(req, res){
        db.Post.findAll({})
        .then(function (result) {
                
            res.render('pastProjects', {posts: result});
            });
    });


    app.get('/terms', function (req, res) {
        // res.sendFile('./views/terms');
        res.sendFile(path.join(__dirname + "/./views/terms.html"));
    });
    

    app.get('/privacy', function(req, res){
        res.sendFile('./views/privacy');
    });
};