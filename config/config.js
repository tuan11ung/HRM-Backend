require('dotenv').config(); // Load .env variables

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Adjust this based on your SSL certificate setup
      }
    }
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}`,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Be cautious with this in production
      }
    }
  }
}; 