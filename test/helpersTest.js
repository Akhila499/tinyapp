const { assert } = require('chai');

const { getUserByEmail, generateRandomString, urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
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
describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    };
    // Write your assert statement here

    assert.deepEqual(user,expectedOutput);
  });
  it('should return a undefined with invalid email', function() {
    const user = getUserByEmail("invalid@invalid.com", testUsers)
    const expectedOutput = undefined;
    // Write your assert statement here

    assert.deepEqual(user,expectedOutput);
  });
});

describe('generateRandomString', function() {
  it('should return 6 if length is 6', function() {
    const strlength = generateRandomString(6).length;
    const expectedOutput = 6;
    assert.equal(strlength, expectedOutput);
  });
});

describe('urlsForUser', function() {
  it('should return false if condition matches', function() {
    const actual = urlsForUser(testUsers['userRandomID']['id'],urlDatabase['b2xVn2']);
    const expectedOutput = false;
    assert.equal(actual, expectedOutput);
  });
});
