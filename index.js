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

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

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

//requiring routes
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);
// ============================
//     APP LISTEN
// ============================
app.listen(3000, function(){
    console.log("Server running");
});
