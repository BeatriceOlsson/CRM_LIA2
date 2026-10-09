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

async function userIDData(userID) {
    try {
        const db = await DBConetion;
        const respons = await db.request()
        .input('userID', sql.Int, userID)
        .query(`SELECT userID, contactPersonID
                FROM users
                WHERE userID = @userID`)

        return respons.recordset || [];
    } catch (error) {
        logger.error('Kunde inet hämmta');
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
        return [];
    }
}

async function deliteUser(userID) {
    let transaction;

    try {
        const db = await DBConetion;
        transaction = new sql.Transaction(db);

        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input('userID', sql.Int, userID)


         await request.query(`UPDATE sales
                SET userID = NULL
                WHERE userID = @userID;`)

        await request.query(`DELETE FROM users
                WHERE userID = @userID`)

        await transaction.commit();

        return { message: 'Angiven användare har blivit raderad.'}
    } catch (error) {
        logger.error('Kunde inte radera användare.', error)
    }
}


export {saveSalesUser, getUsersID, allUserNames, deliteUser, userIDData};