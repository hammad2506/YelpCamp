var express = require("express");
var router  = express.Router({mergeParams: true});
var User = require("../models/user.js");
var passport= require("passport");


//ROUTES
router.get("/", function(req, res){
    
    res.render("landing");
});

//INDEX

//AUTHENTICATION ROUTES

//REGISTER
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});


router.post("/register", function(req, res){
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
           console.log(err);
            return res.render("register", {error: err.message});
      }else{
          passport.authenticate("local")(req, res, function(){
               req.flash("success", "Welcome to YelpCamp " + user.username.toUpperCase());
              res.redirect("/campgrounds");
          });
      } 
   }); 
});

//LOGIN

router.get("/login", function(req, res){
    res.render("login", {page: 'login'});
});

router.post("/login", passport.authenticate("local", 
    {   
        failureRedirect: "/login"
        
    }), function(req, res){
        req.flash("success", "Welcome back " + req.user.username.toUpperCase());
        res.redirect("/campgrounds");
}); 


// LOGOUT
router.get("/logout", function(req, res){
    req.logout();
     req.flash("success", "Successfully Logged out");
    res.redirect("/campgrounds");
});

 

module.exports = router;