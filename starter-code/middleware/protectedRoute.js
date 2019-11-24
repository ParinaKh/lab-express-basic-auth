function protectUserRoute(req, res, next) {
  // const isAuthorized = true;
  // console.log(req.session.currentUser)
  const isAuthorized = req.session.currentUser;
  if (isAuthorized) {
    res.locals.isUser = true;
    // we write in res.locals here (accessible everywhere in hbs templates)
    // logic before the next() call ...
    next(); // executes the next middleware in line OR the callback handling the request if this is the last middleware in line
  } else {
    res.locals.isUser = false;
    req.flash("error", "Please sign in first!");
    res.redirect("/auth/signin");
  }
}

module.exports = protectUserRoute;
