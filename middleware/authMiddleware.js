const { check, validationResult } = require('express-validator');

class AuthMiddleware {
  validateLogin() {
    return [
      check('email', 'Email is required').isEmail(),
      check('password', 'Password is required').exists(),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.error('Login validation errors:', errors.array());
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
    ];
  }

  validateRegister() {
    return [
      check('email', 'Email is required').isEmail(),
      check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
      check('firstName', 'First name is required').not().isEmpty(),
      check('lastName', 'Last name is required').not().isEmpty(),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.error('Register validation errors:', errors.array());
          return res.status(400).json({ errors: errors.array() });
        }
        next();
      }
    ];
  }
}

module.exports = new AuthMiddleware();