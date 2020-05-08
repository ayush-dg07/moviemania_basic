const express = require('express');
const path = require('path');

//routes
const user = require('./routes/user');
const admin = require('./routes/admin');
const auth = require('./routes/auth');

const session = require('express-session');

const app = express();
//connect to db
/*db.connect( (err) => {
    if(err) throw err; 
    else console.log('Database connected');
});*/

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: "secret-key",
      cookie: { maxAge: 604800000 }
    })
  );
  
//insert new movie
app.get('/addmovie', admin.showAddForm);
app.post('/addmovie', admin.addMovie);

//homepage
app.get('/', auth.redirectLogin, auth.showHomePage);

//movie page
app.get('/movie/:id', auth.redirectLogin, user.showMovie);

//search page
//app.get('/searchhome',user.showSearchPage); --not needed, add headings to searchresult page -index not needed

//search
app.get('/search', user.search);

//register
app.get('/register', auth.redirectHome, auth.showRegisterForm);
app.post('/register', auth.register);

//login
app.get('/login', auth.redirectHome, auth.showLoginForm);
app.post('/login', auth.login);

//user homepage
app.get('/home',auth.redirectLogin, auth.showUserHomePage);

//reviews
app.post('/movie/:id',auth.redirectLogin, user.postReview);

//show edit form
app.get('/review/:id', auth.redirectLogin, auth.checkUserForReview, user.showEditForm);

//edit or delete reviews
app.post('/review/:id',auth.redirectLogin, auth.checkUserForReview, user.editOrDeleteReview);


//logout
app.post('/logout', auth.redirectLogin, auth.logout);


app.listen(process.env.PORT, () => {
    console.log('Server started');
});
