/* function abc (callback) {
    return callback();
};*/

const to = require("./utils/to").default;
function pq () {
    return new Promise( (resolve, reject) => {
        setTimeout( () => {
            //console.log('Hello');
            resolve("what's up?");
        }, 2000);
    })
};

function pqr () {
        setTimeout( () => {
            console.log("what's up");
        }, 2000);
};

/*
var s = abc(pq);
console.log(s); */

async function abc () {
    console.log('Hey');
    // await pqr(); doesn't make a difference as pqr does not return a promise
    //let a = await pq();
    //console.log(a);
    console.log('How you doin');
}


//abc();



function A() {
    return "hello";
}

async function B() {
    try {
    a = await to(A());
    console.log(a);
    }
    catch(err) {
        throw (err);
    }
}

B();



/*

app.post('/register', async (req, res) => {

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
    try{
    [err, result] =await to(db.query(query1));}
    catch(err) {console.log(err); return res.send(err);}
    if(result.length == 0) { //unique username

        if(pass1 == pass2) { //passwords match
            query2 = `insert into users (name,username,email,password) values ('${user.name}','${user.username}','${user.email}',${user.pass1})`;
            try {[err, result] = await to(db.query(query2));}
            catch(err) {console.log(err); return res.send(err);}
            { msg ='Successfully registered! Please Login'; res.render('register',{ msg }); }
        } else { //passwords do not match
            msg = 'Passwords do not match';
            res.render('register', {msg} );
        }

    } else { //username exists
        msg = 'username already exists';
        res.render('register', {msg} );
    }


});*/