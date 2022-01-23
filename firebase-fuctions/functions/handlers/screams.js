const { db } = require('../util/admin');

exports.postOneScream = (req, res) => {

    const newScream = {
        body: req.body.body,
        userHandle: req.user.handle,
        createdAt: new Date().toISOString()
    };

    db.collection('screams').add(newScream).then((doc) => {
        res.json({ message: `document ${doc.id} created successfully` })
    })
    .catch((err) => {
        res.status(500).json({ error: 'something went wrong' });
        console.error(err);
    })
};