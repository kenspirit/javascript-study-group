module.exports.homePage = homePage

function homePage(req, res, next) {
  return res.render('index', {currentUser: req.user});
}
