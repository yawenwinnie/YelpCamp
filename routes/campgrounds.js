var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");

//===========================
//  CAMPGROUNDS ROUTES
//===========================
//INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err) {
            console.log("ERROR");
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//NEW
router.get("/new", function(req, res){
    //find the template with that campground
    res.render("campgrounds/new");
});

//CREAT
router.post("/", function(req, res){
    console.log(req.body.description);

    Campground.create(
        {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description

        }, function(err, campground){
            if(err){
                console.log("ERROR");
            }else{
                res.redirect("/campgrounds");
            }
        });

});



//SHOW, must be declared after /new
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {

            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;
//all the routes for campgrounds has been added to router
