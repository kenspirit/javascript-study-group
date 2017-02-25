var joi = require('joi')
var AuthManager = require('./auth-manager')
var AuthController = require('./auth-controller')

module.exports.basePath = '/auth'
module.exports.routes = [
  {
    method: 'get',
    path: '/signin',
    action: AuthController.signinPage
  },
  {
    method: 'get',
    path: '/signup',
    action: AuthController.signupPage
  },
  {
    method: 'get',
    path: '/resetPasswordRequest',
    action: AuthController.resetPasswordRequestPage
  },
  {
    method: 'get',
    path: '/resetPassword',
    action: AuthController.resetPasswordPage,
    validators: {
      query: joi.object().keys({
        resetId: joi.string().required(),
        email: joi.string().required()
      })
    }
  },
  {
    method: 'post',
    path: '/signin',
    summary: 'Sign In',
    description: '',
    action: [AuthManager.localAuth(), AuthController.signin],
    validators: {
      body: joi.object().keys({
        loginId: joi.string().required(),
        password: joi.string().required()
      })
    }
  },
  {
    method: 'post',
    path: '/signout',
    summary: 'Sign Out',
    description: '',
    action: AuthController.signout
  },
  {
    method: 'post',
    path: '/signup',
    summary: 'Sign Up',
    description: '',
    action: AuthController.signup,
    validators: {
      body: joi.object().keys({
        loginId: joi.string().required(),
        phone: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required()
      })
    }
  },
  {
    method: 'post',
    path: '/signup_check/phone',
    summary: 'Check if phone number is unique.',
    description: 'Check if phone number is unique.',
    action: AuthController.isPhoneUnique,
    validators: {
      body: joi.object().keys({
        phone: joi.string().required()
      })
    }
  },
  {
    method: 'post',
    path: '/signup_check/email',
    summary: 'Check if email is unique.',
    description: 'Check if email is unique.',
    action: AuthController.isEmailUnique,
    validators: {
      body: joi.object().keys({
        email: joi.string().email().required()
      })
    }
  },
  {
    method: 'post',
    path: '/resetPasswordRequest',
    summary: 'Process reset password request',
    description: '',
    action: AuthController.resetPasswordRequest,
    validators: {
      body: joi.object().keys({
        email: joi.string().email().required()
      })
    }
  },
  {
    method: 'post',
    path: '/resetPassword',
    action: AuthController.resetPassword,
    validators: {
      body: joi.object().keys({
        resetId: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
      })
    }
  }
]
