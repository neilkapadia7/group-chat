let { validationResult } = require('express-validator')

module.exports = {
  respondWithSuccess(req, res, data, message = '', cache) {
    res?.status(200)
    return this.respond(req, res, true, message, data, "", cache)
  },

  respondWithFalseSuccess(req, res, data, message = '') {
    res?.status(200)
    return this.respond(req, res, false, message, data)
  },

  respondWithError(req, res, error, sendMail = true) {
    res?.status(500)
    return this.respond(req, res, false, error.toString())
  },

  respondWithValidationError(req, res, errors) {
    res?.status(422)
    return this.respond(req, res, false, 'validation failed', undefined, errors)
  },

  respondWithCustomError(req, res, message, data) {
    res?.status(400)
    return this.respond(req, res, false, message.toString(), data)
  },

  respondWithUnauthorised(req, res, message = 'Unauthorised') {
    res?.status(401)
    return this.respond(req, res, false, message.toString())
  },

  respondWithNotFound(req, res, message = 'Data not found') {
    res?.status(404)
    return this.respond(req, res, false, message)
  },

  validate(req, res, next) {
    const errors = validationResult(req).formatWith(this.formatter)
    if (!errors.isEmpty()) {
      return this.respondWithValidationError(req, res, errors.mapped())
    }
    next()
  },

  respondWithValidationErrorV2(req, res, errors) {
    res?.status(400)
    return this.respond(req, res, false, 'Validation failed', undefined, errors)
  },
}
