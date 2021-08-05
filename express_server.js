const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
//const bodyParser = require("body-parser");

var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "asd"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "aassdd"
  }
}


app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.cookies['user_id']] };
  res.render("urls_new", templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const urlId = req.params.shortURL
  delete urlDatabase[urlId];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect(`/urls`);
});

app.get("/urls/:shortURL", (req, res) => {
  
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL],user: users[req.cookies['user_id']]};
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  //console.log('changed again');
  //console.log('testing',users[req.cookies['user_id']]);
  const user = users[req.cookies['user_id']] ? users[req.cookies['user_id']] : undefined ;
  const templateVars = { urls: urlDatabase, user};
  res.render("urls_index", templateVars );
  
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(5);
  urlDatabase[shortURL] = req.body.longURL;
  console.log(req.body);  // Log the POST request body to the console
  
  res.redirect(`/urls/${shortURL}`);
  
});
app.get('/login', (req, res) =>  {
  const templateVars = { user: null };
  res.render('login',templateVars);
});

app.post("/login", (req, res) => {
  console.log('response body after login',req.body);
  //checking for the email submitted through login form vs present in users object
  if(checkingEmailIfAlreadyExists(users,req)){
    //check for the password enter via form vs present in the users object
    let flag = 0;
    for(let total in users) {
      //console.log('checking',users[total]['password'],req.body.password);
      if(req.body.email === users[total]['email']){
        if(users[total]['password'] === req.body.password){
          console.log('password matched');
          flag = 1;
          res.cookie('user_id', users[total]['id']);
        }
      }
       
    }
    if(flag !== 1 ){
      res.status('403').send('password doesnt match');
    }
    
  }else{
    res.status('403').send('Email doesnt exists');
  }
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  console.log('testing logout')
  res.clearCookie('user_id')
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  console.log(res.statusCode);
  const longURL = urlDatabase[req.params.shortURL]; 
  console.log('u - longUrl:', longURL);
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  const templateVars = { user: null};
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  console.log(req.body);
  const id = generateRandomString(5);
  if(req.body.email === '' || req.body.password === '') {
    return res.status('400').send('Invalid email or password');
  } 
  if(!checkingEmailIfAlreadyExists(users, req)){
    //if email is not in users then only add the new email into the users object
    users[id] = {'id': id, 'email': req.body.email, 'password': req.body.password }
    //setting cookies from server in the browser
    res.cookie('user_id', id);
    console.log(users);
    res.redirect('/urls');
  }else{
    res.status('400').send('Email already exists');
  }
  
  
});

function checkingForPasswordMatch(obj,req){
  
}

function checkingEmailIfAlreadyExists(obj, req){
  for(let total in obj ){
    console.log(users[total]['email']);
    if(users[total]['email'] === req.body.email){
      console.log('email already exists');
      console.log(users);
      return true;
    }
    return false;
  }
}
function generateRandomString(length) {
  
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;

}

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});