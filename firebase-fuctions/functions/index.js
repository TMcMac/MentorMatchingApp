const functions = require("firebase-functions");
const admin = require('firebase-admin');
const app = require('express')();

const firebaseConfig = {
    apiKey: "AIzaSyBxu08rqeCJAXW-cwj91jsIO3B16y6GJ9g",
    authDomain: "lxai-mentor-matching.firebaseapp.com",
    projectId: "lxai-mentor-matching",
    storageBucket: "lxai-mentor-matching.appspot.com",
    messagingSenderId: "943361642853",
    appId: "1:943361642853:web:ea8a3c18cd857ce164d18c",
    measurementId: "G-4E5GEQJQTX"
};


admin.initializeApp(firebaseConfig);
const db = admin.firestore();

// Signup route
app.post("/signup", async (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  const userDoc = await db.doc(`/users/${newUser.handle}`).get()
  if (userDoc.exists) {
    return res.status(400).json({ handle: 'This handle already taken'});
  }

  // Create user
  await admin.auth().createUser({ 
    email: newUser.email, 
    password: newUser.password,
    emailVerified: false,
    disabled: false 
  })
  .then((userRecord) => {
    // Add User to Users Collection
    const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userRecord.uid
    };
    return db.doc(`/users/${newUser.handle}`).set(userCredentials)
  })
  

  // TODO SignIn User


// , uid: `${newUserId}` 
  return res.json({ data: "User created"});
})


// export api allows us to use express for our function formating
exports.api = functions.https.onRequest(app);