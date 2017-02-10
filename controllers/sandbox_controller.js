// Require functions from the models folder (index.js and burger.js)
var db = require("../models");
// Export these awesome routes
module.exports = function (app) {
    // Get the root route
    app.get("/", function (req, res, next) {
        Promise.all([
            db.Post.findAll({}),
            db.User.findAll({}),
            db.UserPost.findAll({})
        ]).then(function (result) {
            var posts = result[0];
            var users = result[1];
            var groups = result[2];
            res.render("index", {
                posts: posts,
                users: users,
                groups: groups,
                user: req.user
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
    app.post('/add/', function (req, res) {
        var newPost = req.body;
        // Makes sure something is inputed
        Promise.all([
            db.Post.create({
                body: newPost.foo
            })
        ]).then(function (result) {
            console.log("HEY_______________________: " + JSON.stringify(result[0].id));
            Promise.all([
                db.Post.findAll({
                    where: {
                        id: result[0].id
                    }
                }),
                db.User.findAll({})
            ]).then(function (result) {
                console.log("RESULT: " + JSON.stringify(result) + "UserID: " + result[1][0].id + "PostId: " + result[0][0].id);
                db.UserPost.create({
                    UserId: result[1][0].id,
                    PostId: result[0][0].id
                });
            });
        }).then(function (result) {
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
    app.post('/post/join', function (req, res) {
        // check to see how many members are in this group
        var selectPostId = req.body.postId;
        db.UserPost.findAll({
            where: {
                postId: selectPostId
            }
        }).then(function (result) {
            if (result.length > 0) {
                Promise.all([
                    db.Post.findAll({}),
                    db.User.findAll({}),
                    db.UserPost.findAll({})
                ]).then(function (result) {
                    res.render("index", {
                        msg: "There are too many in this group!",
                        posts: result[0] || [],
                        users: result[1] || [],
                        groups: result[2] || []
                    });
                });
            } else {
                console.log("selectPost: " + selectPostId);
                Promise.all([
                    db.Post.find({
                        where: {
                            id: selectPostId
                        }
                    }),
                    db.User.findAll({})
                ]).then(function (result) {
                    db.UserPost.create({
                        UserId: result[1][0].id,
                        PostId: selectPostId
                    }).then(function (result) {
                        res.redirect('/');
                    }).catch(function (err) {
                        console.log(err);
                    });
                });
            }
        });
        // var newGroup = req.body;
        // var selectPost = req.params.id;
        // console.log("selectPost: " + selectPost);
        // db.Post.find({
        //     where: {
        //         id: selectPost
        //     }
        // }).then(function (result) {
        //     db.UserPost.create({
        //         UserId: 3,
        //         PostId: selectPost
        //     }).then(function (result) {
        //         res.redirect('/');
        //     }).catch(function (err) {
        //         console.log(err);
        //     });
        // });
    });
    // app.get('/', function (req, res) {
    //     // Makes sure something is inputed
    //     db.UserPost.findAll({
    //         where: {
    //             postId: 1
    //         }
    //     }).then(function (result) {
    //         return res.json(result);
    //     }
    //     });
    // });
};