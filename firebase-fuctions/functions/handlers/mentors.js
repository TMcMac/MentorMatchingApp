const { db } = require('../util/admin');


const { reduceMentorDetails } = require('../util/validators');


// Add a mentor to the mentors collection
exports.addMentor = (req, res) => {
    
    let mentorDetails = reduceMentorDetails(req);

    db.doc(`/mentors/${req.user.handle}`).set(mentorDetails)
    .then(() => {
        return res.status(200).json({ message: 'Details added successfully' });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}

// Get all mentors from the mentor collection
exports.getMentors = (req, res) => {
    db.collection('mentors').get()
    .then((data) => {
        let mentors = [];
        data.forEach((doc) => {
            mentors.push(doc.data())
        });
        return res.json(mentors);
    })
    .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code })
    })
}

// Update an existing mentor
exports.updateMentor = (req, res) => {
    let mentorDetails = reduceMentorDetails(req);

    db.doc(`/mentors/${req.user.handle}`).update(mentorDetails)
    .then(() => {
        return res.status(200).json({ message: 'Details added successfully' });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
    })
}