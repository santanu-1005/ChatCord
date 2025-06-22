const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        email : {
            type : String,
            required : [true,"Email is required"],
            unique : true,
        },
        password : {
            type : String,
            required : [true,"Password is required"],
        },
        name : {
            type : String,
            required : [true,"Name is required"],
        },
        image : {
            type : String,
            required : false,
        },
        profileSetup : {
            type : Boolean,
            default : false,
        }
    }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);