const getUserByEmail = function(email, userDb) {
  // lookup magic...
  const  keys = Object.keys(userDb);
  for(let key of keys){
    if(userDb[key]['email'] === email){
      console.log(userDb[key]);
      return userDb[key];
    }
  }
};

const  generateRandomString = function(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
 }
 return result;
};


const urlsForUser = function(id, input){ 

  if(!id || input.userID !== id ){
    return true;
  }else{
    return false;
  }
  
};

 module.exports = { getUserByEmail, generateRandomString, urlsForUser};