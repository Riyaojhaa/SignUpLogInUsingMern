// const jwt = require('jsonwebtoken');
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs") ;

// const RegistrationSchema = new mongoose.Schema({
//     firstname : {
//         type : String ,
//         required: true ,
//         trim : true
//     },
//     lastname : {
//         type : String ,
//         required: true ,
//         trim : true
//     } ,
//     email : {
//         type : String ,
//         required:true ,
//         trim : true,
//         unique:true,     
//         // validate(value){
//         //     if(!validator.isEmail(value)){
//         //         throw new Error('Type Valid Email Id')
//         //     }
//         // }
//     } ,
//     password : {
//         type : String ,
//         required:true ,
//     } ,
//     checkbox: {
//         type : Boolean ,
//         required : true
//     } ,
//     isVerified:{
//         type:Boolean ,
//         default: false ,
//     } ,
//     verificationCode : String,
//     otpExpiry: String,
//     tokens :[
//         {
//             token: {
//                 type:String ,
//                 required: true 
//             }
//         }
//     ] ,
//     profilePhoto: {
//         type: String,
//         default: 'null'  // Default value if no photo is provided
//     },
    
//     googleId: {  // New field for storing Google ID
//         type: String,
//         unique: true,  // Ensure that the Google ID is unique
//         sparse: true  // Allow other fields to have duplicates while this one remains unique
//     }
// })


// //hashing or secure the password
// RegistrationSchema.pre('save', async function (next) {
//     // console.log('Hashing the password...');
//     if (this.isModified('password')) {
//         this.password = await bcrypt.hash(this.password, 12); 
//     }
//     next();
// });

// //generate jwt token

// // RegistrationSchema.methods.generateAuthToken = async function() {
// //     try{
// //         console.log('Token was generating...');

// //         let token = jwt.sign({_id : this._id} , process.env.SECRETKEY) ;
// //         this.tokens = this.tokens.concat({token : token}) ;
        
// //         await this.save() ;

// //         return token ;
// //     }catch(err){
// //         console.log(err) ;
// //     }
// // }
// RegistrationSchema.methods.generateAuthToken = async function() {
//     try {
//         console.log('Generating token...');
//         let token = jwt.sign({ _id: this._id }, process.env.SECRETKEY);
        
//         this.tokens = this.tokens.concat({ token });
//         await this.save();

//         console.log('Token generated:', token);
//         return token;
//     } catch (err) {
//         console.error('Error generating token:', err);
//         throw err;  // Ensure any errors are thrown to the caller
//     }
// };





// const Register = new mongoose.model("Register" , RegistrationSchema ) ;
// module.exports = Register ;


const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RegistrationSchema = new mongoose.Schema({
    firstname: {
        type: String,
         required: true,
        trim: true
    },
    lastname: {
        type: String,
         required: true,
        trim: true
    },
    email: {
        type: String,
         required: true,
        trim: true,
        unique: true,
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error('Type Valid Email Id');
        //     }
        // }
    },
    password: {
        type: String,
        // required: function() {
        //     return !this.googleId; // Only required if googleId is not provided
        // }
    },
    profilePhoto : {
        type: String,
        // required: true,
        default : null,
    },
    checkbox: {
        type: Boolean,
        // required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,
    otpExpiry: String,
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
     googleId: {  // Google OAuth
         type: String,
         unique: true,  // Ensure that the Google ID is unique
         sparse: true  // Allow other fields to have duplicates while this one remains unique
     }
});

// Hash the password if it's modified or new
RegistrationSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Generate JWT Token
RegistrationSchema.methods.generateAuthToken = async function() {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.SECRETKEY);
        this.tokens = this.tokens.concat({ token });
        await this.save();
        return token;
    } catch (err) {
        console.error('Error generating token:', err);
        throw err;  // Ensure any errors are thrown to the caller
    }
};

// Add method to verify password (for email login)
RegistrationSchema.methods.verifyPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        console.error('Error verifying password:', err);
        throw err;  // Ensure any errors are thrown to the caller
    }
};

const Register = mongoose.model("Register", RegistrationSchema);
module.exports = Register;
