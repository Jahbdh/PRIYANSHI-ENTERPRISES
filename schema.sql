PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price_paise INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  service_id INTEGER NOT NULL,
  customer_note TEXT DEFAULT '',
  file_name TEXT DEFAULT '',
  amount_paise INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK(payment_status IN ('pending','submitted','paid','rejected')),
  order_status TEXT NOT NULL DEFAULT 'received' CHECK(order_status IN ('received','processing','ready','completed','cancelled')),
  payment_reference TEXT DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(service_id) REFERENCES services(id)
);
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);
INSERT OR IGNORE INTO app_settings(key,value) VALUES ('business_name','Priyanshi Enterprises'),('upi_id',''),('upi_name','Priyanshi Enterprises'),('support_mobile','');
INSERT OR IGNORE INTO services(name,description,price_paise) VALUES
 ('Black & White Print','Per page printing',200),
 ('Colour Print','Per page colour printing',500),
 ('Photocopy','Per page photocopy',200),
 ('Passport Photo','Passport-size photo print',3000),
 ('Online Form Fill-up','Online form filling service',5000);
