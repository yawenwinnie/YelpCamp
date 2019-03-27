var express      = require("express"),
    app          = express(),
    badyParser   = require("body-parser"),
    mongoose     = require("mongoose"),
    Campground   = require('./models/campground'),
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
                res.render("index", {campgrounds: allCampgrounds});
            }
        });
});

//NEW
app.get("/campgrounds/new", function(req, res){
    //find the template with that campground
    res.render("new");
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
            res.render("show", {campground: foundCampground});
        }
    });
});




//////////////////appListen/////////////////////////
app.listen(3000, function(){
    console.log("Server running");
});
