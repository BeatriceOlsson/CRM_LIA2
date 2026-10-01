import sql from 'mssql';
import connectToDB from '../config/db.js';
import logger from '../middleware/logger.middelware.js';

const DBConetion = connectToDB();

async function saveSalesUser(contactPersonID) {
    if(!contactPersonID) return;

    try {
        const db = await DBConetion;
        const response = await db.request()
        .input('contactPersonID', sql.Int, contactPersonID)
        .query(`INSERT INTO users (contactPersonID)
                VALUES (@contactPersonID)`)

                return response.recordset || [];
    } catch (error) {
        logger.error('Kunde inte spara användare: ', error);
    }
}

async function getUsersID(contactPersonID) {
    if(!contactPersonID) return;

    try {
        const db = await DBConetion;
        const response = await db.request()
        .input('contactPersonID', sql.Int, contactPersonID)
        .query(`SELECT userID
                FROM users
                WHERE contactPersonID = @contactPersonID`)
       
                return response.recordset || [];
    } catch (error) {
        logger.error('Kunde inte hämmta användare: ', error);
    }
}

async function allUserNames() {
    try {
        const db = await DBConetion;
        const response = await db.request()
        .query(`SELECT u.userID, cp.firstName, cp.lastName 
                FROM users u left join contactPerson cp on u.contactPersonID = cp.contactPersonID`)
                
                return response.recordset || [];
    } catch (error) {
        logger.error('Kunde inte hämmta användare: ', error);
    }
}


export {saveSalesUser, getUsersID, allUserNames};