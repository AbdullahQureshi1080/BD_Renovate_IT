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
const updateValidation = (data) => {
    const userValidationSchema = Joi.object({
      email: Joi.string().min(6).required().email(),
      firstname: Joi.string().min(3).required(),
      lastname: Joi.string().min(3).required(),
      jobtitle: Joi.string().min(6),
      jobcategory: Joi.string().min(4),
      about: Joi.string().min(15),
      location: Joi.string().min(5),
      image:Joi.string(),
    });
    const validatedUser = userValidationSchema.validate(data);
    return validatedUser;
  };
   
  const getValidation = (data) => {
    const userValidationSchema = Joi.object({
      email: Joi.string().min(6).required().email(),
    });
    const getValidation = userValidationSchema.validate(data);
    return getValidation;
  };
   
  module.exports.registerValidation = registerValidation;
  module.exports.loginValidation = loginValidation;
  module.exports.updateValidation = updateValidation;
  module.exports.getValidation = getValidation;
  
  
