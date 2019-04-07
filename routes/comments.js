var express = require("express");
//merges the parameters(campground.id) into comment routes to get campgrounds id
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");

//===========================
//  COMMENT ROUTES
//===========================
router.get("/new", isLogedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })

});

router.post("/", isLogedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("./campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.error.bind(console, "Error");
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(function(err, data){
                        if(err){
                            console.error.bind(console, err);
                        }else{
                            console.log(comment);
                            res.redirect("/campgrounds/" + campground._id);
                        }
                    })
                }

            });
        }
    });
});

function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


module.exports = router;
