var express      = require("express"),
    app          = express(),
    badyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require('./models/campground'),
    Comment      = require('./models/comment')
    seedDB       = require('./seeds');


mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true});

app.use(badyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// seedDB();

//////////////////////Routing///////////////////////////
app.get("/", function(req, res){
    res.render("landing");
});

//INDEX
app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if(err) {
                console.log("ERROR");
            }else{
                res.render("campgrounds/index", {campgrounds: allCampgrounds});
            }
        });
});

//NEW
app.get("/campgrounds/new", function(req, res){
    //find the template with that campground
    res.render("campgrounds/new");
});

//CREAT
app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {

            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});


//===========================
//  COMMENT ROUTES
//===========================
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })

});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("./campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.error.bind(console, "Error");
                }else{
                    campground.comments.push(comment);
                    campground.save(function(err, data){
                        if(err){
                            console.error.bind(console, err);
                        }else{
                            res.redirect("/campgrounds/" + campground._id);
                        }
                    })
                }

            });
        }
    });
});



//////////////////appListen/////////////////////////
app.listen(3000, function(){
    console.log("Server running");
});
