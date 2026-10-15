import sql from 'mssql';
import connectToDB from '../config/db.js';
import logger from '../middleware/logger.middelware.js';
import bcrypt from 'bcrypt'

const DBConetion = connectToDB();
const saltedRounds = parseInt(process.env.SALTED_NUMBERS, 10) || 10;

async function savingNewPerson( firstName, lastName, email, password, companyId) {
    if(!email || !password) return;

    try {
        const hashedPassword = await bcrypt.hash(password, saltedRounds);
        const db = await DBConetion;

        await db.request()
        .input('firstName', sql.VarChar(50), firstName)
        .input('lastName', sql.VarChar(50), lastName)
        .input('email', sql.VarChar(100), email)
        .input('password', sql.VarChar(70), hashedPassword)
        .input('companyId', sql.Int, companyId)
        .query(`INSERT INTO contactPerson (firstName, lastName, email, password, companyId)
                VALUES (@firstName ,@lastName ,@email ,@password, @companyId)`)

        return true;
    } catch (error) {
        logger.error(`Användare kunde inte sparas: ${error}`);

        return error;
    }
}

async function fetchUserEmail(email) {
    if(!email) return;

    try {
        const db = await DBConetion;
        
        const userEmail = await db.request()
        .input('email', sql.VarChar(100), email)
        .query(`SELECT email 
                FROM contactPerson
                WHERE email = @email`)


        return userEmail.recordset || [];
    } catch (error) {
        return error;
    }
}

async function fetchUserInformation(email) {
    if(!email) return;

    try {
        const db = await DBConetion;

        const userInformation = await db.request()
        .input('email', sql.VarChar(50), email)
        .query(`SELECT cp.firstName, cp.lastName, cp.email, cp.password, cp.companyID, cp.contactPersonID, u.userID
                FROM contactPerson cp INNER JOIN users u ON cp.contactPersonID = u.contactPersonID 
                WHERE email = @email`)

        return userInformation.recordset || [];
    } catch (error) {
        
    }
}

async function getAllUsers() {

    try {
        const db = await DBConetion;
        const allUsers = await db.request()
        .query(`SELECT cp.contactPersonID, cp.firstName, cp.lastName, cp.email, c.companyName
                FROM contactPerson cp LEFT JOIN company c ON cp.companyID = c.companyID;`)

        return allUsers.recordset;
    } catch (error) {
        
    }
}

async function contactOnID( contactPersonID ) {
    if(!contactPersonID) return;

    try {
        
        const db = await DBConetion;
        const response = await db.request()
        .input('contactPersonID', sql.Int, contactPersonID)
        .query(`SELECT contactPersonID, companyID, firstName, lastName, email, password
                FROM contactPerson
                WHERE contactPersonID = @contactPersonID`)

        return response.recordset || [];
    } catch (error) {
        logger.error('Kunnde inte hämta användare baserat på id: ', error);
    }
}

async function saveOverContact (firstName, lastName, email, companyID, contactPersonID) {
    
    try {
        const db =  await DBConetion;
        const response = await db.request()
        .input('contactPersonID', sql.Int, contactPersonID)
        .input('firstName', sql.VarChar(50), firstName)
        .input('lastName', sql.VarChar(50), lastName)
        .input('email', sql.VarChar(100), email)
        .input('companyID', sql.Int, companyID)
        .query(`UPDATE contactPerson
                SET companyID = @companyID, 
                firstName = @firstName, 
                lastName = @lastName, 
                email = @email
                WHERE contactPersonID = @contactPersonID;`)

    return response.recordset;
    } catch (error) {
        logger.error('Fel uppstog vid uppdatering av person: ', error);
    }
}

async function deletePerson(contactPersonID) {
    let transaction;

    try {
        const db = await DBConetion;
        transaction = new sql.Transaction(db);

        await transaction.begin();
        const request = new sql.Request(transaction);
        request.input('contactPersonID', sql.Int, contactPersonID);

        await request.query(`UPDATE sales
            SET userID = NULL
            WHERE userID IN (
                SELECT userID
                FROM users
                WHERE contactPersonID = @contactPersonID
            )`);

        await request.query(`UPDATE sales
            SET contactPersonID = NULL
            WHERE contactPersonID = @contactPersonID`);

        await request.query(`DELETE FROM users
            WHERE contactPersonID = @contactPersonID`);
            
        await request.query(`DELETE FROM contactPerson
            WHERE contactPersonID = @contactPersonID`);

        await transaction.commit();

        return { success: true, message: 'Angiven användare har blivit raderad.' };
    } catch (error) {
        if (transaction) {
            try {
                await transaction.rollback();
            } catch (rollbackError) {
                logger.error('Kunde inte återställa raderingstransaktionen.', rollbackError);
            }
        }
        logger.error('Kunde inte radera användare.', error);
        throw error;
    }
}

export {savingNewPerson, fetchUserEmail, fetchUserInformation, getAllUsers, contactOnID, saveOverContact, deletePerson};