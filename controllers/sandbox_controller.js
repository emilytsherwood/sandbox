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

        else{
            var newPost = req.body;
            console.log("POSTBOY "+JSON.stringify(newPost));

            if (typeof localStorage === "undefined" || localStorage === null) {
              var LocalStorage = require('node-localstorage').LocalStorage;
              localStorage = new LocalStorage('./scratch');
            }

            var currentUser = localStorage.getItem('currentUser');
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
                        body: newPost['body']
                    }).then(function (result) {
                        res.redirect('/');
                    }).catch(function (err) {
                        console.log(err);
                    });
                });

            // Promise.all([
            //     db.Post.create({
            //         groupLimit: newPost.groupLimit,
            //         body: newPost.body
            //     })
            // ]).then(function (result) {
            //     res.redirect('/');
            // }).catch(function (e) {
            //     console.log(e);
            // });
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

        else {

            if (typeof localStorage === "undefined" || localStorage === null) {
              var LocalStorage = require('node-localstorage').LocalStorage;
              localStorage = new LocalStorage('./scratch');
            }

            var currentUser = localStorage.getItem('currentUser');

            var selectPostId = req.body.postId;
            var selectGroupLimit = req.body.groupLimit;

            db.UserPost.findAll({
                where: {
                    postId: selectPostId
                }
            }).then(function (result) {

                if (result.length >= selectGroupLimit) {
                    Promise.all([
                        db.Post.findAll({}),
                        db.User.findAll({}),
                        db.UserPost.findAll({})
                    ]).then(function (result) {
                        res.render("groupIsFull", {
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
                        db.User.find({
                            where: {
                                email: currentUser
                            }
                        })
                    ]).then(function (result) {
                        // console.log("RESULT: " + JSON.stringify(result[1]['id']));
                        db.UserPost.create({
                            userEmail: result[1]['email'],
                            UserId: result[1]['id'],
                            PostId: selectPostId
                        }).then(function (result) {
                            db.UserPost.findAll({
                                where: {
                                    postId: selectPostId
                                }
                            }).then(function (result) {
                                
                                var listOfEmails="";

                                for (var i = 0; i < result.length; i++) {
                                    var recipient = result[i]['userEmail'] + ', ';
                                    listOfEmails = listOfEmails.concat(recipient);
                                }

                                listOfEmails = listOfEmails.slice(0, (listOfEmails.length - 2))
                                
                               if (result.length == selectGroupLimit) {
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

                                    db.Post.destroy({
                                        where: {
                                            id: selectPostId
                                        }
                                    })
                               } 

                            });

                            res.redirect('/');

                        }).catch(function (err) {
                            console.log(err);
                        });
                    });
                }
            });
        }
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