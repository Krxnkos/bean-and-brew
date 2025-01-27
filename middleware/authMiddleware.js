const { check, validationResult } = require('express-validator');

class AuthMiddleware {
  // Authentication check middleware
  requireAuth(req, res, next) {
    const firstName = req.cookies.firstName;
    const userType = req.cookies.userType;

    if (!firstName || !userType) {
      return res.redirect('/auth/login');
    }

    req.user = { firstName, userType };
    next();
  }

  // Booking validation middleware
  validateBooking() {
    return [
      check('location')
        .isIn(['Leeds', 'Harrogate', 'Knaresborough Castle'])
        .withMessage('Invalid location'),
      check('date')
        .isDate()
        .withMessage('Valid date is required'),
      check('time')
        .matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage('Valid time is required'),
      check('guests')
        .isInt({ min: 1, max: 8 })
        .withMessage('Number of guests must be between 1 and 8'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            error: 'Validation failed', 
            errors: errors.array() 
          });
        }
        next();
      }
    ];
  }

  validateLogin() {
    return [
      check('email')
        .isEmail()
        .withMessage('Valid email is required')
        .normalizeEmail(),
      check('password')
        .exists()
        .withMessage('Password is required'),
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ 
            error: 'Validation failed', 
            errors: errors.array() 
          });
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