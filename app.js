var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground.js");
var Comment = require("./models/comment.js");
var User = require("./models/user.js");
var passport= require("passport");
var LocalStrategy = require ("passport-local");
var expressSession= require ("express-session");
var seedDB = require("./seeds.js")
var methodOverride = require("method-override");
var flash = require("connect-flash");
var sanitizer = require("express-sanitizer");
app.locals.moment  = require("moment");

//Require Routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
mongoose.Promise = global.Promise;
//mongoose.connect("mongodb://localhost/yelp_camp_v12");
//mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://hammad:password123@ds127993.mlab.com:27993/yelpcamp_final");
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//PASSPORT CONFIG
app.use(expressSession({
    secret: "TEST SERVER TEST",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Setting up user to be local
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
  //  app.locals.moment = moment;
    next();
});



app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});