
function accessControlList() {
  return function (req, res, next) {
    try {
      console.log('suh dude');
      if (req.user.role.permissions.includes(permissions)) {
        next()
      } else {
        // NOTES - on what next() does
        // when you call next with anything other than a 
        // request object as the first parameter, Express
        // treats it as an error and hunts it to whichever 
        // middleware function handles the error first by 
        // having function errorHanderler(rerr, res, req, nxt) -- 
        // so, we could call this as next('you shall not pass') 
        // or next(new Error('you shall not pass')) and have it 
        // properly handled by the errorHandling middleware 
        // we wrote which expects an error object
        next('You shall not Pass')
      }
    } catch { error } {
      next(error);
    }
  } 
}

module.exports = accessControlList;
