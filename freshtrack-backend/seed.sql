-- Demo User

INSERT INTO users (id, name, email, password) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Sample User',
  'admin@freshtrack.com',
  '$2b$12$0vIQqF7/ZdeYalXm7FO8Eu1qBynjDKP4.P9gaCI5Bc46j4nkLlWBC' -- Admin1234
) ON CONFLICT (email) DO NOTHING;

-- Sample Stock Entries
INSERT INTO stock_entries (user_id, product_name, category, quantity, unit, unit_price, date_added) VALUES

-- Fruits
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fresh Apples',      'Fruits',     150.00, 'kg',     2.50,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bananas',           'Fruits',     200.00, 'kg',     1.20,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Mangoes',           'Fruits',      80.00, 'kg',     3.80,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Strawberries',      'Fruits',      40.00, 'kg',     5.50,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Oranges',           'Fruits',     120.00, 'kg',     2.20,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Watermelon',        'Fruits',      30.00, 'pieces', 4.00,  CURRENT_DATE - 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Pineapples',        'Fruits',      50.00, 'pieces', 3.50,  CURRENT_DATE - 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Grapes',            'Fruits',      60.00, 'kg',     6.00,  CURRENT_DATE - 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Passion Fruits',    'Fruits',      90.00, 'pieces', 0.50,  CURRENT_DATE - 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Avocados',          'Fruits',      70.00, 'pieces', 1.50,  CURRENT_DATE - 2),

-- Vegetables
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Fresh Carrots',     'Vegetables', 180.00, 'kg',     1.80,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tomatoes',          'Vegetables', 200.00, 'kg',     2.20,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Spinach',           'Vegetables',  50.00, 'kg',     3.00,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Kale',              'Vegetables',  60.00, 'kg',     2.50,  CURRENT_DATE),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Onions',            'Vegetables', 150.00, 'kg',     1.50,  CURRENT_DATE - 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Garlic',            'Vegetables',  30.00, 'kg',     4.50,  CURRENT_DATE - 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Cabbage',           'Vegetables',  80.00, 'pieces', 1.20,  CURRENT_DATE - 1),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Broccoli',          'Vegetables',  45.00, 'kg',     3.80,  CURRENT_DATE - 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bell Peppers',      'Vegetables',  70.00, 'kg',     4.20,  CURRENT_DATE - 2),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sweet Potatoes',    'Vegetables', 100.00, 'kg',     2.00,  CURRENT_DATE - 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Cucumber',          'Vegetables',  90.00, 'kg',     1.80,  CURRENT_DATE - 3),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Zucchini',          'Vegetables',  55.00, 'kg',     2.80,  CURRENT_DATE - 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Lettuce',           'Vegetables',  40.00, 'pieces', 1.50,  CURRENT_DATE - 4),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Green Beans',       'Vegetables',  65.00, 'kg',     3.20,  CURRENT_DATE - 5),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Eggplant',          'Vegetables',  50.00, 'kg',     2.60,  CURRENT_DATE - 5);