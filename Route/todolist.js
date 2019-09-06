var express = require('express');
var router = express.Router();
var passport = require('passport');
var Todo = require('../module/tododetails'),
    User = require('../module/user');
router.get('/', (req,res) => {
    res.render('home');
});

router.get('/:userid/todo', isloggedin,(req, res) => {
    User.findById(req.params.userid).populate('todo').exec((error,user)=>{
        if (!error) {
            return res.render('todo', { todo: user.todo});
        }
        return res.redirect('/');
    })
});

router.post('/:userid/todo', isloggedin,(req, res) => {
    User.findById(req.params.userid, (error, user) => {
        if (!error) {
            Todo.create({ tittle: req.body.tittle, startdate: new Date().toDateString() }, (err, todo) => {
                if (!err) {
                    user.todo.push(todo);
                    user.save();
                    return res.redirect('back');
                }
                req.flash('error', err.message);
                return res.redirect("/");
            });
        }
    })
});

router.get('/todo/delete/:todoid', isloggedin, (req, res) => {
    Todo.findByIdAndDelete(req.params.todoid, (err) => {
        if (!err) {
            return res.redirect('back');
        }
        return res.redirect("/");
    });
});
router.post('/:userid/todo/:todoid/update', (req, res) => {
    Todo.findByIdAndUpdate(req.params.todoid,req.body.todo, (err, todo) => {
        if (!err) {
            return res.redirect("/"+req.params.userid+"/todo");
        }
        return res.redirect('/');
     })
})
router.get("/todo/details/:todoid",isloggedin, (req, res) => {
    Todo.findById(req.params.todoid, (err, todo) => {
        res.render("details", { todo: todo });
    });
});
router.get('/login', (req, res) => {
    res.render("login");
});

router.get('/signup', (req, res) => {
    res.render("signup");
})

router.post('/signup', (req, res) => {
    var userName = new User({ username: req.body.username });
    User.register(userName, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message)
            return res.redirect("/signup");
        }
            passport.authenticate("local")(req, res, function () {
            res.redirect("/"+ user._id+"/todo");
        });
    });
})

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/",
}), function (req, res) {
        res.redirect("/" + req.user._id + "/todo")
});

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isloggedin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Sign Up first,If you have an account then Login.");
    return res.redirect('/signup');
}

module.exports = router;