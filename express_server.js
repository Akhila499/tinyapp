const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});


app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(5);
  urlDatabase[shortURL] = req.body.longURL;
  console.log(req.body);  // Log the POST request body to the console
  
  res.redirect(`/urls/${shortURL}`);
  
});

app.get("/u/:shortURL", (req, res) => {
  console.log(res.statusCode);
  const longURL = urlDatabase[req.params.shortURL]; 
  console.log('u - longUrl:', longURL);
  res.redirect(longURL);
});


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