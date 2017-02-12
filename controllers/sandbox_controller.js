// Require functions from the models folder (index.js and burger.js)
var db = require("../models");
var passport = require('passport');
var loginBool = require("./login_controller");
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jkbuoyant@gmail.com',
        pass: 'ayew4ssupBruh!'
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

                                db.userPost.create({
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

                 // console.log("selectPost: " + selectPostId);
                    Promise.all([
                        db.Post.find({
                            where: {
                                id: selectPostId
                            }
                        }),
                        db.User.find({
                            where: {
                                email: currentUser
                            }
                        })
                    ]).then(function (result) {
                        // console.log("RESULT: " + JSON.stringify(result[1]['id']));
                        db.UserPost.findOrCreate({
                            where: {
                                userEmail: currentUser,
                                UserId: result[1]['id'],
                                PostId: selectPostId
                        }, defaults: {
                                userEmail: currentUser,
                                UserId: result[1]['id'],
                                PostId: selectPostId
                        }})
                        .then(function (result) {
                            
                            db.UserPost.findAll({
                                where: {
                                    postId: selectPostId
                                }
                            }).then(function (result) {

                               if (result.length == selectGroupLimit) {

                                var listOfEmails="";

                                for (var i = 0; i < result.length; i++) {
                                    var recipient = result[i]['userEmail'] + ', ';
                                    listOfEmails = listOfEmails.concat(recipient);
                                }

                                listOfEmails = listOfEmails.slice(0, (listOfEmails.length - 2))

                                    // setup email data with unicode symbols
                                    let mailOptions = {
                                        from: '"SandBox Team 👻" <jkbuoyant@gmail.com>', // sender address
                                        to: listOfEmails, // list of receivers
                                        subject: 'SANDBOX COLLOBORATION!', // Subject line
                                        text: 'Hi! Let\'s work together!', // plain text body
                                        html: '<b>Hi! Let\'s work together!</b>' // html body
                                    };

                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Message %s sent: %s', info.messageId, info.response);
                                    });

                                    db.Post.update({
                                            capacity: true
                                        }, {                                     
                                            where: {
                                            id: selectPostId
                                            }
                                        });

                                    res.redirect('/');    

                               }

                               else{

                                    var userAlreadyJoinBool=false;

                                    for (var i = 0; i < result.length; i++) {
                                        if(result[i]['userEmail'] == currentUser){
                                           userAlreadyJoinBool=true; 
                                        }
                                    }

                                    if(userAlreadyJoinBool === true){

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

                                    }
                               }

                            });


                        }).catch(function (err) {
                            console.log(err);
                        });
                    });
        }

    });

};