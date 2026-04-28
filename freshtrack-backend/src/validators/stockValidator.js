const { body } = require('express-validator');

const stockValidator = [
  body('product_name')
    .trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Product name must be 2–100 characters'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['Fruits', 'Vegetables']).withMessage('Category must be Fruits or Vegetables'),

  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isFloat({ gt: 0 }).withMessage('Quantity must be a positive number'),

  body('unit')
    .notEmpty().withMessage('Unit is required')
    .isIn(['kg', 'pieces']).withMessage('Unit must be kg or pieces'),

  body('unit_price')
    .notEmpty().withMessage('Unit price is required')
    .isFloat({ gt: 0 }).withMessage('Unit price must be a positive number'),

  body('date_added')
    .optional()
    .isDate().withMessage('Date must be a valid date (YYYY-MM-DD)'),
];

module.exports = { stockValidator };