module.exports.getRandomIntInclusive = getRandomIntInclusive
module.exports.buildApiResponse = buildApiResponse
module.exports.isValidEmail = isValidEmail

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildApiResponse(data, err) {
  var errMessage = err || null
  if (errMessage && typeof errMessage === 'object' && errMessage.message) {
    errMessage = errMessage.message
  }

  return {
    err: errMessage,
    data: typeof data === 'boolean' ? data : (data || null)
  }
}

function isValidEmail(email) {
  var regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return regexp.test(email)
}
