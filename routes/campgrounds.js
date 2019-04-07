var express    = require("express");
var router     = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index");

//===========================
//  CAMPGROUNDS ROUTESF
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find the template with that campground
    res.render("campgrounds/new");
});

//CREAT
router.post("/", middleware.isLoggedIn, function(req, res){
    console.log(req.body.description);

    Campground.create(
        {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            author: {
                id: req.user._id,
                username: req.user.username,
            }

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

//Edit campground route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){

        Campground.findById(req.params.id, function(err, foundCampground) {
            res.render('campgrounds/edit', {campground: foundCampground});
        });
});

// update campground route
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            red.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//delete campground route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campground');
        }else{
            res.redirect('/campgrounds');
        }
    })
});

module.exports = router;
//all the routes for campgrounds has been added to router
