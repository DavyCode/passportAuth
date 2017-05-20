var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');


var db = mongoose.connect("mongodb://localhost:27017/passportAuth", (err) => {
    (err) ? console.error(err, 'Error Connecting to Database!'): console.log('DB Connected. Build Safely!');
});
var app = express();
app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('express-session')({
    secret: "boom boom boom",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =================
//     ROUTES 
// ===============
app.get('/', (req, res) => {
    res.render('home');
});


app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret')
});

// Auth Routes
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    req.body.username
    req.body.password
    User.register(new User({ username: req.body.username }), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/secret')
        });
    })
});


// Login Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), (req, res) => {

});


app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}


app.listen(3000, () => {
    console.log('app listening on port 3000........')
})