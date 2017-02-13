// Require functions from the models folder (index.js and burger.js)
var db = require("../models");

// checks if user is logged in
var loginBool = require("./login_controller");

//require our modules
var passport = require('passport');
const nodemailer = require('nodemailer');

//set up nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sandboxteam321@gmail.com',
        pass: 'sandboxfordevs'
    }
});

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

    // Post for creating Ideas
    app.post('/add/', function (req, res) {

        //if not logged in stop and send modal
        if(loginBool.loggedIn===false){
            Promise.all([
                    db.Post.findAll({})
                ]).then(function (result) {
                    res.render("pleaseLoginModal", {
                        posts: result[0] || []
                    });
                });
        //if logged in        
        } else {

            var newPost = req.body;

            //double check if input fields were filled
            if(req.body['body'] !== "" || req.body['groupLimit'] !== ""){

                //store the current users email
                var currentUser = req.user._json.email;
                
                //get the entire user object from the database
                Promise.all([
                        db.User.find({
                            where: {
                                email: currentUser
                            }
                        })
                    ]).then(function (result) {
                            //and then create the post object per the user and input information
                            db.Post.create({
                                authorEmail: result[0]['email'],
                                groupLimit: newPost['groupLimit'],
                                body: newPost['body'],
                                pictureUrl: result[0]['picture_url'],
                                user: result[0]['user_name'],
                                authorId: result[0]['id']
                            }).then(function (result) {
                                //on the creation of a new post, associate the creator with his/her own group
                                db.UserPost.create({
                                    userEmail: currentUser,
                                    UserId: result['authorId'],
                                    PostId: result['id']
                                })

                                //refresh to see changes
                                res.redirect('/');
                        }).catch(function (err) {
                            console.log(err);
                        });
                    });

                //if the fields were empty, then stop and show modal
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

    //this route is used to join an idea from any user online
    app.post('/post/join', function (req, res) {
        //if user is not logged in, stop and serve modal
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

                //then find all the UserPost entries linked to that selected post
                db.UserPost.findAll({
                    where: {
                        postId: selectPostId
                    }
                }).then(function (result) {
                    
                    //then check to see if the current user already joined this group
                    var userAlreadyJoinBool=false;

                    for (var i = 0; i < result.length; i++) {
                        if(result[i]['userEmail'] === currentUser){
                        userAlreadyJoinBool=true; 
                        }
                    }

                    //if the user has already joined this group then stop and serve modal
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
                                      
                    //if the user has not joined then create UserPost entry with the user and post info
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
                                            from: '"SandBox Team 👻" <sandboxteam321@gmail.com>', // sender address
                                            to: listOfEmails, // list of receivers
                                            subject: 'SANDBOX COLLABORATION!', // Subject line
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

                               else{

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

                            });


                            });

                        });
                    }

                });
        }

    });



};