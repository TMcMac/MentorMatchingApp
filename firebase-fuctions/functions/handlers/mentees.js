const { db, admin } = require('../util/admin');


const { reduceMenteeDetails } = require('../util/validators');


// Add a mentee to the mentees collection
exports.addMentee = (req, res) => {
    
    let menteeDetails = reduceMenteeDetails(req);

    db.doc(`/mentees/${req.user.handle}`).set(menteeDetails)
    .then(() => {
        return res.status(200).json({ message: 'Details added successfully' });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}

// Get all Mentees from the mentee collection
exports.getMentees = (req, res) => {
    db.collection('mentees').get()
    .then((data) => {
        let mentees = [];
        data.forEach((doc) => {
            mentees.push(doc.data())
        });
        return res.json(mentees);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code })
    })
}

// Update an existing mentee
exports.updateMentee = (req, res) => {
    let menteeDetails = reduceMenteeDetails(req);

    db.doc(`/mentees/${req.user.handle}`).update(menteeDetails)
    .then(() => {
        return res.status(200).json({ message: 'Details added successfully' });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}