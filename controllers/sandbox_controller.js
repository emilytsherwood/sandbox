// Require functions from the models folder (index.js and burger.js)
var db = require("../models");
var passport = require('passport');
var loginBool = require("./login_controller");
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sandboxteam321@gmail.com',
        pass: 'sandboxfordevs'
    }
});

// Export these awesome routes
module.exports = function (app) {

    app.get('/past', function(req, res){
        db.Post.findAll({})
        .then(function (result) {
                
            res.render('pastProjects', {posts: result});
            });
    });


    app.get('/terms', function (req, res) {
        res.sendFile('terms');
    });
    

    app.get('/privacy', function(req, res){
        res.sendFile('privacy');
    });

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

    // Post for creating Ideas
    app.post('/add/', function (req, res) {

        if(loginBool.loggedIn===false){
            Promise.all([
                    db.Post.findAll({})
                ]).then(function (result) {
                    res.render("pleaseLoginModal", {
                        posts: result[0] || []
                    });
                });
        } else {

            var newPost = req.body;
            console.log("POSTBOY "+JSON.stringify(newPost));
            if(req.body['body'] !== "" || req.body['groupLimit'] !== ""){

                var currentUser = req.user._json.email;
                // Makes sure something is inputed
                Promise.all([
                        db.User.find({
                            where: {
                                email: currentUser
                            }
                        })
                    ]).then(function (result) {
                        console.log("RESULT: " + JSON.stringify(result));

                        
                            db.Post.create({
                                authorEmail: result[0]['email'],
                                groupLimit: newPost['groupLimit'],
                                body: newPost['body'],
                                pictureUrl: result[0]['picture_url'],
                                user: result[0]['user_name'],
                                authorId: result[0]['id']
                            }).then(function (result) {
                                db.UserPost.create({
                                    userEmail: currentUser,
                                    UserId: result['authorId'],
                                    PostId: result['id']
                                })

                                res.redirect('/');
                        }).catch(function (err) {
                            console.log(err);
                        });
                    });
                } else {
                    Promise.all([
                        db.Post.findAll({})
                    ]).then(function (result) {
                        res.render("emptyInputModal", {
                            posts: result[0] || []
                        });
                    });
                }

        }
    });


    app.post('/post/join', function (req, res) {
        //if user is not logged in, serve modal
        if(loginBool.loggedIn===false){
            Promise.all([
                    db.Post.findAll({}),
                    db.User.findAll({}),
                    db.UserPost.findAll({})
                ]).then(function (result) {
                    res.render("pleaseLoginModal", {
                        posts: result[0] || [],
                        users: result[1] || [],
                        groups: result[2] || []
                    });
                });
        }
        //if user is logged in
        else {

            //get the info of the current user and the post he/she just selected
            var currentUser = req.user._json.email;
            var selectPostId = req.body.postId;
            var selectGroupLimit = req.body.groupLimit;

                db.UserPost.findAll({
                    where: {
                        postId: selectPostId
                    }
                }).then(function (result) {
                    
                    var userAlreadyJoinBool=false;

                    for (var i = 0; i < result.length; i++) {
                        if(result[i]['userEmail'] === currentUser){
                        userAlreadyJoinBool=true; 
                        }
                    }

                    if(userAlreadyJoinBool){

                        Promise.all([
                            db.Post.findAll({}),
                        ]).then(function (result) {
                            var posts = result[0];
                            res.render("cantJoinModal", {
                                posts: posts,
                                user: req.user
                            });
                        }).catch(function (e) {
                            console.log(e);
                        });
                                      

                    } else{
                        Promise.all([
                            db.User.find({
                                where: {
                                    email: currentUser
                                }
                            })
                        ]).then(function (result) {

                            db.UserPost.create({
                                userEmail: currentUser,
                                UserId: result[0]['id'],
                                PostId: selectPostId                
                            }).then(function (result) {
                                Promise.all([
                                    db.Post.findAll({}),
                                ]).then(function (result) {
                                    var posts = result[0];
                                    res.render("JoinModal", {
                                        posts: posts,
                                        user: req.user
                                    });
                                }).catch(function (e) {
                                    console.log(e);
                                });
                            });

                        });
                    }

                });
        }

    });

};