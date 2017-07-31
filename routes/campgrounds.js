var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var middleware = require("../middlewares/index");
var geocoder = require("geocoder");

router.get("/campgrounds", function(req, res){
    
    Campground.find({}, function(err, campResult){
        if (err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds:campResult, page: 'campgrounds'});
        }
    });
});


//New Form
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});


//Create (POST)
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
    
    var newCampground = req.body.campground;
    newCampground.author = {
        id: req.user._id,
        username: req.user.username
    }
    
    //GET LONG AND LAT FROM GEOCODER FOR GOOGLE MAPS
    geocoder.geocode(req.body.campground.location, function (err, data) {
        if(err){
            console.log(err);
        }
     
        newCampground.lat = data.results[0].geometry.location.lat;
        newCampground.lng = data.results[0].geometry.location.lng;
        newCampground.location = data.results[0].formatted_address;
        
    // Create a new campground and save to DB
        Campground.create(newCampground, function(err, addCampground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else{
                req.flash("success", "Added new Campground");
                res.redirect("/campgrounds"); 
            }
        });
        
    });
});

//SHOW PAGE
router.get("/campgrounds/:id", function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, campgroundDetail){
       if(err){
            req.flash("error", err.message);
           res.redirect("back");
       }else{
           res.render("campgrounds/show", {campground:campgroundDetail});
         
       }
    });
});


//EDIT PAGE
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    
    Campground.findById(req.params.id, function(err, updateCampground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
            res.render("campgrounds/edit", {campground:updateCampground});     
        }   
    });
    
});

//EDIT ROUTE
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    
    var changedCampground = req.body.campground;
    
    geocoder.geocode(req.body.campground.location, function (err, dataRes) {
        if(err){
            console.log(err);
        }
        
        if(dataRes.results === undefined){
            console.log("Error Updating:" + dataRes.results[0].formatted_address);
        }
        
        
        changedCampground.lat = dataRes.results[0].geometry.location.lat;
        changedCampground.lng = dataRes.results[0].geometry.location.lng;
        changedCampground.location = dataRes.results[0].formatted_address;
        
    
        Campground.findByIdAndUpdate(req.params.id, changedCampground, function(err, updatedCampground){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            }else{
                console.log(updatedCampground.location);
                 req.flash("success", "Edited Campground");
                 res.redirect("/campgrounds/" + req.params.id);
            }
        });
        
    });
});


//DELETE ROUTE
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, removedCamp){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
             req.flash("success", "Deleted comment");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;