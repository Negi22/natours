const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', authController.signup);
userRouter.post('/login', authController.login);
userRouter.get('/logout', authController.logout);

// Reset password routes
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware only authenticated user can access protected routes
userRouter.use(authController.protect);

// Update password routes
userRouter.patch('/updatePassword', authController.updatePassword);

// get current user who is logged in
userRouter.get('/me', userController.getMe, userController.getUser);

// update current user who is logged in
userRouter.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

// delete current user who is logged in
userRouter.delete('/deleteMe', userController.deleteMe);

// restrict all routes after this only for admin [middleware]
userRouter.use(authController.restrictTo('admin'));

// creating new routers so we can use it instead of app
userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
