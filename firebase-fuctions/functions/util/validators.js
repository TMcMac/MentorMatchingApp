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

//Validate signup credential entered
exports.validateSignupData = (data) => {
    let errors = {};

    if(isEmpty(data.email)) {
      errors.email = 'Must not be empty'
    } else if(!isEmail(data.email)) {
      errors.email = 'Must be a valid email'
    };
    if(isEmpty(data.password)) errors.password = 'Must not be empty';
    if(data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if(isEmpty(data.handle)) errors.handle = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    };
}

// Validate Login Credentials entered
exports.validateLoginData = (data) => {
    let errors = {};
    if(isEmpty(data.email)) errors.email = "Must not be empty";
    if(isEmpty(data.password)) errors.password = "Must not be empty";
  
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};
    
// User Details Updater - Checks for non-answers/blanks and return dict
exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.fullName.trim())) userDetails.fullName = data.fullName;
    if(!isEmpty(data.jobTitle.trim())) userDetails.jobTitle = data.jobTitle;
    if(!isEmpty(data.affiliation.trim())) userDetails.affiliation = data.affiliation;
    if(!isEmpty(data.homeLocation.trim())) userDetails.homeLocation = data.homeLocation;
    if(!isEmpty(data.isLatinX.trim())) userDetails.isLatinX = data.isLatinX;
    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())) {
        // If user doesn't include the http://
        if(data.website.trim().substring(0, 4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`
        } else userDetails.website = data.website;
    }
    if(!isEmpty(data.publicProfile.trim())) userDetails.publicProfile = data.publicProfile;

    return userDetails;
}

// Mentee Details Updater - Checks for non-answers/blanks and return dict
exports.reduceMenteeDetails = (data) => {
    const answers = data.body
    let menteeDetails = {};
   
    // Things we can pull from the data.user or just geneate 
    menteeDetails.createdAt = new Date().toISOString();
    menteeDetails.userId = data.user.uid;
    menteeDetails.email = data.user.email;
    menteeDetails.handle = data.user.handle;

    //Things we can pull from the user's info in the user collection
    menteeDetails.fullName = answers.fullName;
    menteeDetails.isLatinX = answers.isLatinX;
    menteeDetails.currentLocation = answers.currentLocation;
    

    // Questions we need to ask in the mentee sign up flow
    if(!isEmpty(answers.gender.trim())) menteeDetails.gender = answers.gender;
    if(!isEmpty(answers.countryOrigin.trim())) menteeDetails.countryOrigin = answers.countryOrigin;
    if(!isEmpty(answers.affiliation.trim())) menteeDetails.affiliation = answers.affiliation;
    if(!isEmpty(answers.position.trim())) menteeDetails.position = answers.position;
    if(!isEmpty(answers.scholarOrWebsite.trim())) {
        // If user doesn't include the http://
        if(answers.scholarOrWebsite.trim().substring(0, 4) !== 'http'){
            menteeDetails.scholarOrWebsite = `http://${answers.scholarOrWebsite.trim()}`
        } else menteeDetails.scholarOrWebsite = answers.scholarOrWebsite;
    }
    if(answers.languages.length > 0) menteeDetails.languages = answers.languages;
    if(!isEmpty(answers.timezone.trim())) menteeDetails.timezone = answers.timezone;
    if(answers.mentorshipArea.length > 0) menteeDetails.mentorshipArea = answers.mentorshipArea;
    if(!isEmpty(answers.motivationStatement.trim())) menteeDetails.motivationStatement = answers.motivationStatement;
    if(answers.prefferedOutcomes.length > 0) menteeDetails.prefferedOutcomes = answers.prefferedOutcomes;
    if(!isEmpty(answers.discussAfter.trim())) menteeDetails.discussAfter = answers.discussAfter;
    if(!isEmpty(answers.careerGoals.trim())) menteeDetails.careerGoals = answers.careerGoals;
    if(answers.skillMentorship.length > 0) menteeDetails.skillMentorship = answers.skillMentorship;
    if(answers.researchAreas.length > 0) menteeDetails.researchAreas = answers.researchAreas;
    if(answers.careerAdvice.length > 0) menteeDetails.careerAdvice = answers.careerAdvice;
    if(!isEmpty(answers.workshopReviewer)) menteeDetails.workshopReviewer = answers.workshopReviewer;
    if(!isEmpty(answers.peerReviewedPubs.trim())) menteeDetails.peerReviewedPubs = answers.peerReviewedPubs;
    if(!isEmpty(answers.topTierReviewer.trim())) menteeDetails.topTierReviewer = answers.topTierReviewer;
    if(!isEmpty(answers.topTierPub.trim())) menteeDetails.topTierPub = answers.topTierPub;
    if(!isEmpty(answers.highImpactReviewer.trim())) menteeDetails.highImpactReviewer = answers.highImpactReviewer;
    if(answers.conferencePreference.length > 0) menteeDetails.conferencePreference = answers.conferencePreference;
    if(!isEmpty(answers.otherConferences.trim())) {
        let conferences = answers.otherConferences.split(',');
        menteeDetails.conferencePreference = menteeDetails.conferencePreference.concat(conferences);
    };
    if(!isEmpty(answers.peerReviewedHighImpact)) menteeDetails.peerReviewedHighImpact = answers.peerReviewedHighImpact;

    return menteeDetails;
}


// Mentee Details Updater - Checks for non-answers/blanks and return dict
exports.reduceMentorDetails = (data) => {
    const answers = data.body
    let mentorDetails = {};
    
    // Things we can pull from the data.user or just geneate 
    mentorDetails.createdAt = new Date().toISOString();
    mentorDetails.userId = data.user.uid;
    mentorDetails.email = data.user.email;
    mentorDetails.handle = data.user.handle;

    //Things we can pull from the user's info in the user collection
    mentorDetails.fullName = answers.fullName;
    mentorDetails.isLatinX = answers.isLatinX;
    mentorDetails.currentLocation = answers.currentLocation;
    

    // Questions we need to ask in the mentor sign up flow
    if(!isEmpty(answers.gender.trim())) mentorDetails.gender = answers.gender;
    if(!isEmpty(answers.countryOrigin.trim())) mentorDetails.countryOrigin = answers.countryOrigin;
    if(!isEmpty(answers.affiliation.trim())) mentorDetails.affiliation = answers.affiliation;
    if(!isEmpty(answers.position.trim())) mentorDetails.position = answers.position;
    if(!isEmpty(answers.scholarOrWebsite.trim())) {
        // If user doesn't include the http://
        if(answers.scholarOrWebsite.trim().substring(0, 4) !== 'http'){
            mentorDetails.scholarOrWebsite = `http://${answers.scholarOrWebsite.trim()}`
        } else mentorDetails.scholarOrWebsite = answers.scholarOrWebsite;
    }
    if(answers.languages.length > 0) mentorDetails.languages = answers.languages;
    if(!isEmpty(answers.timezone.trim())) mentorDetails.timezone = answers.timezone;
    if(!isEmpty(answers.previousMentor.trim())) mentorDetails.previousMentor = answers.previousMentor;
    if(answers.mentorshipArea.length > 0) mentorDetails.mentorshipArea = answers.mentorshipArea;
    if(!isEmpty(answers.hoursAvailable.trim())) mentorDetails.hoursAvailable = answers.hoursAvailable;
    if(answers.menteePref.length > 0) mentorDetails.menteePref = answers.menteePref;
    if(!isEmpty(answers.otherPref.trim())){
        let menteePrefs;
        let newPref;
        if(mentorDetails.menteePref.length !== 0)
            menteePrefs = mentorDetails.menteePref;
        else
            menteePrefs = [];
        newPref = answers.otherPref.split(',');
        menteePrefs = menteePrefs.concat(newPref)
        mentorDetails.menteePref = menteePrefs;
    }
    if(answers.prefferedOutcomes.length > 0) mentorDetails.prefferedOutcomes = answers.prefferedOutcomes;
    if(!isEmpty(answers.otherOutcomes.trim())){
        let outcomes;
        let newPref;
        if(mentorDetails.prefferedOutcomes.length !== 0)
            outcomes = mentorDetails.prefferedOutcomes;
        else
            outcomes = [];
        newPref = answers.otherPref.split(',');
        outcomes = outcomes.concat(newPref)
        mentorDetails.prefferedOutcomes = outcomes;
    }
    if(!isEmpty(answers.discussAfter.trim())) mentorDetails.discussAfter = answers.discussAfter;
    if(answers.skillMentorship.length > 0) mentorDetails.skillMentorship = answers.skillMentorship;
    if(answers.researchAreas.length > 0) mentorDetails.researchAreas = answers.researchAreas;
    if(answers.careerAdvice.length > 0) mentorDetails.careerAdvice = answers.careerAdvice;
    if(!isEmpty(answers.workshopReviewer)) mentorDetails.workshopReviewer = answers.workshopReviewer;
    if(!isEmpty(answers.peerReviewedPubs.trim())) mentorDetails.peerReviewedPubs = answers.peerReviewedPubs;
    if(!isEmpty(answers.topTierReviewer.trim())) mentorDetails.topTierReviewer = answers.topTierReviewer;
    if(!isEmpty(answers.topTierPub.trim())) mentorDetails.topTierPub = answers.topTierPub;
    if(!isEmpty(answers.highImpactReviewer.trim())) mentorDetails.highImpactReviewer = answers.highImpactReviewer;
    if(answers.conferencePreference.length > 0) mentorDetails.conferencePreference = answers.conferencePreference;
    if(!isEmpty(answers.otherConferences.trim())) {
        let otherconferences = answers.otherConferences.split(',');
        let conferences = mentorDetails.conferencePreference;
        conferences = conferences.concat(otherconferences)
        mentorDetails.conferencePreference = conferences;
    };
    if(!isEmpty(answers.peerReviewedHighImpact)) mentorDetails.peerReviewedHighImpact = answers.peerReviewedHighImpact;

    return mentorDetails;
}