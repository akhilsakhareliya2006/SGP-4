-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Subscription boxes table
CREATE TABLE IF NOT EXISTS subscription_boxes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category_id INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    customization TEXT,
    image_url TEXT,
    description TEXT,
    features TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    box_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES subscription_boxes(id) ON DELETE CASCADE,
    UNIQUE(user_id, box_id) -- One review per user per box
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    box_id INTEGER NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    next_billing_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES subscription_boxes(id) ON DELETE CASCADE
);

-- Comparison lists table
CREATE TABLE IF NOT EXISTS comparison_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT DEFAULT 'My Comparison',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Comparison items table
CREATE TABLE IF NOT EXISTS comparison_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comparison_id INTEGER NOT NULL,
    box_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comparison_id) REFERENCES comparison_lists(id) ON DELETE CASCADE,
    FOREIGN KEY (box_id) REFERENCES subscription_boxes(id) ON DELETE CASCADE,
    UNIQUE(comparison_id, box_id)
);

-- Insert default categories
INSERT OR IGNORE INTO categories (name, description) VALUES
('Food', 'Gourmet ingredients, snacks, and culinary experiences'),
('Books', 'Literary adventures and reading discoveries'),
('Beauty', 'Skincare, makeup, and beauty essentials'),
('Fitness', 'Workout gear, supplements, and fitness accessories'),
('Tech', 'Latest gadgets, accessories, and tech innovations'),
('Lifestyle', 'Wellness, home, and lifestyle products');