module.exports.getRandomIntInclusive = getRandomIntInclusive
module.exports.buildApiResponse = buildApiResponse
module.exports.isValidEmail = isValidEmail

function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildApiResponse(data, err) {
  return {
    err: err || null,
    data: typeof data === 'boolean' ? data : (data || null)
  }
}

function isValidEmail(email) {
  var regexp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return regexp.test(email)
}
