const functions = require("firebase-functions");
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();

const firebaseConfig = {
    apiKey: "AIzaSyBxu08rqeCJAXW-cwj91jsIO3B16y6GJ9g",
    authDomain: "lxai-mentor-matching.firebaseapp.com",
    projectId: "lxai-mentor-matching",
    storageBucket: "lxai-mentor-matching.appspot.com",
    messagingSenderId: "943361642853",
    appId: "1:943361642853:web:ea8a3c18cd857ce164d18c",
    measurementId: "G-4E5GEQJQTX"
};

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

// Helper functions for validation of signup form
// Check if a field is empty
const isEmpty = (string) => {
  if(string.trim() === '') return true;
  else return false;
}

// Check if an email is valid in format
const isEmail = (email) => {
  const regEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if(email.match(regEx)) return true;
  else return false;
}

// Check if user has a token for being logged in
const FBAuth = (req, res, next) => {
  let idToken;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error('No token found');
    return res.status(403).json({error: 'Unauthorized'});
  }

  admin.auth().verifyIdToken(idToken)
  .then(decodedToken => {
    req.user = decodedToken;
    console.log(decodedToken);
    return db.collection('users')
    .where('userId', '==', req.user.uid)
    .limit(1)
    .get();
  })
  .then(data => {
    req.user.handle = data.docs[0].data().handle;
    return next();
  })
  .catch((err) => {
    console.error('Error while verifying token', err);
    return res.status(403).json({err})
  })
}

// Testing post functionality for social media feed posts
// app.post('/screams', FBAuth, (req, res) => {

//   const newScream = {
//     body: req.body.body,
//     userHandle: req.user.handle,
//     createdAt: new Date().toISOString()
//   };

//   db.collection('screams').add(newScream).then((doc) => {
//     res.json({ message: `document ${doc.id} created successfully` })
//   })
//   .catch((err) => {
//     res.status(500).json({ error: 'something went wrong' });
//     console.error(err);
//   })
// });

// Signup route
app.post("/signup", async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // Validating the fields for user signup
  let errors = {};
  if(isEmpty(newUser.email)) {
    errors.email = 'Must not be empty'
  } else if(!isEmail(newUser.email)) {
    errors.email = 'Must be a valid email'
  };
  if(isEmpty(newUser.password)) errors.password = 'Must not be empty';
  if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = 'Passwords do not match';
  if(isEmpty(newUser.handle)) errors.handle = 'Must not be empty';

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);

  const userDoc = await db.doc(`/users/${newUser.handle}`).get()
  if (userDoc.exists) {
    return res.status(400).json({ handle: 'This handle already taken'});
  } else {
    // Create user
    let userId;
    await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((userToken) => {
      // Add User to Users Collection
      const uToken = userToken;
      const userCredentials = {
          handle: newUser.handle,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          token: uToken,
          userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials)
    })
    .then(() => {
      return res.status(201).json({message: 'User created successfully'});
    })
    .catch((err) => {
      console.error(err);
      if(err.code === 'auth/email-already-in-use'){
        return res.status(400).json({ email: 'Email is already in use'});
      } else {
        return res.status(500).json({error: err.code});
      }
    })
  }
})

// Sign In
app.post('/login', (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  // Initial validation that credential were properly entered
  let errors = {};
  if(isEmpty(user.email)) errors.email = "Must not be empty";
  if(isEmpty(user.password)) errors.password = "Must not be empty";

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);

  
  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
  .then((data) => {
     return data.user.getIdToken();
  })
  .then(token => {res.json({token})
  })
  .catch(err => {
    console.error(err);
    if(err.code === 'auth/wrong-password'){
      return res.status(403).json({general: 'Wrong credentials'})
    } else {
      return res.status(500).json({error: err.code});
    }
  })
})

// export api allows us to use express for our function formating
exports.api = functions.https.onRequest(app);