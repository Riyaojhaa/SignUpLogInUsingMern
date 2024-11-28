// const {google} = require('googleapis') ;

// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

// exports.oauth2client = new google.auth.OAuth2(
//     GOOGLE_CLIENT_ID ,
//     GOOGLE_CLIENT_SECRET ,
//     'postmessage'
// )

const { google } = require('googleapis');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

exports.oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage' // or your actual redirect URI if different
);

console.log('Google Client ID:', GOOGLE_CLIENT_ID);
console.log('Google Client Secret:', GOOGLE_CLIENT_SECRET);
