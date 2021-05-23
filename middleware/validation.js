// Validation with JOI
const Joi = require("joi");
// const { model } = require("mongoose");

// General Validations

const emailValidation = (data) => {
  const emailValidationSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
  });
  const emailValidation = emailValidationSchema.validate(data);
  return emailValidation;
};

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
    jobcategory: Joi.string().required(),
    image: Joi.string(),
  });
  const validatedUser = userValidationSchema.validate(data);
  return validatedUser;
};

const getValidation = (data) => {
  const userValidationSchema = Joi.object({
    userId: Joi.string().min(6).required(),
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

// Offer Bid Validation
const offerBidValidation = (data) => {
  const offerBidValidationScheme = Joi.object({
    bidderId: Joi.string().min(6).required(),
    postId: Joi.string().min(6).required(),
    message: Joi.string().min(6).required(),
    bidAmount: Joi.number().required(),
  });
  const bid = offerBidValidationScheme.validate(data);
  return bid;
};

const acceptBidValidation = (data) => {
  const acceptBidValidationScheme = Joi.object({
    bidId: Joi.string().min(6).required(),
    postId: Joi.string().min(6).required(),
  });
  const bid = acceptBidValidationScheme.validate(data);
  return bid;
};

const rejectBidValidation = (data) => {
  const rejectBidValidationScheme = Joi.object({
    bidId: Joi.string().min(6).required(),
    postId: Joi.string().min(6).required(),
  });
  const bid = rejectBidValidationScheme.validate(data);
  return bid;
};

const bidValidation = (data) => {
  const bidValidationScheme = Joi.object({
    postId: Joi.string().min(6).required(),
  });
  const bid = bidValidationScheme.validate(data);
  return bid;
};

const userBidValidation = (data) => {
  const userBidValidationScheme = Joi.object({
    userId: Joi.string().min(6).required(),
    postId: Joi.string().min(6).required(),
    bidId: Joi.string().min(6).required(),
  });
  const bid = userBidValidationScheme.validate(data);
  return bid;
};

// Project Validations ----------------------------------
const newProjectValidation = (data) => {
  const projectValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    title: Joi.string().min(5).required(),
    description: Joi.string(),
    category: Joi.string(),
    data: Joi.object(),
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
    data: Joi.object(),
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
    value: Joi.string(),
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
    projectId: Joi.string().required(),
    liked: Joi.boolean().required(),
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
    members: Joi.array(),
  });
  const firm = firmValidationScheme.validate(data);
  return firm;
};

const noteValidation = (data) => {
  const noteValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    firmId: Joi.string().required(),
    note: Joi.string(),
    images: Joi.array(),
    documents: Joi.array(),
  });
  const note = noteValidationScheme.validate(data);
  return note;
};
const updateNoteValidation = (data) => {
  const noteValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    noteId: Joi.string().required(),
    firmId: Joi.string().required(),
    note: Joi.string(),
    images: Joi.array(),
    documents: Joi.array(),
  });
  const note = noteValidationScheme.validate(data);
  return note;
};

const getNoteValidation = (data) => {
  const getNoteValidationScheme = Joi.object({
    // userId: Joi.string().required(),
    firmId: Joi.string().required(),
  });
  const note = getNoteValidationScheme.validate(data);
  return note;
};

const deleteNoteValidation = (data) => {
  const deleteNoteValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    firmId: Joi.string().required(),
    noteId: Joi.string().required(),
  });
  const note = deleteNoteValidationScheme.validate(data);
  return note;
};

const deleteFirmValidation = (data) => {
  const deleteFirmValidationScheme = Joi.object({
    email: Joi.string().min(6).required().email(),
    firmId: Joi.required(),
    members: Joi.array().required(),
  });
  const firm = deleteFirmValidationScheme.validate(data);
  return firm;
};

// Shop Validations
const registerShopValidation = (data) => {
  const shopValidationSchema = Joi.object({
    shopName: Joi.string().min(3).required(),
    phoneNumber: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  const validatedShop = shopValidationSchema.validate(data);
  return validatedShop;
};

const loginShopValidation = (data) => {
  const shopValidationSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  const validatedShop = shopValidationSchema.validate(data);
  return validatedShop;
};

// Add Products to Shop
const addProductValidation = (data) => {
  const addProductValidationSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    productName: Joi.string().required(),
    productDescription: Joi.string().required(),
    productPrice: Joi.number().required(),
    productImage: Joi.string().required(),
    productCategory: Joi.string().required(),
  });
  const validatedShop = addProductValidationSchema.validate(data);
  return validatedShop;
};

// Update Product Shop
const updateProductValidation = (data) => {
  const updateProductValidationSchema = Joi.object({
    productId: Joi.string().min(6).required(),
    productName: Joi.string().required(),
    productDescription: Joi.string().required(),
    productPrice: Joi.number().required(),
    productImage: Joi.string().required(),
    productCategory: Joi.string().required(),
  });
  const validatedShop = updateProductValidationSchema.validate(data);
  return validatedShop;
};

// Delete Product from  Shop
const deleteProductValidation = (data) => {
  const deleteProductValidationSchema = Joi.object({
    shopId: Joi.string().min(6).required(),
    productId: Joi.string().required(),
  });
  const validatedShop = deleteProductValidationSchema.validate(data);
  return validatedShop;
};

// Update Profile Image shop
const updateShopProfileImage = (data) => {
  const updateShopProfileImageSchema = Joi.object({
    shopId: Joi.string().min(6).required(),
    image: Joi.string().required(),
  });
  const validatedShop = updateShopProfileImageSchema.validate(data);
  return validatedShop;
};

// Get Shop Data
const getShopDataValidation = (data) => {
  const getShopDataValidationSchema = Joi.object({
    shopId: Joi.string().min(6).required(),
  });
  const validatedShop = getShopDataValidationSchema.validate(data);
  return validatedShop;
};

// Update Shop Data
const updateShopDataValidation = (data) => {
  const updateShopDataValidationSchema = Joi.object({
    shopId: Joi.string().min(6).required(),
    data: Joi.object().required(),
  });
  const validatedShop = updateShopDataValidationSchema.validate(data);
  return validatedShop;
};

// Get Shop Orders
const getShopOrdersValidation = (data) => {
  const getShopOrdersValidationSchema = Joi.object({
    shopId: Joi.string().min(6).required(),
  });
  const validatedShop = getShopOrdersValidationSchema.validate(data);
  return validatedShop;
};

// Get Buyer Info
const getBuyerInfoValidation = (data) => {
  const getBuyerInfoValidationSchema = Joi.object({
    buyerId: Joi.string().min(6).required(),
  });
  const validatedShop = getBuyerInfoValidationSchema.validate(data);
  return validatedShop;
};

// Get Shop Products
const getShopProductsValidation = (data) => {
  const getShopProductsValidationSchema = Joi.object({
    shopId: Joi.string().min(6).required(),
  });
  const validatedShop = getShopProductsValidationSchema.validate(data);
  return validatedShop;
};

// Get Store Products
const getStoreDataValidation = (data) => {
  const getStoreDataValidationSchema = Joi.object({
    userId: Joi.string().min(6).required(),
  });
  const validatedStore = getStoreDataValidationSchema.validate(data);
  return validatedStore;
};

// Get Store Products - Specific Category
const getStoreDataSpecificCategoryValidation = (data) => {
  const getStoreDataSpecificCategoryValidationSchema = Joi.object({
    userId: Joi.string().min(6).required(),
    category: Joi.string().required(),
  });
  const validatedStore =
    getStoreDataSpecificCategoryValidationSchema.validate(data);
  return validatedStore;
};

// Place  Order Store
const storePlaceOrderValidation = (data) => {
  const storePlaceOrderValidationSchema = Joi.object({
    userId: Joi.string().min(6).required(),
    shopId: Joi.string().min(6).required(),
    products: Joi.array().required(),
    // paymentType: Joi.string().required(),
    totalOrderCost: Joi.number().required(),
    deliveryDetails: Joi.object().required(),
  });
  const validatedStore = storePlaceOrderValidationSchema.validate(data);
  return validatedStore;
};

// Confirm Order Shop
const confirmShopOrderValidation = (data) => {
  const confirmShopOrderValidationSchema = Joi.object({
    // userId: Joi.string().min(6).required(),
    // shopId: Joi.string().min(6).required(),
    orderId: Joi.string().min(6).required(),
  });
  const validatedShop = confirmShopOrderValidationSchema.validate(data);
  return validatedShop;
};

// Get Order Validation

const getUserOrdersValidaion = (data) => {
  const getUserOrdersValidaionSchema = Joi.object({
    userId: Joi.string().min(6).required(),
  });
  const validatedUser = getUserOrdersValidaionSchema.validate(data);
  return validatedUser;
};

// Cancel Order Validation

const storeCancelOrderValidation = (data) => {
  const storeCancelOrderValidationSchema = Joi.object({
    userId: Joi.string().min(6).required(),
    orderId: Joi.string().min(6).required(),
  });
  const validatedOrder = storeCancelOrderValidationSchema.validate(data);
  return validatedOrder;
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
module.exports.noteValidation = noteValidation;
module.exports.updateNoteValidation = updateNoteValidation;
module.exports.getNoteValidation = getNoteValidation;
module.exports.deleteNoteValidation = deleteNoteValidation;
module.exports.deleteFirmValidation = deleteFirmValidation;
module.exports.registerShopValidation = registerShopValidation;
module.exports.loginShopValidation = loginShopValidation;
module.exports.addProductValidation = addProductValidation;
module.exports.updateProductValidation = updateProductValidation;
module.exports.updateShopProfileImage = updateShopProfileImage;
module.exports.getShopDataValidation = getShopDataValidation;
module.exports.getShopOrdersValidation = getShopOrdersValidation;
module.exports.updateShopDataValidation = updateShopDataValidation;
module.exports.getShopProductsValidation = getShopProductsValidation;
module.exports.deleteProductValidation = deleteProductValidation;
module.exports.getStoreDataValidation = getStoreDataValidation;
module.exports.getStoreDataSpecificCategoryValidation =
  getStoreDataSpecificCategoryValidation;
module.exports.storePlaceOrderValidation = storePlaceOrderValidation;
module.exports.confirmShopOrderValidation = confirmShopOrderValidation;
module.exports.getUserOrdersValidaion = getUserOrdersValidaion;
module.exports.storeCancelOrderValidation = storeCancelOrderValidation;
module.exports.offerBidValidation = offerBidValidation;
module.exports.acceptBidValidation = acceptBidValidation;
module.exports.rejectBidValidation = rejectBidValidation;
module.exports.bidValidation = bidValidation;
module.exports.userBidValidation = userBidValidation;
module.exports.getBuyerInfoValidation = getBuyerInfoValidation;
