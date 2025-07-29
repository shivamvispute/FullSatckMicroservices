const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'password', // this MUST match docker-compose
  host: 'postgres',     // service name in docker-compose
  port: 5432,
  database: 'taskdb',
  ssl: false,            // 💥 force SSL off completely
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ PG Error:', err);
  process.exit(-1);
});

process.on('SIGINT', () => {
  pool.end();
  process.exit(0);
});

module.exports = pool;
