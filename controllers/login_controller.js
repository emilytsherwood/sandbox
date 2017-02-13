// Require Sequelize DB from index.js in models folder
var db = require("../models");
// Require Passport for authentication to github
var passport = require('passport');
module.exports = {
<<<<<<< HEAD
    loggedIn: false,
    routes: function (app) {
        // Logging in route: allows to log in
        app.get('/login', function (req, res) {
            res.render('login', {
                user: req.user
            });
            console.log('WHAT THE FUCK: ' + result);
        });
        // Account page route: allows to view account information
        app.get('/account', ensureAuthenticated, function (req, res) {
            res.render('account', {
                user: req.user,
                email: req.user.emails[0].value
            });
        });
        // This route: /auth/github
        //   Uses passport.authenticate() as route middleware to authenticate the
        //   request.  The first step in GitHub authentication will involve redirecting
        //   the user to github.com.  After authorization, GitHub will redirect the user
        //   back to this application at /auth/github/callback
        app.get('/auth/github', passport.authenticate('github', {
            scope: ['user:email']
        }), function (req, res) {
            // The request will be redirected to GitHub for authentication, so this
            // function will not be called.
        });
        // This route: /auth/github/callback
        //   Uses passport.authenticate() as route middleware to authenticate the
        //   request. If authentication fails, the user will be redirected back to the
        //   login page. Otherwise, the primary route function will be called,
        //   which, in this example, will redirect the user to the home page.
        app.get('/auth/github/callback', passport.authenticate('github', {
            failureRedirect: '/login'
        }), function (req, res) {
            module.exports.loggedIn = true;
            var username = req.user._json.login;
            var pictureUrl = req.user._json.avatar_url;
            var email = req.user._json.email;
            // Finds or Creates a new User in the DB User table
            db.User.findOrCreate({
                where: {
                    user_name: username
                },
                defaults: {
                    picture_url: pictureUrl,
                    email: email
                }
            }).spread(function (user, created) {
                console.log(user.get({
                    plain: true
                }));
                console.log(created);
                res.redirect('/');
            });
        });
        // This route is for logging out and redirecting to the homw page
        app.get('/logout', function (req, res) {
            module.exports.loggedIn = false;
            req.logout();
            res.redirect('/');
        });
        // This will make sure user is logging, if not they are directed to log in
        function ensureAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            }
            res.redirect('/login');
        }
=======
  loggedIn: false,
  routes: function (app) { 

    app.get('/login', function(req, res){
      res.render('login', { user: req.user });
    });

    app.get('/account', ensureAuthenticated, function(req, res){
      res.render('account', { user: req.user, email: req.user.emails[0].value});
    });

    // GET /auth/github
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in GitHub authentication will involve redirecting
    //   the user to github.com.  After authorization, GitHub will redirect the user
    //   back to this application at /auth/github/callback
    app.get('/auth/github',
      passport.authenticate('github', { scope: [ 'user:email' ] }),
      function(req, res){
        // The request will be redirected to GitHub for authentication, so this
        // function will not be called.
      });

    // GET /auth/github/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/github/callback', 
      passport.authenticate('github', { failureRedirect: '/login' }),
      function(req, res) {
        module.exports.loggedIn = true;

        var username = req.user._json.login;
        var pictureUrl = req.user._json.avatar_url;
        var email = req.user._json.email;

        db.User.findOrCreate({
          where: {user_name: username
        }, defaults: {
          picture_url: pictureUrl,
          email: email
        }})
      .spread(function(user, created) {
        console.log(user.get({
          plain: true
        }));
        console.log(created);

        res.redirect('/');

      });

      });

    app.get('/logout', function(req, res){

      module.exports.loggedIn = false;

      req.logout();
      res.redirect('/');
    });

//     app.post('/user', function (req, res) {
//         var newUser = req.body;
//         // Makes sure something is inputed
//         db.User.create({
//             user_name: newUser.fooBar
//         }).then(function (result) {
//             res.redirect('/user');
//         });
//     });

    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) { return next(); }
      res.redirect('/login');
>>>>>>> c09018d9067d31257764a4f111b5edaa370f61e2
    }
};