const { db } = require('../util/admin');
const firebase = require('firebase');

const config = require('../util/config');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData } = require('../util/validators');

exports.signup = async (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      handle: req.body.handle
    };
  
    // Validating the fields for user signup
    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);
  
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
};

exports.login = (req, res) => {
    const user = {
      email: req.body.email,
      password: req.body.password
    };
  
    // Validating the fields for user login
    const { valid, errors } = validateLoginData(user);

    if(!valid) return res.status(400).json(errors);

    // Log the user in and get a token
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
};