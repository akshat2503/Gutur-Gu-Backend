const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Schema for a user
const userModel = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

// Match the incoming plain text password with the hashed password in our database
userModel.methods.matchPassword = async function(plainTextPassword) {
    return bcrypt.compare(plainTextPassword, this.password);
};
// Hash the plain text password before we store it in the database
userModel.pre('save', async function (next){
    if (!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

})

const User = mongoose.model("User", userModel);

module.exports = User;