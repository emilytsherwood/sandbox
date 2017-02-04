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
    // Post for creating Ideas
    app.post('/', function (req, res) {
        var newPost = req.body;
        // Makes sure something is inputed
        Promise.all([
            db.Post.create({
                body: newPost.foo
            })
            // db.UserPost.create({
            //     postId: newPost.asdfa,
            //     userId: newPost.foofoo
            // })
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
            res.redirect('/user');
        });
    });
    app.post('/post/join', function (req, res) {
        var newGroup = req.body;
        // var idOfPost = req.params.id;
        // Makes sure something is inputed
        Promise.all([
            db.Post.findAll({
                where: {
                    id: req.body.postId
                }
            }),
            db.User.findAll({
                where: {
                    id: 1
                }
            })
        ]).then(function(result){
            var post = result[0];
            var user = result[1];
            console.log(result);
            post.addPost(user, { through: {} }).then(function (result){
                res.redirect('/post/join');
            }).catch(function (err) {
                console.log(err);
            });
        });
        // .then(db.UserPost.add({
        //     postId: newGroup.postId
        // }).
        // then(function (result) {
        //     res.redirect('/post/join');
        // }));
    });
};