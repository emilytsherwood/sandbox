// Require functions from the models folder (index.js and burger.js)
var db = require("../models");
// Export these awesome routes
module.exports = function (app) {
    //Get the root route
    // app.get("/", function (req, res, next) {
    //     Promise.all([
    //     db.Post.findAll({}),
    //     db.User.findAll({})
    //     ]).then(function (result) {
    //         var posts = result[0];
    //         var users = result[1];
    //         res.render("index", {
    //             posts: posts,
    //             users: users
    //         });
    //     }).catch(function (e) {console.log(e);});
    //     db.Post.findAll({}).then(function (result) {
    //         console.log(result);
    //     });
    //     db.User.findAll({}).then(function (resultGroups) {
    //         // Sends both data types to respective handlebars tags
    //         return res.render("index", {
    //             allGroups: resultGroups
    //         });
    //     });
    // });
    // // Post for creating Ideas
    // app.post('/', function (req, res) {
    //     var newPost = req.body;
    //     // Makes sure something is inputed
    //     db.Post.create({
    //         UserId: newPost.foofoo,
    //         body: newPost.foo
    //     }).then(function (result) {
    //         res.redirect('/');
    //     });
    // });
    // app.post('/user', function (req, res) {
    //     var newUser = req.body;
    //     // Makes sure something is inputed
    //     db.User.create({
    //         user_name: newUser.fooBar
    //     }).then(function (result) {
    //         res.redirect('/user');
    //     });
    // });
};