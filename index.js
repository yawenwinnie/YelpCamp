var express      = require("express"),
    app          = express(),
    badyParser   = require("body-parser"),
    mongoose     = require("mongoose");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true});

app.use(badyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//define a pattern for the documents
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
});

Campground = mongoose.model('Campground', campgroundSchema);
        //
        // Campground.create(
        //     {
        //         name: "Second Ground",
        //         image: "https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg",
        //         description: "This is a huge hill",
        //
        //     }, function(err, campground){
        //         if(err){
        //             console.log("ERROR");
        //         }else{
        //             console.log('Newly created campground');
        //             console.log(campground);
        //         }
        //     });

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



//SHOW, must be decalred after /new
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.error.bind(console, "error");
        }else{
            res.render("show", {campground: foundCampground});
        }

    });
});

app.listen(3000, function(){
    console.log("Server running");
});
