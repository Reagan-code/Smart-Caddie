const mongoose = require("mongoose")
const joi = require("joi")
const jwt = require("jsonwebtoken")
const passwordComplexity = require("joi-password-complexity")

const schema = new mongoose.schema({
    firstName:{type:string, required:true},
    lastName:{type:string, required:true},
    email:{type:string, required:true},
    password:{type:string, required:true}
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id },
        process.env.JWTPRIVATEKEY,
        { expiresIn: "7d" }
    );
    return token;
};

 const user = mongoose.model("user", userSchema)

const validate = (data) =>{
    const schema = joi.object =({
        firstName: joi.string().required().label("firstName"),
        lastName: joi.string().required().label("lastName"),
        passsword: joi.passwordComplexity().required().label("password"),
        email: joi.string().required().email().label("email")
});
return schema.validate(data)
}

module.exports = {user , validate};