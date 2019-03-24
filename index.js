var express      = require("express"),
    app          = express(),
    badyParser   = require("body-parser"),
    mongoose     = require("mongoose");

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true});

app.use(badyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var db = mongoose.connection;

    //define a pattern for the documents
    var campgroundSchema = new mongoose.Schema({
        name: String,
        image: String,

    });

    Campground = mongoose.model('Campground', campgroundSchema);
    // Campground.create(
    //     {
    //         name: "Second Ground",
    //         image: "https://farm4.staticflickr.com/3211/3062207412_03acc28b80.jpg"
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

app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if(err) {
                console.log("ERROR");
            }else{
                res.render("campgrounds", {campgrounds: allCampgrounds});
            }
        });
});

app.post("/campgrounds", function(req, res){
    var name= req.body.name;
    var img = req.body.image;
    Campground.create(
        {
            name: name,
            image: img,
        }, function(err, campground){
            if(err){
                console.log("ERROR");
            }else{
                res.redirect("/campgrounds");
            }
        });

});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("Server running");
});
