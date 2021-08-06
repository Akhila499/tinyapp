const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const cookieSession = require('cookie-session');
const { getUserByEmail, generateRandomString, urlsForUser } = require('./helpers');

app.use(cookieSession({ name: 'session', keys: ['key1', 'key2'] }));

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

const bcrypt = require('bcrypt');

const urlDatabase = {
  "b2xVn2": {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  '9sm5xK':{
    longURL: "http://www.google.com",
    userID: "user2RandomID"
  }
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
  const templateVars = { user: users[req.session['user_id']] };
  res.render("urls_new", templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const urlId = req.params.shortURL
  delete urlDatabase[urlId]['userID'];
  res.redirect('/urls');
});

app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] ={ 'longURL': req.body['longURL'], userID: req.session.user_id} ;
  res.redirect(`/urls`);
});

app.get("/urls/:shortURL", (req, res) => {

    const shortURL = req.params.shortURL;
    const userId = req.session['user_id'];
    
    if(!urlsForUser(userId,urlDatabase[shortURL])){
        const templateVars = { shortURL: req.params.shortURL, 'longURL': urlDatabase[req.params.shortURL]['longURL'],user: users[userId]};
        res.render("urls_show", templateVars);
    }else{
      res.status('403').send(`you cannot view this page. <html><a href='/urls'> Click here to go back</a></html>`);
    }

});


app.get("/urls", (req, res) => {
    const user = users[req.session['user_id']] ? users[req.session['user_id']] : undefined ;
    let myUrls = [];
    for(let shorturl in urlDatabase){
      if(urlDatabase[shorturl]['userID'] === req.session['user_id']){
        myUrls.push(shorturl);
      }
    }
    const templateVars = { urls: myUrls, user, urlDatabase};
    res.render("urls_index", templateVars );
});

app.post("/urls", (req, res) => {

  if(Object.keys(req.session).length !== 0 ){
    const shortURL = generateRandomString(5);
    urlDatabase[shortURL] = { 
      longURL: req.body.longURL, 
      userID: req.session.user_id 
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.redirect('/login');
  }
  
  
});
app.get('/login', (req, res) =>  {
  const templateVars = { user: null };
  res.render('login',templateVars);
});

app.post("/login", (req, res) => {

  let user = getUserByEmail(req.body.email,users);
  if(user){
    if(bcrypt.compareSync(req.body.password, user['password'])){
      console.log('truthyyyy');
      req.session.user_id = user['id']; 
      return res.redirect("/urls");
    }
    res.status('403').send(`password doesnt match <html><a href='/login'> Try again </a></html>`);
  }
  res.status('403').send(`Email doesnt exists <html><a href='/login'> Try again</a></html>`);
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  //clearing the session
  req.session = null;
  res.redirect('/urls');
});

app.get("/u/:shortURL", (req, res) => {
  console.log(res.statusCode);
  const longURL = urlDatabase[req.params.shortURL]['longURL']; 
  console.log('u - longUrl:', longURL);
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  const templateVars = { user: null};
  res.render('register', templateVars);
});

app.post('/register', (req, res) => {
  
  //Checking for empty input for registration.
  if(req.body.email === '' || req.body.password === '') {
    return res.status('400').send(`Invalid email or password <html><a href='/register'> Try again</a></html>`);
  }

  //if user exist then user variable is an object else undefined
  let user = getUserByEmail(req.body.email,users);
  if(user){
    return res.status('400').send(`Email already exists <html><a href='/register'> Try again</a></html>`);
  }

  //Storing password & hashing when user registers
  const password = req.body.password; // found in the req.params object
  const hashedPassword = bcrypt.hashSync(password, 10);

  //Storing the user credentials into database object.
  const id = generateRandomString(5);
  users[id] = {'id': id, 'email': req.body.email, 'password': hashedPassword }

  //setting cookies from server in the browser
  req.session['user_id'] = id;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});