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
;
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
        .query(`SELECT firstName, lastName, email, password, companyID
                FROM contactPerson WHERE email = @email`)

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

export {savingNewPerson, fetchUserEmail, fetchUserInformation, getAllUsers};