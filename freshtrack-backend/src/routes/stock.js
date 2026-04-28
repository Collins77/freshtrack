const express = require('express');
const router = express.Router();
const {
  createEntry,
  getAllEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getSummary,
} = require('../controllers/stockController');
const { protect } = require('../middleware/auth');
const { stockValidator } = require('../validators/stockValidator');

// All routes protected
router.use(protect);

router.get('/summary', getSummary);
router.route('/')
  .get(getAllEntries)
  .post(stockValidator, createEntry);

router.route('/:id')
  .get(getEntry)
  .put(stockValidator, updateEntry)
  .delete(deleteEntry);

module.exports = router;