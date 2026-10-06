import sql from 'mssql';
import connectToDB from "../config/db.js";
import logger from '../middleware/logger.middelware.js';

const DBConetion = connectToDB();

async function getAllSales() {

    try {
    const db = await DBConetion;
    const response = await db.request()
    .query(`SELECT s.salesID, s.salesStatus, s.title, s.salesValue,s.purcheseValue,
            vs.differenceValue,
            vs.percentageDifferense,
            c.companyName,
            cp_person.firstName AS CPFirstName, 
            cp_person.lastName AS CPLastName, 
            cp_sales.firstName AS salesFirstName, 
            cp_sales.lastName AS salesLastName
            FROM sales s INNER JOIN company c ON s.companyID = c.companyID
            INNER JOIN contactPerson cp_person ON s.contactPersonID = cp_person.contactPersonID
            INNER JOIN users u ON s.userID = u.userID
            INNER JOIN contactPerson cp_sales ON u.contactPersonID = cp_sales.contactPersonID
            INNER JOIN v_salesCalculationse vs ON s.salesID = vs.salesID`)

            return response.recordset || [];
    } catch (error) {
        logger.error('Kunde inte hämta försäljningar: ', error);
    }
}

async function saveASales(salesValue, title, salesStatus, companyID, contactPersonID, userID ){
    if(!companyID || !contactPersonID || !userID) return;

    try {
        const db = await DBConetion;
        const respons = await db.request()
        .input('salesValue', sql.Decimal(10,2), salesValue)
        .input('title', sql.VarChar(100), title)
        .input('salesStatus', sql.VarChar(50), salesStatus)
        .input('companyID', sql.Int, companyID)
        .input('contactPersonID', sql.Int, contactPersonID)
        .input('userID', sql.Int, userID)
        .query(`INSERT INTO sales (salesValue, title, salesStatus, companyID, contactPersonID, userID)
                VALUES (@salesValue, @title, @salesStatus, @companyID, @contactPersonID, @userID)`)

                return respons.recordset || [];
    } catch (error) {
        logger.error('Kunde inte spara köp: ', error)
        throw error;
    }
}

export {getAllSales, saveASales};