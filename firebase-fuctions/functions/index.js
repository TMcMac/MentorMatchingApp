const functions = require("firebase-functions");
const app = require('express')();

const { postOneScream } = require('./handlers/screams'); // Not Working
const { signup, login, uploadImage } = require('./handlers/users');
const { FBAuth } = require('./util/fbAuth');


// Scream routes - Testing post functionality for social media feed posts
app.post('/screams', FBAuth, postOneScream); // Error: Route.post() requires a callback function but got a [object Undefined]

// Signup route
app.post("/signup", signup);

// Sign In route
app.post('/login', login);

// Upload an image route
app.post('/users/image', FBAuth, uploadImage);

// export api allows us to use express for our function formating
exports.api = functions.https.onRequest(app);