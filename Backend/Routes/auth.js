const jwt = require('jsonwebtoken');
const express = require('express') ;
const router = new express.Router() ;
const bcrypt =  require('bcryptjs');
const nodemailer = require('nodemailer');
const generateOTP = require('./generateOTP'); // No need for parentheses here
const authenticate = require('../middleware/authenticate');
const Register = require("../db/schema");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');


//use nodemailer to mail the otp or something
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: process.env.SMTP_PORT, 
    secure: true, 
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
    },

});

const otpExpirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds

//------------------------------------------------------------------------------------------------------------------------

//SIGN-UP route

router.post("/signup" , async (req , res) => {

    const { firstname , lastname , email , password , checkbox } = req.body ;
    console.log(email);
    
    if(!firstname || !lastname || !email || !password || !checkbox){
        return res.status(400).json({error : "plz filled the field properly"})
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + otpExpirationTime; // Current time + 10 minutes
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: "OTP for Verification",
        text: `Your OTP is: ${otp}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f9; border-radius: 8px;">
        <h2 style="color: #333;">Welcome to Your App, ${firstname}!</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for signing up with us. To complete your registration, please verify your email address using the OTP below.
        </p>
        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
          <h3 style="color: #333;">Your OTP Code</h3>
          <p style="font-size: 24px; font-weight: bold; color: #ff6f61; letter-spacing: 2px;">${otp}</p>
          <p style="font-size: 14px; color: #888;">(This code will expire in 10 minutes)</p>
        </div>
        <p style="font-size: 16px; color: #555;">
          If you did not request this, please ignore this email.
        </p>
        <p style="font-size: 16px; color: #555;">
          Thank you,<br/>
        </p>
      </div>
    `
    };
    

    transporter.sendMail(mailOptions , function(error , info){
        if(error){
            console.log(error , "error in sending email")
        }else {
            console.log("email send successfully")
        }
    })
    try {
    
        const userExist = await Register.findOne({email : email})

        if(userExist){
            return res.status(400).json({error : "Email already exist"})
        }
        const verificationCode = `${otp}`
       

        const user = new Register({firstname , lastname , email , password , checkbox , verificationCode , otpExpiry}) ;     
        console.log(otpExpiry)

        //add modifier here for hashing    
        await user.save() ;
        res.status(201).json({ message: 'User registered successfully' });
        
    }catch (error) {
        res.status(400).json({error : "registeration failded"});
        console.log("User registeration failed :", error.message);
    }
})


//-----------------------------------------------------------------------------------------------------------


// OTP Verification Route
router.post("/verify-otp", async (req, res) => {
    try {
        const { otp } = req.body;

        // Find user by OTP
        const user = await Register.findOne({ verificationCode: otp });
        if (!user) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Check if the OTP has expired
        if (Date.now() > user.otpExpiry) {
            return res.status(400).json({ error: "OTP has expired" });
        }

        // Verify OTP and set user as verified
        user.isVerified = true;
        // Clear the verification code and expiry after successful verification
        user.verificationCode = null;
        user.otpExpiry = null;
        
        await user.save();
        
        res.status(200).json({ message: "OTP Verified successfully" });
        
    } catch (err) {
        console.error('OTP Verification error:', err);
        res.status(500).json({ error: "Internal server error" });
    }
});


//-----------------------------------------------------------------------------------------------------------


//LOGIN ROUTE

// router.post("/login" , async(req , res) => {
//     console.log(req.body) ;
//     try{
//        const {email , password} = req.body ;

//        if(!email || !password){
//         return res.status(400).json({error : "plz filled the data"})
//        };

//        const userLogin = await Register.findOne({email : email}) ;
//        if(userLogin){
//         const checkpass = await bcrypt.compare(password , userLogin.password) ;
//         const token = await userLogin.generateAuthToken();
//         console.log(token)
//         if(checkpass){
//             return res.status(201).json({error : "User Logged In"});
//         }else{
//             return res.status(400).json({error : "Invalid credentials [pass]"});
//         }
//        }else {
//         return res.status(400).json({error : "Invalid credentials [email]"});
//        }

//     //    console.log(userLogin)
//     }catch(err){
//         console.log(err)
//     }
// })

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if both email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: "Please fill in the data" });
        }

        // Find the user by email
        const userLogin = await Register.findOne({ email });

        // Check if user exists
        if (userLogin) {
            // Check if the user is verified
            if (userLogin.isVerified) {
                // Verify the password
                const isPasswordMatch = await bcrypt.compare(password, userLogin.password);
                if (isPasswordMatch) {
                    // Generate an auth token
                    const token = await userLogin.generateAuthToken();

                    // Set the token in a cookie
                    res.cookie("jwtoken", token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                    });

                    return res.status(200).json({ message: "User Logged In Successfully", token });
                } else {
                    return res.status(400).json({ error: "Invalid credentials [password]" });
                }
            } else {
                return res.status(400).json({ error: "Email is not verified. Please verify your email to log in." });
            }
        } else {
            return res.status(400).json({ error: "Invalid credentials [email]" });
        }
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

//---------------------------------------------------------------------------------------------------------

//FORGET-PASSWORD EMAIL-OTP GENERATER
router.post("/forgetpass", async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Please provide an email" });
    }

    try {
        const user = await Register.findOne({ email });
        if (user) {
            const otp = generateOTP();
            const otpExpiry = Date.now() + otpExpirationTime;
            await Register.updateOne({ email }, { verificationCode: otp, otpExpiry });

            const mailOptions = {
                from: process.env.SMTP_MAIL,
                to: email,
                subject: "OTP for Password Reset",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; background-color: #f4f4f9; border-radius: 8px;">
        <h2 style="color: #333;">Welcome to Your App</h2>
        <p style="font-size: 16px; color: #555;">
          Thank you for signing up with us. To complete your registration, please verify your email address using the OTP below.
        </p>
        <div style="padding: 20px; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; text-align: center;">
          <h3 style="color: #333;">Your OTP Code</h3>
          <p style="font-size: 24px; font-weight: bold; color: #ff6f61; letter-spacing: 2px;">${otp}</p>
          <p style="font-size: 14px; color: #888;">(This code will expire in 10 minutes)</p>
        </div>
        <p style="font-size: 16px; color: #555;">
          If you did not request this, please ignore this email.
        </p>
        <p style="font-size: 16px; color: #555;">
          Thank you,<br/>
        </p>
      </div>
    
                `
            };
            
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(500).json({ error: "Error sending email" });
                } else {
                    console.log("Email sent successfully:");
                    return res.status(200).json({ message: "OTP sent to email" });
                }
            });
        } else {
            return res.status(400).json({ error: "User not registered" });
        }
    } catch (error) {
        console.error("Forgot Password error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

//-----------------------------------------------------------------------------------------------------------

//UPDATE PASSWORD

router.post("/updatepassword" , async(req , res) => {
    const { email , password } = req.body;
    
    console.log("reqbody" , req.body)
    if (!password) {
        return res.status(400).json({ error: "Please enter the password" });
    }
    try{
        const user = await Register.findOne({ email });
        console.log(email);
        if(user){
            const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        await Register.updateOne({ email }, { password: hashedPassword });
        
        return res.status(200).json({ message: 'Password updated successfully' });
        }
        else{   
            res.status(400).json({ message: 'user not found' });
            console.log('user not found')
        }
    }catch(err){
        console.log("error in updating the password");
        res.status(500).json({error : 'server error'})

    }
})

//-----------------------------------------------------------------------------------------------------------

//Home KA PAGE
//i want this page is open when user is prroperly logged in and give a unique token id 

router.get('/home' ,authenticate , (req , res) => {
    console.log('hello my home pge');
    res.send(req.rootUser) ; 
})

//LOGOUT ka page

router.get('/LogOut' ,(req , res) => {
    console.log('hello my Logout page');
    res.clearCookie('jwtoken' , {path: '/'});
    res.status(200).send('USER LOGGED-OUT') ; 
})


//---------------------------------------------------------------------------------------------------------------------

//SIGNUP WITH GOOGLE 

router.post('/google', async (req, res) => {
    try {
        // Extract 'code' from the request body
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "Authorization code is required" });
        }
        console.log("code code code : " , code)

        // Exchange authorization code for access tokens
        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);

        // Get user profile information from Google
        const userRes = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        // console.log("userRes is:", userRes.data); 

        // Extract necessary information from the userRes data
        const { given_name, family_name, email, picture, id } = userRes.data;
        console.log("Google User Info:", userRes.data);


        // Prepare the user details object
        const userDetails = {
            firstname: given_name,   // Name from Google
            lastname: family_name,   // Last name from Google
            email: email,            // Email from Google
            profilePhoto: picture,   // Profile photo from Google
            googleId: id             // Google ID for OAuth
        };

        
        // Check if user exists in the database by email
        let user = await Register.findOne({ email });
        if (!user) {
            // If user doesn't exist, create a new user
            user = new Register(userDetails);
            await user.save();
        }else{
            user.firstname = userDetails.firstname;
            user.lastname = userDetails.lastname;
            user.email = userDetails.email ;
            user.profilePhoto = userDetails.profilePhoto;
            user.googleId = userDetails.googleId;
            await user.save();
        }
        

        // Generate a custom authentication token and set it in a cookie
        const token = await user.generateAuthToken();
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 25892000000), // Cookie expiry time
            httpOnly: true,  // Security feature to prevent client-side JS access to cookie
        });

        // Send a success response
        return res.status(200).json({ message: "User Sign-In Successfully", token });
    } catch (err) {
        console.error("Error in Google authentication:", err);
        res.status(500).json({ error: "Internal server error during Google Sign-In" });
    }
});



//LOGIN WITH GOOGLE

// router.post('/googlelogin', async (req, res) => {
//      const { googleId, email, given_name, family_name, picture } = req.body; // Assuming data is sent from client

//      try {
//          let user = await Register.findOne({ googleId });

//          if (!user) {
//               //Create new user with Google data
//              user = new Register({
//                  firstname: given_name,
//                  lastname: family_name,
//                  email: email,
//                  profilePhoto: picture,
//                  googleId: googleId,
//              });

//              await user.save();
//          };
//          const { tokens } = await oauth2client.getToken(code);
//          oauth2client.setCredentials(tokens);
 
//          // Get user profile information from Google
//          const userRes = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
//              headers: { Authorization: `Bearer ${tokens.access_token}` },
//          });
//          console.log("userRes is:", userRes.data); // Log the response for debugging
 

//          res.cookie("jwtoken", token, {
//             expires: new Date(Date.now() + 25892000000), // Cookie expiry time
//             httpOnly: true,  // Security feature to prevent client-side JS access to cookie
//         });

//         // Send a success response
//         return res.status(200).json({ message: "User Logged In Successfully", token });

//      } catch (err) {
//          console.error('Error in Google login:', err);
//          res.status(500).send('Internal server error');
//      }
//  });

// const jwt = require('jsonwebtoken'); // Make sure you have jwt installed and imported
// const JWT_SECRET = "your_jwt_secret_key"; // Replace with your JWT secret


// router.post('/googleLogIn', async (req, res) => {
//     // try {
//     //     const { code } = req.body;
//     //     if (!code) {
//     //         return res.status(400).json({ error: "Authorization code is required" });
//     //     }

//     //     const { tokens } = await oauth2client.getToken(code);
//     //     oauth2client.setCredentials(tokens);

//     //     const userRes = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
//     //         headers: { Authorization: `Bearer ${tokens.access_token}` },
//     //     });

//     //     console.log("userRes data:", userRes.data);  // Log the whole response

//     //     // Check if email exists in the response
//     //     const {email}  = userRes.data;
//     //     if (!email) {
//     //         console.log("email not found");
//     //         return res.status(400).json({ error: "Email not found in response" });
//     //     }

//     //     let user = await Register.findOne({ email });
//     //     console.log("USER " , user.email)
//     //     if (user) {
//     //         const token = await user.generateAuthToken();
//     //         res.cookie("jwtoken", token, {
//     //             expires: new Date(Date.now() + 25892000000),
//     //             httpOnly: true,
//     //         });
//     //         return res.status(200).json({ message: "User Log-In Successfully", token });
//     //     } else {
//     //         console.log("User not found");
//     //         return res.status(400).json({ error: "User not found" });
//     //     }

//     // } catch (err) {
//     //     console.error("Error in Google authentication:", err);
//     //     res.status(400).json({ error: "Internal server error during Google Sign-In" });
//     // }

//     try {
//         // Extract 'code' from the request body
//         const { code } = req.body;
//         if (!code) {
//             return res.status(400).json({ error: "Authorization code is required" });
//         }
//         console.log("code code code : " , code)

//         // Exchange authorization code for access tokens
//         const { tokens } = await oauth2client.getToken(code);
//         oauth2client.setCredentials(tokens);

//         // Get user profile information from Google
//         const userRes = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
//             headers: { Authorization: `Bearer ${tokens.access_token}` },
//         });
//         // console.log("userRes is:", userRes.data); 

//         // Extract necessary information from the userRes data
//         const { given_name, family_name, email, picture, id } = userRes.data;
//         console.log("Google User Info:", userRes.data);


//         // Prepare the user details object
//         const userDetails = {
//             firstname: given_name,   // Name from Google
//             lastname: family_name,   // Last name from Google
//             email: email,            // Email from Google
//             profilePhoto: picture,   // Profile photo from Google
//             googleId: id             // Google ID for OAuth
//         };

        
//         // Check if user exists in the database by email
//         let user = await Register.findOne({ email });
//         if (!user) {
//             // If user doesn't exist, create a new user
//             user = new Register(userDetails);
//             await user.save();
//         }else{
//             user.firstname = userDetails.firstname;
//             user.lastname = userDetails.lastname;
//             user.email = userDetails.email ;
//             user.profilePhoto = userDetails.profilePhoto;
//             user.googleId = userDetails.googleId;
//             await user.save();
//         }
        

//         // Generate a custom authentication token and set it in a cookie
//         const token = await user.generateAuthToken();
//         res.cookie("jwtoken", token, {
//             expires: new Date(Date.now() + 25892000000), // Cookie expiry time
//             httpOnly: true,  // Security feature to prevent client-side JS access to cookie
//         });

//         // Send a success response
//         return res.status(200).json({ message: "User Log-In Successfully", token });
//     } catch (err) {
//         console.error("Error in Google authentication [GoogleLogin]:", err);
//         res.status(500).json({ error: "Internal server error during Google Log-In" });
//     }
// });








module.exports = router 