// Validation with JOI
const Joi = require("joi");
// const { model } = require("mongoose");
 

// General Validations 

const emailValidation = (data)=>{
  const emailValidationSchema = Joi.object({
    email:Joi.string().min(6).required().email(),
  })
  const emailValidation = emailValidationSchema.validate(data);
  return emailValidation;
}

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

// Project Validations ----------------------------------
const newProjectValidation = (data) => {
  const projectValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    title: Joi.string().min(5).required(),
    description: Joi.string(),
    category: Joi.string(),
    data:Joi.object(),
  });
  const project = projectValidationScheme.validate(data);
  return project;
};
 
const updateProjectValidation = (data) => {
  const projectValidationScheme = Joi.object({
    id: Joi.required(),
    title: Joi.string().min(5).required(),
    description: Joi.string(),
    category: Joi.string(),
    data:Joi.object(),
  });
  const project = projectValidationScheme.validate(data);
  return project;
};
 
// deleteProjectValidation;
const deleteProjectValidation = (data) => {
  const projectValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    id: Joi.required(),
  });
  const project = projectValidationScheme.validate(data);
  return project;
};

const commentValidation = (data) => {
  const commentValidationScheme = Joi.object({
    userId: Joi.string().required(),
    projectId: Joi.string().required(),
    value:Joi.string(),
  });
  const comment = commentValidationScheme.validate(data);
  return comment;
};

const getCommentValidation = (data) => {
  const getCommentValidationScheme = Joi.object({
    // userId: Joi.string().required(),
    projectId: Joi.string().required(),
  });
  const comment = getCommentValidationScheme.validate(data);
  return comment;
};
 
const likeValidation = (data) => {
  const likeValidationScheme = Joi.object({
    userId: Joi.string().required(),
    projectId: Joi.required(),
    value:Joi.number(),
  });
  const like = likeValidationScheme.validate(data);
  return like;
};


// ------Chat Validations
const chatValidation = (data) => {
  const chatValidationScheme = Joi.object({
    chatId: Joi.string().required(),
    senderEmail: Joi.string().min(6).required().email(),
    recieverEmail: Joi.string().min(6).required().email(),
  });
  const chat = chatValidationScheme.validate(data);
  return chat;
};


// ---Firm Validations
const newFirmValidation = (data) => {
  const firmValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    title: Joi.string().min(5).required(),
    description: Joi.string(),
    members: Joi.object(),
  });
  const firm = firmValidationScheme.validate(data);
  return firm;
};




// Exports
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.updateValidation = updateValidation;
module.exports.getValidation = getValidation;
module.exports.newPostValidation = newPostValidation;
module.exports.updatePostValidation = updatePostValidation;
module.exports.deletePostValidation = deletePostValidation;
module.exports.emailValidation = emailValidation;
module.exports.newProjectValidation = newProjectValidation;
module.exports.updateProjectValidation = updateProjectValidation;
module.exports.deleteProjectValidation = deleteProjectValidation;
module.exports.commentValidation = commentValidation;
module.exports.likeValidation = likeValidation;
module.exports.getCommentValidation = getCommentValidation;
module.exports.chatValidation = chatValidation;
module.exports.newFirmValidation = newFirmValidation;
 
