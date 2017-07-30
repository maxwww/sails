module.exports = {
  login: function(req, res) {
    var email = req.param('email');
    var password = req.param('password');

    verifyParams(res, email, password);

    User.findOne({
      email: email
    }).exec(function(err, finn) {
      if (err) {
        return invalidEmailOrPassword(res);
      }
      signInUser(req, res, password, finn);
    });
  }
};

function signInUser(req, res, password, user) {
  User.comparePassword(password, user).then(
    function(valid) {
      if (!valid) {
        return this.invalidEmailOrPassword(res);
      } else {
        var responseData = {
          user: user,
          token: generateToken(user.id)
        };
        return ResponseService.json(200, res, "Successfully signed in", responseData);
      }
    }
  ).catch(function(err) {
    return ResponseService.json(403, res, "Invalid email or password");
  });
};

function invalidEmailOrPassword(res) {
  return ResponseService.json(401, res, "Invalid email or password");
};

function verifyParams(res, email, password) {
  if (!email || !password) {
  	return ResponseService.json(401, res, "Email and password required");
  }
};

function generateToken(user_id) {
  return JwtService.issue({id: user_id});
}