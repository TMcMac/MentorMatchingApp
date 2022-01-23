


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
exports.validateLoginData = (user) => {
    let errors = {};
    if(isEmpty(user.email)) errors.email = "Must not be empty";
    if(isEmpty(user.password)) errors.password = "Must not be empty";
  
    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
};
    