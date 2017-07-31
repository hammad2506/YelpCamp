var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var middleware = require("../middlewares/index");

//NEW COMMENT PAGE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    
    Campground.findById(req.params.id, function(err, campground){
        if(err){
           req.flash("error", err.message);
            res.redirect("back");
        }else{
            res.render("comments/new", {campground:campground});
        }  
    });
    
});

//CREATE NEW COMMENT
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
             req.flash("error", err.message);
             res.redirect("back");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                     req.flash("error", err.message);
                     res.redirect("back");
                }else{
                    comment.author.id= req.user._id;
                    comment.author.username= req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                     req.flash("success", "Added comment");
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});


//EDIT PAGE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
             req.flash("error", err.message);
             res.redirect("back");
        }else{
            res.render("comments/edit", {comment:foundComment, campID: req.params.id});
        }
    });
    
});

//EDIT COMMENT
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
             req.flash("error", err.message);
             res.redirect("back");
        }else{
             req.flash("success", "Edited comment");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

//DELETE COMMENT
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
             req.flash("success", "Deleted comment");
             res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});


module.exports = router;