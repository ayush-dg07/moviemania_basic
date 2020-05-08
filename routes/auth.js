const db = require('../config/connection');
const to = require ('../utils/to');
const bcrypt = require('bcrypt');
let auth = {};


auth.showRegisterForm = (req, res) => {
    msg ="";
    res.render('register',{ msg});
};


auth.register = async (req, res) => {
    const saltRounds = 10;
    let user = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        pass1: req.body.password1,
        pass2: req.body.password2 
    }
    let msg;
    let err, result;
    query1 = `select * from users where username = '${user.username}'`;
    [err, result] =await to(db.query(query1));
    if(err) {console.log(err); return res.send(err);}
    if(result.length == 0) { //unique username
        if(user.pass1 == user.pass2) { //passwords match
            bcrypt.hash(user.pass1, saltRounds, async (err, hash) => {
                if (err) {  throw err; } 
                query2 = `insert into users (name,username,email,password) values ('${user.name}','${user.username}','${user.email}','${hash}')`;
            [err, result] = await to(db.query(query2));
            if(err) {console.log(err); return res.send(err);}
            { msg ='Successfully registered! Please Login'; res.render('register',{ msg }); }
            });
        } else { //passwords do not match
            msg = 'Passwords do not match';
            res.render('register', {msg} );
        }

    } else { //username exists
        msg = 'username already exists';
        res.render('register', {msg} );
    }
}

auth.showLoginForm = (req, res) => {
    res.render('login', { msg: ""});
}

auth.login = async (req, res) => {
    const user = {
        username: req.body.username,
        password: req.body.password
    }
    //console.log(user);
    sql = `select * from users where username = '${user.username}'`;
    let err, results;
    [err, results] = await to(db.query(sql)); 
   // console.log(results);  console.log(user.password); console.log(results[0].password);
        if(err) { console.log('Here'); throw err; }
        if(results.length==0) return res.render('login', {msg: 'Invalid username'});
        bcrypt.compare(user.password, results[0].password, function(err, result) {
            if (err) { throw err; }
            if(result) { //valid login
                //session store
                req.session.userid = results[0].id;
                req.session.username = results[0].username;
                req.session.name = results[0].name;
                return res.redirect('/home');
            }
            else return res.render('login', {msg: 'Wrong password'}); 
        });
        
}

auth.showHomePage = (req, res) => 
{   
    res.render('index');
}

auth.showUserHomePage = async (req, res) => 
{
    const id = req.session.userid;
     sql = `select * from users where id=${id}`;
     let err, result;
     [err, result] = await to(db.query(sql));
     if(err) throw err;
     sql1 = `select name,reviews.id as rid,review from reviews,movies where reviews.mid=movies.id and reviews.uid=${id}`;
     let err1, result1;
     if(err1) throw err1;
     [err1, result1] = await to(db.query(sql1));
     res.render('home',{result, result1});
 }


 //logout
auth.logout = (req, res) => {
    req.session.destroy( err => {
        return res.redirect('/home');
    })
}

//authmiddleware: 
auth.redirectLogin = (req, res, next) => {
    if(req.session.userid) {
        next();
    }
    else {
        res.redirect('/login');
    }
}

auth.redirectHome = (req, res, next) => {
    if(req.session.userid) {
        res.redirect('/home');
    }
    else {
        next();
    }
}

//check if correct user is authenticated to edit review
auth.checkUserForReview = async (req, res, next) => {
    const rid = req.params.id;
    //console.log(rid);
    const uid = req.session.userid;
    let err, result;
    [err, result] = await to(db.query(`select uid from reviews where id=${rid}`));
    if(err) throw err;
    if(result[0].uid==uid) next();
    else res.redirect('/home');
}



module.exports = auth;