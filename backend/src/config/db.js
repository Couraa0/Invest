const sql = require('mssql');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

// Parse ADO.NET connection string dari .env
function parseAdoNetConnectionString(connStr) {
  const parts = {};
  connStr.split(';').forEach(part => {
    const idx = part.indexOf('=');
    if (idx > -1) {
      const key = part.substring(0, idx).trim().toLowerCase().replace(/ /g, '');
      const value = part.substring(idx + 1).trim();
      parts[key] = value;
    }
  });

  const server = (parts['server'] || parts['datasource'] || '').replace('tcp:', '');
  const [host, portStr] = server.split(',');
  const port = parseInt(portStr || '1433', 10);

  return {
    server: host.trim(),
    port,
    database: parts['initialcatalog'] || parts['database'],
    user: parts['userid'] || parts['uid'],
    password: parts['password'] || parts['pwd'],
    options: {
      encrypt: true,
      trustServerCertificate: false,
      enableArithAbort: true,
    },
    connectionTimeout: 30000,
    requestTimeout: 30000,
  };
}

const config = parseAdoNetConnectionString(process.env.AZURE_SQL_URL || '');

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Connected to Azure SQL Database');
    return pool;
  })
  .catch(err => {
    console.error('❌ Azure SQL Connection Failed:', err.message);
    process.exit(1);
  });

module.exports = { sql, poolPromise };
