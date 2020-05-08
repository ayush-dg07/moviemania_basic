const db = require('../config/connection');
const to = require('../utils/to');
let user = {};

// user.showSearchPage = (req, res) => {
//     res.render('index', {title: "Search for a movie"});
// }


user.search = async (req, res) => {
    const key = req.query.term;
    let movies = [];
    //console.log(key);
    let err, result;
    const sql = `select * from movies where name like '%${key}%' or director like '%${key}%' or genre like '%${key}%'`;
    [err, result] = await to(db.query(sql));
            if(err) throw err;
            for (var i = 0; i < result.length; i++) { //storing result of query in an object array
                movies[i] = {
                  id: result[i].id,
                  name: result[i].name,
                  director: result[i].director,
                  genre: result[i].genre
                }
            }
            //console.log(movies);        
            res.render("searchresult", {movies}); //passing the array to the response
    }

user.showMovie = async (req, res) => {
    let id= req.params.id;
    //console.log(id);
    let sql = `select * from movies where id=${id}`;
    let err, result;
    [err, result] = await to(db.query(sql));
     if(err) throw err;
     let  movie = {
                  id: result[0].id,
                  name: result[0].name,
                  director: result[0].director,
                  genre: result[0].genre
                }
    let err2, result2;
    [err2, result2] = await to(db.query(`select avg(rating) as avgrating from reviews where mid = ${id}`));
    if(err2) throw err2; movie.avgrating=result2[0].avgrating;
    //console.log(movie.avgrating);
    sql = `select * from reviews where mid=${id}`;
    let err1, result1;
    [err1, result1] = await to(db.query(sql));
    if(err1) throw err1;
    let reviews = [];
    for(var i = 0; i<result1.length ; i++)
    {
        reviews[i] = {
            id: result1[i].id,
            mid: result1[i].mid,
            uid: result1[i].uid,
            username: result1[i].username,
            author: result1[i].author,
            review: result1[i].review,
            rating: result1[i].rating 
        }

    }
    res.locals.user=req.session.userid;
    res.render("movie", {movie, reviews});
}



//reviews
user.postReview = async (req, res) => {
    
    const review = req.body.review;
    const rating = parseFloat(req.body.rating);
    const {userid, username, name} = req.session;
    const movieid = req.params.id;
    if(review == "" || !rating) return res.redirect(`/movie/${movieid}`);
    sql = 'insert into reviews(mid,uid,username,author,review,rating) values (?,?,?,?,?,?)';

    let err, result;
    [err, result] = await to(db.query(sql, [movieid,userid,username,name,review,rating]));
    
    if(err) throw err;
    else res.redirect(`/movie/${movieid}`);
    
}

user.showEditForm = async (req, res) => {
    const id = req.params.id;
    sql = `select * from reviews,movies where reviews.id = ${id} and reviews.mid = movies.id`;
    let err, result;
    [err, result] = await to(db.query(sql));
    if(err) throw err;
    res.render('editreview', {result});
}

user.editOrDeleteReview = async (req, res) => {
    const id = req.params.id;
    const review = req.body.review;
    const method = req.body._method;
    const rating = parseFloat(req.body.rating);
    if(method == "_post") {
    sql = `update reviews set review = '${review}', rating=${rating} where id = ${id}`;
    let err, result;
    [err, result] = await to(db.query(sql));
    if(err) throw err;
    res.redirect('/home'); }
    else if(method == "_delete") {
        sql = `delete from reviews where id = ${id}`;
        let err, result;
    [err, result] = await to(db.query(sql));
    if(err) throw err;
    res.redirect('/home');
    }
}  



module.exports = user;