// Validation with JOI
const Joi = require("joi");
// const { model } = require("mongoose");


const registerValidation = (data)=>{
    const userValidationSchema = Joi.object({
        firstname:Joi.string().min(3).required(),
        lastname:Joi.string().min(3).required(),
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required().required(),
        // retypepassword:Joi.string().min(6).required().required()
    });
     const validatedUser = userValidationSchema.validate(data);
     return validatedUser;
}

const loginValidation = (data)=>{
    const userValidationSchema = Joi.object({
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required().required(),
    });
     const validatedUser = userValidationSchema.validate(data);
     return validatedUser;
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

