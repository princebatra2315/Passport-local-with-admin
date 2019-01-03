var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('../models/users.js');
var request = require('request');

passport.use(new Strategy(
    function (username, password, cb) {
        db.findByUsername(username, function (err, user) {
            if (err) {
                return cb(err);
            }
            if (!user) {
                return cb(null, false);
            }
            if (user.password != password) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.findById(id, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

module.exports = function (app) {
   // app.use(require('morgan')('combined'));
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({extended: true}));
    app.use(require('express-session')({secret: 'keyboard cat', resave: false, saveUninitialized: false}));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/',function(req,res){
        res.render('home');
    }) 
    app.get('/admin', require('connect-ensure-login').ensureLoggedIn(), function (req, res) {
        res.render('admin-home');
    })

    app.get('/login',
        function (req, res) {
            res.render('login');
        });

    app.post('/login',
        passport.authenticate('local', {failureRedirect: '/'}),
        function (req, res) {
            res.redirect('/admin');
        });

    app.get('/logout',
        function (req, res) {
            req.logout();
            res.redirect('/');
        });

}