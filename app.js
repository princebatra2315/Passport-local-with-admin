var express = require('express');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');
var path = require('path');
const passport = require('passport');
// const flash = require('connect-flash');
const session = require('express-session');
var app = express()

//Body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })) 

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// // Connect flash
// app.use(flash());

// // Global variables
// app.use(function(req, res, next) {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// });


// app.use(expressValidator({
//   errorFormatter: function(param, msg, value) {
//       var namespace = param.split('.')
//       , root    = namespace.shift()
//       , formParam = root;

//     while(namespace.length) {
//       formParam += '[' + namespace.shift() + ']';
//     }
//     return {
//       param : formParam,
//       msg   : msg,
//       value : value
//     };
//   }
// }));

// Mongoose Connection 
mongoose.connect('<....mongourl.....>', { useNewUrlParser: true })

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));

//Show that our db is succesfully Connected
db.once('open', function(){
console.log("Connected to Mongo Lab: ");
})

//Set path for the Routes
var routes = require('./routes')(app);

//Setting the views
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));


var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("App is running on port " + port);
});