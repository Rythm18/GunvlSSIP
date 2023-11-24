// check if user is logged in if they want to access the route

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      req.session.role = 'admin'
    }

    if (req.user.role === 'staff') {
      req.session.role = 'staff'
    }
    return next()
  }

  // if not authenticated
  req.flash('error_msg', "You're not authorized to view this resource")
  res.redirect('/users/login')
}

// ensure no user logged in if they want to access the route
function checkNotAuthenticated(req, res, next) {
  // if authenticated
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      req.session.role = 'admin'
      res.redirect('/admin/dashboard')
    } else if (req.user.role === 'staff') {
      req.session.role = 'staff'
      res.redirect('/staff/dashboard')
    }
  } else {
    // if not authenticated just pass to the next middleware
    next()
  }
}

module.exports = {
  checkAuthenticated,
  checkNotAuthenticated
}
