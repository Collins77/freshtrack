-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock entries table
CREATE TABLE IF NOT EXISTS stock_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('Fruits', 'Vegetables')),
  quantity DECIMAL(10,2) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'pieces')),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price > 0),
  total_value DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  date_added DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stock_user_id ON stock_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_stock_date ON stock_entries(date_added);
CREATE INDEX IF NOT EXISTS idx_stock_category ON stock_entries(category);

-- Run seed data
-- \i /docker-entrypoint-initdb.d/seed.sql