import sql from 'mssql';
import 'dotenv/config';
import logger from '../middleware/logger.middelware.js';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_DATABASE,
    options: {
        trustServerCertificate: true
    }
}

function connectToDB() {
    return sql.connect(config)
    .then(pool => {
        logger.info('DB conected.');
        return pool;
    })
    .catch(error => {
        logger.info(`Cudent conect to DB: ${error}`);
        throw error;
    })
}

export default connectToDB;