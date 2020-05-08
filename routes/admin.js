const db = require('../config/connection');

let admin = {};

admin.showAddForm = (req, res) => {
    msg = "";
    res.render('addmovie',{msg});
}

admin.addMovie = (req, res) => {
    let msg= '';
    let movie = {
        name: req.body.name,
        director: req.body.director,
        genre: req.body.genre 
    }
    if(!movie.name || !movie.director ||!movie.genre) {
        msg = "Please enter necessary details!"
    }
    else msg ='Movie successfully added!'
    const sql = `insert into movies (name, director, genre) values('${movie.name}','${movie.director}','${movie.genre}')`;
    db.query( sql, movie, (err, result) => {
        if(err) { msg ='Error in inserting'; throw err; }
        res.render('addmovie',{msg});
    });

}

module.exports=admin;
