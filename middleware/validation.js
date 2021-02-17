// Validation with JOI
const Joi = require("joi");
// const { model } = require("mongoose");
 
// Auth Validations ----------------------------------
const registerValidation = (data) => {
  const userValidationSchema = Joi.object({
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    // retypepassword:Joi.string().min(6).required().required()
  });
  const validatedUser = userValidationSchema.validate(data);
  return validatedUser;
};
 
const loginValidation = (data) => {
  const userValidationSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  const validatedUser = userValidationSchema.validate(data);
  return validatedUser;
};
 
// Profile Validations ----------------------------------
const updateValidation = (data) => {
  const userValidationSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    firstname: Joi.string().min(3).required(),
    lastname: Joi.string().min(3).required(),
    jobtitle: Joi.string().min(6),
    about: Joi.string().min(15),
    location: Joi.string().min(5),
    jobcategory:Joi.string().required(),
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
 
// Post Validations ----------------------------------
const newPostValidation = (data) => {
  const postValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    title: Joi.string().min(5).required(),
    description: Joi.string(),
    budget: Joi.number(),
    images: Joi.array(),
    documents: Joi.array(),
  });
  const post = postValidationScheme.validate(data);
  return post;
};
 
const updatePostValidation = (data) => {
  const postValidationScheme = Joi.object({
    // creator:Joi.string().required(),
    // creatorImage:Joi.string(),
    id: Joi.required(),
    title: Joi.string().min(5).required(),
    description: Joi.string(),
    budget: Joi.number(),
    images: Joi.array(),
    documents: Joi.array(),
  });
  const post = postValidationScheme.validate(data);
  return post;
};
 
// deletePostValidation;
const deletePostValidation = (data) => {
  const postValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    id: Joi.required(),
  });
  const post = postValidationScheme.validate(data);
  return post;
};
 
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;
module.exports.getValidation = getValidation;
module.exports.newPostValidation = newPostValidation;
module.exports.updatePostValidation = updatePostValidation;
module.exports.deletePostValidation = deletePostValidation;
 
