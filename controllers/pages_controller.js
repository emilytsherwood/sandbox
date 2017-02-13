 // Require functions from the models folder (index.js and burger.js)
 var db = require("../models");
 var passport = require('passport');
 // page routes
 module.exports = function (app) {
     app.get('/past', function (req, res) {
         db.Post.findAll({}).then(function (result) {
             res.render('pastProjects', {
                 posts: result
             });
         });
     });
     app.get('/terms', function (req, res) {
         db.User.findAll({}).then(function (result) {
             var users = result[0];
             res.render("terms", {
                 users: users,
                 user: req.user
             });
             // res.render('/terms');
         });
     });
    app.get('/privacy', function (req, res) {
             db.User.findAll({}).then(function (result) {
                 var users = result[0];
                 res.render("privacy", {
                     users: users,
                     user: req.user
                 });
             });
         });
 };