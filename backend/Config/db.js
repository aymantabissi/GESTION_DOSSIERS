require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL && process.env.NODE_ENV === 'production') {
  console.log('🚀 Connecting to production database...');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { 
      ssl: { require: true, rejectUnauthorized: false } 
    },
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    },
    logging: false,
  });
} else {
  console.log('🏠 Connecting to local database...');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      pool: {
        max: 10,          // Maximum connections
        min: 2,           // Minimum connections
        acquire: 30000,   // Maximum time to get connection
        idle: 10000       // Maximum time connection can be idle
      },
      logging: (sql, timing) => {
        // Only log slow queries in development
        if (timing && timing > 1000) {
          console.warn(`⚠️ Slow query (${timing}ms):`, sql.substring(0, 150) + '...');
        }
      },
      retry: {
        max: 3
      }
    }
  );
}

module.exports = sequelize;