import postgres from 'postgres';

const sql = postgres({
  host: 'localhost', // Postgres server
  port: 5432, // Postgres server port
  database: 'ekskursijosVilniuje', // Database name
  username: 'postgres', // Database username
  password: 'admin', // Database password
});

export default sql;

