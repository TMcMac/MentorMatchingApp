const { admin, db } = require('../util/admin');
const firebase = require('firebase');

const config = require('../util/config');
firebase.initializeApp(config);

const { validateSignupData, validateLoginData, reduceUserDetails } = require('../util/validators');

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
    const noImg = 'no-img.png';
  
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
            imgURL: `https://firebasetorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
            userId
        };
        db.doc(`/users/${newUser.handle}`).set(userCredentials)
        return userToken
      })
      .then((userToken) => {
        return res.status(201).json({message: 'User created successfully', token: userToken});
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

// Upload an image for user profile page
exports.uploadImage = (req, res) => {
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');

    const busboy = BusBoy({ headers: req.headers });

    let imageFileName;
    let imageToBeUploaded = {};

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/jpeg' && mimetype !== 'image/png' && mimetype !== 'image/jpg'){
            return res.status(400).json({error: 'Wrong file type, please use JPG/JPEG/PNG'});
        }
        const fileName = filename.filename + '';
        const imageExtention = fileName.split('.')[fileName.split('.').length - 1];
        // Not sure why we need to change file name but this is the tutorial recommendation
        imageFileName = `${Math.round(Math.random() * 10000000000)}.${imageExtention}`;
        console.log(imageFileName);
        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filePath, mimetype};
        file.pipe(fs.createWriteStream(filePath))
    });
    busboy.on('finish', () => {
        admin.storage().bucket().upload(imageToBeUploaded.filePath, {
            resumable: false,
            metadata: {
                metadata: {
                    contentType: imageToBeUploaded.mimetype
                }
            }
        })
        .then( () => {
            const imgURL = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`
            return db.doc(`/users/${req.user.handle}`).update({ imgURL });
        })
        .then(() => {
            return res.json({ message: 'Image uploaded successfully'});
        })
        .catch(err => {
            console.error(err);
            return res.status(500).json({ error: err.code });
        })
    })
    busboy.end(req.rawBody);
}

// Add user details to user collection in db / user profile in react
exports.addUserDetails = (req, res) => {
    let userDetails = reduceUserDetails(req.body);

    db.doc(`/users/${req.user.handle}`).update(userDetails)
    .then(() => {
        return res.status(200).json({ message: 'Details added successfully' });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}