require('dotenv').config();
const sql = require('mssql');

const config = process.env.AZURE_SQL_URL;

async function fixDb() {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to DB');

    // Find the unique constraint on google_id
    const result = await pool.request().query(`
      SELECT tc.CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
      JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu
        ON tc.CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
      WHERE tc.TABLE_NAME = 'Users' 
        AND ccu.COLUMN_NAME = 'google_id'
        AND tc.CONSTRAINT_TYPE = 'UNIQUE'
    `);

    if (result.recordset.length > 0) {
      const constraintName = result.recordset[0].CONSTRAINT_NAME;
      console.log('Found constraint:', constraintName);
      
      // Drop the constraint
      await pool.request().query(`ALTER TABLE Users DROP CONSTRAINT ${constraintName}`);
      console.log('Dropped constraint.');
      
      // Create filtered index
      await pool.request().query(`
        CREATE UNIQUE INDEX UQ_Users_google_id 
        ON Users(google_id) 
        WHERE google_id IS NOT NULL;
      `);
      console.log('Created filtered unique index.');
    } else {
      console.log('No unique constraint found on google_id. Maybe already fixed?');
      // check if filtered index exists
      const idxResult = await pool.request().query(`
        SELECT name FROM sys.indexes WHERE name = 'UQ_Users_google_id'
      `);
      if (idxResult.recordset.length === 0) {
         console.log('Creating filtered unique index...');
         await pool.request().query(`
           CREATE UNIQUE INDEX UQ_Users_google_id 
           ON Users(google_id) 
           WHERE google_id IS NOT NULL;
         `);
         console.log('Created.');
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixDb();
