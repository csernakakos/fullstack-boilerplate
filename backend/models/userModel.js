const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a user name."],
        minLength: [4, "Minimum 4 characters."],
        maxLength: [50, "Maximum 50 characters."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email address."],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email address."]
    },
    password: {
        type: String,
        required: [true, "Please provide a password."],
        minLength: 8,
        select: false,
    },
    membershipStatus: {
        type: String,
        enum: {
            values: ["user", "privilegedUser", "admin",],
            message: ["This user type is not supported."],
        },
        default: "user",
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


// Hash and salt password before saving document to the database:
// userSchema.pre("save", async function(next){

//     const salt = crypto.randomBytes(9).toString("hex");
//     const hashedBuff = await scrypt(this.password, salt, 64);
//     this.password = `${hashedBuff.toString("hex")}-${salt}`;
    
//     next();
// });


// Create virtual property which will not be stored in database:
// userSchema.virtual("name").get(function(){
//     let fullName = "";
//     if (this.firstName && this.lastName) fullName = `${this.firstName} ${this.lastName}`
//     if (!this.firstName || !this.lastName) fullName = "";
//     return fullName;
// });

// Compare two passwords function
// userSchema.methods.isCorrectPassword = async function(candidatePassword, userPassword){
//     const result = userPassword.split("-");
//     const hashed = result[0];
//     const salt = result[1];

//     const BUFFencryptedCandidatePassword = await scrypt(candidatePassword, salt, 64);
//     const encryptedCandidatePassword = BUFFencryptedCandidatePassword.toString("hex");

//     return hashed === encryptedCandidatePassword;
// };

const User = mongoose.model("User", userSchema);

module.exports = User;