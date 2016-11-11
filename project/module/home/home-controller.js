module.exports.homePage = homePage

function homePage(req, res, next) {
  return res.render('index', {current_user: req.user});
}
