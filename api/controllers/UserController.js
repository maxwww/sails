var _ = require('lodash');

module.exports = {
  create: function(req, res) {
    if (req.body.password !== req.body.confirmPassword) {
      return ResponseService.json(401, res, "Password doesn't match!");
    }

    var allowedParameters = [
      "email", "password"
    ];

    var data = _.pick(req.body, allowedParameters);

    User.create(data).exec(function(error, user) {
      if (error && error.invalidAttributes) {
        return ResponseService.json(400, res, "User could not be created1", error);
      } 
      if (error) {
        return ResponseService.json(400, res, "User could not be created2", error);
      }       
      var responseData = {
        user: user,
        token: JwtService.issue({id: user.id})
      };
      
      return ResponseService.json(200, res, "User created successfully", responseData);
    });
  },
  getAllUsers: function(req, res) {
    User.find().exec(function(err, finn) {
      if (err) {
        return invalidEmailOrPassword(res);
      }
      signInUser(req, res, finn);
    });
  }
};

function signInUser(req, res, finn) {
  var responseData = {
    users: finn,
    token: generateToken(req.current_user.id)
  };

  return ResponseService.json(200, res, "All users", responseData);

};

function generateToken(user_id) {
  return JwtService.issue({id: user_id});
}