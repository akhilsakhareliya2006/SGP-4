const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        const dbPath = process.env.DATABASE_URL || './database.sqlite';
        
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                process.exit(1);
            }
            console.log('Connected to SQLite database');
        });

        // Enable foreign keys
        this.db.run('PRAGMA foreign_keys = ON');
        
        // Initialize schema
        this.initSchema();
    }

    initSchema() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        this.db.exec(schema, (err) => {
            if (err) {
                console.error('Error initializing schema:', err.message);
                process.exit(1);
            }
            console.log('Database schema initialized');
            this.seedData();
        });
    }

    seedData() {
        // Check if we already have data
        this.db.get('SELECT COUNT(*) as count FROM subscription_boxes', (err, row) => {
            if (err) {
                console.error('Error checking data:', err.message);
                return;
            }
            
            if (row.count === 0) {
                this.insertSeedData();
            }
        });
    }

    insertSeedData() {
        const seedBoxes = [
            {
                name: 'Netflix',
                category: 'Streaming',
                price: 15.49,
                customization: 'Multiple plans, device preferences',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Netflix_2015_logo.svg',
                description: 'Unlimited movies, TV shows, and more. Watch anywhere. Cancel anytime.',
                features: JSON.stringify(['4K Ultra HD', 'Multiple devices', 'Download offline', 'No ads'])
            },
            {
                name: 'Disney+ Hotstar',
                category: 'Streaming',
                price: 8.25,
                customization: 'Regional content, language preferences',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Disney%2B_Hotstar_logo.svg',
                description: 'Disney, Marvel, Star Wars, and local content in one platform',
                features: JSON.stringify(['Live sports', 'Regional content', 'Multiple languages', 'Kids content'])
            },
            {
                name: 'Amazon Prime Video',
                category: 'Streaming',
                price: 12.99,
                customization: 'Prime membership benefits',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png',
                description: 'Watch movies, TV shows, and original content with Prime membership',
                features: JSON.stringify(['Prime delivery', 'Music included', 'Original content', 'Multiple devices'])
            },
            {
                name: 'Spotify Premium',
                category: 'Music',
                price: 9.99,
                customization: 'Individual, Family, or Student plans',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
                description: 'Music streaming with ad-free listening and offline downloads',
                features: JSON.stringify(['Ad-free music', 'Offline downloads', 'High quality audio', 'Podcasts'])
            },
            {
                name: 'YouTube Premium',
                category: 'Streaming',
                price: 11.99,
                customization: 'Individual or Family plans',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
                description: 'Ad-free YouTube with background play and offline downloads',
                features: JSON.stringify(['Ad-free videos', 'Background play', 'Offline downloads', 'YouTube Music'])
            },
            {
                name: 'Apple Music',
                category: 'Music',
                price: 10.99,
                customization: 'Individual, Family, or Student plans',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Apple_Music_logo.svg',
                description: 'Stream millions of songs with high-quality audio and exclusive content',
                features: JSON.stringify(['Lossless audio', 'Spatial audio', 'Exclusive content', 'Siri integration'])
            },
            {
                name: 'Xbox Game Pass',
                category: 'Gaming',
                price: 14.99,
                customization: 'PC or Console plans',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_game_pass_logo.svg',
                description: 'Access to hundreds of games with new titles added regularly',
                features: JSON.stringify(['Hundreds of games', 'New releases', 'Cloud gaming', 'EA Play included'])
            },
            {
                name: 'PlayStation Plus',
                category: 'Gaming',
                price: 9.99,
                customization: 'Essential, Extra, or Premium tiers',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg',
                description: 'Online multiplayer, monthly games, and exclusive discounts',
                features: JSON.stringify(['Online multiplayer', 'Monthly games', 'Exclusive discounts', 'Cloud saves'])
            },
            {
                name: 'Adobe Creative Cloud',
                category: 'Productivity',
                price: 22.99,
                customization: 'Individual or Team plans',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg',
                description: 'Complete suite of creative tools for designers and content creators',
                features: JSON.stringify(['All Adobe apps', 'Cloud storage', 'Collaboration tools', 'Regular updates'])
            },
            {
                name: 'Microsoft 365',
                category: 'Productivity',
                price: 6.99,
                customization: 'Personal or Family plans',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
                description: 'Office apps, cloud storage, and collaboration tools',
                features: JSON.stringify(['Office apps', '1TB OneDrive', 'Skype minutes', 'Advanced security'])
            },
            {
                name: 'iCloud+',
                category: 'Cloud Storage',
                price: 2.99,
                customization: 'Storage size options',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Apple_iCloud_logo.svg',
                description: 'Secure cloud storage with privacy features and device sync',
                features: JSON.stringify(['End-to-end encryption', 'Device sync', 'Hide My Email', 'Private Relay'])
            },
            {
                name: 'LinkedIn Premium',
                category: 'Social Media',
                price: 29.99,
                customization: 'Career, Business, or Sales Navigator',
                image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png',
                description: 'Professional networking with advanced features and insights',
                features: JSON.stringify(['InMail messages', 'Advanced search', 'Learning courses', 'Insights'])
            }
        ];

        seedBoxes.forEach(box => {
            // Get category ID
            this.db.get('SELECT id FROM categories WHERE name = ?', [box.category], (err, category) => {
                if (err) {
                    console.error('Error finding category:', err.message);
                    return;
                }

                if (category) {
                    this.db.run(`
                        INSERT INTO subscription_boxes 
                        (name, category_id, price, customization, image_url, description, features)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                    `, [
                        box.name,
                        category.id,
                        box.price,
                        box.customization,
                        box.image_url,
                        box.description,
                        box.features
                    ], (err) => {
                        if (err) {
                            console.error('Error inserting box:', err.message);
                        }
                    });
                }
            });
        });

        console.log('Seed data inserted');
    }

    // Helper methods for common queries
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID, changes: this.changes });
                }
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = new Database();