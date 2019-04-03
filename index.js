var express       = require("express"),
    app           = express(),
    badyParser    = require("body-parser"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose      = require("mongoose"),
    Campground    = require('./models/campground'),
    Comment       = require('./models/comment'),
    User          = require('./models/user');
    seedDB        = require('./seeds');


mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true});

app.use(badyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
// seedDB();

///////////////////Passport configuration///////////
app.use(require("express-session")({
    secret: "Roger is the best boyfriend",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//encoding and putting back into the session
passport.deserializeUser(User.deserializeUser());//unencoding the session

//easy way of adding currentUser parameter to every route
//middleware for every single route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;//currentUser is now available in every template
    next();
});
//////////////////////Routing///////////////////////////
app.get("/", function(req, res){
    res.render("landing");
});

//===========================
//  CAMPGROUNDS ROUTES
//===========================

//INDEX
app.get("/campgrounds", function(req, res){
        Campground.find({}, function(err, allCampgrounds){
            if(err) {
                console.log("ERROR");
            }else{
                res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
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
app.get("/campgrounds/:id/comments/new", isLogedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })

});

app.post("/campgrounds/:id/comments", isLogedIn, function(req, res){
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

// ============================
//      AUTHENTICATION ROUTES
// ============================
app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req,res, function(){
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){

});

app.get("/logout", function(req,res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLogedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}
// ============================
//     APP LISTEN
// ============================
app.listen(3000, function(){
    console.log("Server running");
});
