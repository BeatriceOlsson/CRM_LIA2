import sql from 'mssql';
import connectToDB from "../config/db.js";
import logger from '../middleware/logger.middelware.js';

const DBConetion = connectToDB();

async function getAllSales() {

    try {
    const db = await DBConetion;
    const response = await db.request()
    .query(`SELECT s.salesID, s.salesValue, s.salesStatus, c.companyName, 
            cp_person.firstName AS CPFirstName, 
            cp_person.lastName AS CPLastName, 
            cp_sales.firstName AS salesFirstName, 
            cp_sales.lastName AS salesLastName
            FROM sales s LEFT JOIN company c ON s.companyID = c.companyID
            LEFT JOIN contactPerson cp_person ON s.contactPersonID = cp_person.contactPersonID
            LEFT JOIN users u ON s.userID = u.userID
            LEFT JOIN contactPerson cp_sales ON u.contactPersonID = cp_sales.contactPersonID;`)

            return response.recordset || [];
    } catch (error) {
        logger.error('Kunde inte hämta försäljningar: ', error);
    }
}

async function saveASales(salesValue, salesStatus, companyID, contactPersonID, userID ){
    if(!companyID || !contactPersonID || !userID) return;

    try {
        const db = await DBConetion;
        const respons = await db.request()
        .input('salesValue', sql.Decimal(10,2), salesValue)
        .input('salesStatus', sql.VarChar(50), salesStatus)
        .input('companyID', sql.Int, companyID)
        .input('contactPersonID', sql.Int, contactPersonID)
        .input('userID', sql.Int, userID)
        .query(`INSERT INTO sales (salesValue, salesStatus, companyID, contactPersonID, userID)
                VALUES (@salesValue, @salesStatus, @companyID, @contactPersonID, @userID)`)

                return respons.recordset || [];
    } catch (error) {
        logger.error('Kunde inte spara köp: ', error)
        throw error;
    }
}

export {getAllSales, saveASales};