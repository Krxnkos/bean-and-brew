const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

class AuthMiddleware {
  static requireAuth(req, res, next) {
    if (!req.cookies.jwt) {
      return res.redirect('/auth/login');
    }
    try {
      const token = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
      req.user = token;
      next();
    } catch (error) {
      res.clearCookie('jwt');
      return res.redirect('/auth/login');
    }
  }

  static authenticate(req, res, next) {
    // Skip authentication for public routes
    const publicPaths = ['/login', '/auth/login', '/auth/register', '/'];
    if (publicPaths.includes(req.path)) {
        return next();
    }

    const token = req.cookies.jwt;
    
    if (!token) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        return res.redirect('/auth/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        res.locals.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('jwt');
        return res.redirect('/auth/login');
    }
  }

  static validateBooking() {
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

  static validateLogin() {
    return [
        check('username')
            .trim()
            .notEmpty()
            .withMessage('Username/Email is required'),
        check('password')
            .notEmpty()
            .withMessage('Password is required'),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array() 
                });
            }
            next();
        }
    ];
  }

  static validateRegister() {
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

module.exports = AuthMiddleware;