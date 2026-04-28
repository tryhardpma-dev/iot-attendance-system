import pg from 'pg';

const { Pool } = pg;


const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "228325602",
    database: "attendance_system",
});


export default {
    query: (text, params) => pool.query(text, params), 
};