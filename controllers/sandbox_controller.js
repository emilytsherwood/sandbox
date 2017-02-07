// Require functions from the models folder (index.js and burger.js)
var db = require("../models");
// Export these awesome routes
module.exports = function (app) {
    // Get the root route
    app.get("/", function (req, res, next) {
        Promise.all([
            db.Post.findAll({}),
            db.User.findAll({})
        ]).then(function (result) {
            var posts = result[0];
            var users = result[1];
            res.render("index", {
                posts: posts,
                users: users
            });
        }).catch(function (e) {
            console.log(e);
        });
    });

    app.get('/api/posts/:id?', function (req, res) {
        if (req.params.id) {
            db.Post.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function (result) {
                return res.json(result);
            });
        } else {
            // Otherwise display the data for all of the characters.
            db.Post.findAll({}).then(function (result) {
                return res.json(result);
            });
        }
    });

    app.get('/api/users/:id?', function (req, res) {
        if (req.params.id) {
            db.User.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function (result) {
                return res.json(result);
            });
        } else {
            // Otherwise display the data for all of the characters.
            db.User.findAll({}).then(function (result) {
                return res.json(result);
            });
        }
    });

    app.get('/api/groups/:id?', function (req, res) {
        if (req.params.id) {
            db.UserPost.findOne({
                where: {
                    id: req.params.id
                }
            }).then(function (result) {
                return res.json(result);
            });
        } else {
            // Otherwise display the data for all of the characters.
            db.UserPost.findAll({}).then(function (result) {
                return res.json(result);
            });
        }
    });

    // Post for creating Ideas
    app.post('/', function (req, res) {
        var newPost = req.body;
        // Makes sure something is inputed
        Promise.all([
            db.Post.create({
                body: newPost.foo
            })
        ]).then(function (result) {
            res.redirect('/');
        }).catch(function (e) {
            console.log(e);
        });
    });
    app.post('/user', function (req, res) {
        var newUser = req.body;
        // Makes sure something is inputed
        db.User.create({
            user_name: newUser.fooBar
        }).then(function (result) {
            res.redirect('/');
        });
    });

    app.post('/post/join/:id', function (req, res) {
        var newGroup = req.body;
        var selectPost = req.params.id;
        console.log("selectPost: " + selectPost);
        db.Post.find({
            where: {
                id: selectPost
            }
        }).then(function (result) {
            db.UserPost.create({
                UserId: 1,
                PostId: selectPost
            }).then(function (result) {
                res.redirect('/');
            }).catch(function (err) {
                console.log(err);
            });
        });
    });
};