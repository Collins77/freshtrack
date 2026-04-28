const { validationResult } = require('express-validator');
const pool = require('../config/db');

// POST /api/stock
// Protected Access
const createEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { product_name, category, quantity, unit, unit_price, date_added } = req.body;

    const result = await pool.query(
      `INSERT INTO stock_entries 
        (user_id, product_name, category, quantity, unit, unit_price, date_added)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, product_name, category, quantity, unit, unit_price,
       date_added || new Date().toISOString().split('T')[0]]
    );

    res.status(201).json({
      status: 'success',
      data: { entry: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/stock
// Protected Access
const getAllEntries = async (req, res, next) => {
  try {
    const { category, from, to, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM stock_entries
      WHERE user_id = $1
    `;
    const params = [req.user.id];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (from) {
      paramCount++;
      query += ` AND date_added >= $${paramCount}`;
      params.push(from);
    }

    if (to) {
      paramCount++;
      query += ` AND date_added <= $${paramCount}`;
      params.push(to);
    }

    // Count total for pagination
    const countResult = await pool.query(
      query.replace('SELECT *', 'SELECT COUNT(*)'),
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Add pagination
    paramCount++;
    query += ` ORDER BY date_added DESC, created_at DESC LIMIT $${paramCount}`;
    params.push(limit);
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    res.status(200).json({
      status: 'success',
      results: result.rows.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: { entries: result.rows },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/stock/:id
// Protected Access
const getEntry = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM stock_entries WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Stock entry not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { entry: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/stock/:id
// Protected Access
const updateEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: 'error', errors: errors.array() });
    }

    const { product_name, category, quantity, unit, unit_price, date_added } = req.body;

    const result = await pool.query(
      `UPDATE stock_entries
       SET product_name = $1, category = $2, quantity = $3,
           unit = $4, unit_price = $5, date_added = $6, updated_at = NOW()
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [product_name, category, quantity, unit, unit_price, date_added,
       req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Stock entry not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { entry: result.rows[0] },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/stock/:id
// Protected Access
const deleteEntry = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM stock_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Stock entry not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Entry deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/stock/summary
// Protected Access
const getSummary = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const params = [req.user.id];
    let dateFilter = '';
    let paramCount = 1;

    if (from) {
      paramCount++;
      dateFilter += ` AND date_added >= $${paramCount}`;
      params.push(from);
    }
    if (to) {
      paramCount++;
      dateFilter += ` AND date_added <= $${paramCount}`;
      params.push(to);
    }

    const summary = await pool.query(
      `SELECT
        COUNT(*) AS total_entries,
        SUM(total_value) AS total_stock_value,
        COUNT(DISTINCT product_name) AS total_products,
        SUM(CASE WHEN quantity < 10 THEN 1 ELSE 0 END) AS low_stock_alerts,
        (SELECT product_name FROM stock_entries
         WHERE user_id = $1 ${dateFilter}
         GROUP BY product_name
         ORDER BY SUM(quantity) DESC LIMIT 1) AS most_stocked_item
       FROM stock_entries
       WHERE user_id = $1 ${dateFilter}`,
      params
    );

    const todayEntries = await pool.query(
      `SELECT COUNT(*) AS today_entries
       FROM stock_entries
       WHERE user_id = $1 AND date_added = CURRENT_DATE`,
      [req.user.id]
    );

    res.status(200).json({
      status: 'success',
      data: {
        ...summary.rows[0],
        today_entries: todayEntries.rows[0].today_entries,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEntry,
  getAllEntries,
  getEntry,
  updateEntry,
  deleteEntry,
  getSummary,
};