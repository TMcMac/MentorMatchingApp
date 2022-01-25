const functions = require("firebase-functions");
const app = require('express')();

const { postOneScream } = require('./handlers/screams'); // Not Working
const { signup, login, uploadImage, addUserDetails } = require('./handlers/users');
const { addMentee, getMentees, updateMentee } = require('./handlers/mentees');
const { addMentor, getMentors, updateMentor } = require('./handlers/mentors');


const { FBAuth } = require('./util/fbAuth');

//**POST ROUTES**
// Scream routes - Testing post functionality for social media feed posts
app.post('/screams', FBAuth, postOneScream); // Error: Route.post() requires a callback function but got a [object Undefined]

// Signup route
app.post("/signup", signup);

// Sign In route
app.post('/login', login);

// Upload an image route
app.post('/users/image', FBAuth, uploadImage);

// Add details to user profile
app.post('/users', FBAuth, addUserDetails);

// Mentee Signup / Update
app.post('/mentees', FBAuth, addMentee);
app.post('/mentees', FBAuth, updateMentee);
// Mentor Signup
app.post('/mentors', FBAuth, addMentor);
app.post('/mentors', FBAuth, updateMentor);

//**GET ROUTES**

// Get all mentees
app.get('/mentees', getMentees);
// Get all mentors
app.get('/mentors', getMentors);
// export api allows us to use express for our function formating
exports.api = functions.https.onRequest(app);