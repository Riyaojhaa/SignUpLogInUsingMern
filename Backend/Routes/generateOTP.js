const otpGenerator = require('otp-generator');

const generateOTP = () => {
    // Generate a 6-digit OTP with only numbers
    // const OTP = otpGenerator.generate(6, { 
    //     upperCaseAlphabets: false, 
    //     specialChars: false, 
    //     digits: true 
    // });
     // Generate a random 6-digit OTP number and ensure it's zero-padded if necessary
     const OTP = Math.floor(100000 + Math.random() * 900000).toString();

     // Add a space between each digit
      return OTP ;

};

module.exports = generateOTP; // Corrected export to the function, not the result
