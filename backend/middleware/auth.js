const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key'); // decoded will contain the payload we set when creating the token, which includes the userId
    req.userData = decoded; // Contains userId
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Auth failed' });
  }
};

// JWT is a secure token which is used to identify logged in users. When a user logs in, the backend generates a JWT containing the user's ID and sends it back to the frontend. The frontend then includes this token in the Authorization header of subsequent requests to protected routes. The auth middleware verifies the token and extracts the user ID, allowing the backend to identify which user is making the request.


// if the token is valid, we call next() to pass control to the next middleware or route handler.
// if the token is invalid or missing the try block throws an error which is caught in the catch block and we return a 401 response.