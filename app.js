var express               = require('express'),
    app                   = express(),
    PORT                  = 8080 || process.env.PORT,
    TODO                  = require('./Route/todolist'),
    mongoose              = require('mongoose'),
    bodyParser            = require('body-parser'),
    methodOverride        = require('method-override'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User                  = require('./module/user'),
    flash = require('connect-flash');
    
app.use(require('express-session')({
    secret: 'I am a Web Developer',
    saveUninitialized: false,
    resave: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var Todo = require('./module/tododetails');
app.use(bodyParser.urlencoded({
    extended: true
}))
mongoose.connect('mongodb://localhost/todolist', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.use(function (req, res, next) {
    res.locals.user = req.user;
    res.locals.error = req.flash('error');
    next();
})
app.use(TODO);

app.listen(PORT, () => {
    console.log("Server Start on PORT : ", PORT);
})