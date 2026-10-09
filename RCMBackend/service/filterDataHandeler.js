import sql from 'mssql';
import connectToDB from "../config/db.js";
import logger from '../middleware/logger.middelware.js';

const DBConetion = connectToDB();

async function filterSales(status1, status2, companyID, contactPersonID, userID) {
    
    try {
        const db = await DBConetion;
        const response = await db.request()
        .input('status1', sql.VarChar(50), status1)
        .input('status2', sql.VarChar(50), status2)
        .input('companyID', sql.Int, companyID)
        .input('contactPersonID', sql.Int, contactPersonID)
        .input('userID', sql.Int, userID)
        .query(`SELECT s.salesID, s.salesValue, s.title, s.salesStatus, c.companyName,s.userID, purcheseValue, 
            vs.differenceValue,
            vs.percentageDifferense,
                cp_person.firstName AS CPFirstName, 
                cp_person.lastName AS CPLastName,
                cp_sales.firstName AS salesFirstName, 
                cp_sales.lastName AS salesLastName
                    FROM sales s INNER JOIN company c ON s.companyID = c.companyID
                    INNER JOIN contactPerson cp_person ON s.contactPersonID = cp_person.contactPersonID
                    INNER JOIN users u ON s.userID = u.userID
                    INNER JOIN contactPerson cp_sales ON u.contactPersonID = cp_sales.contactPersonID
                    INNER JOIN v_salesCalculationse vs ON s.salesID = vs.salesID
                        WHERE(@status1 IS NULL OR s.salesStatus = @status1)
                        AND (@status2 IS NULL OR s.salesStatus = @status2)
                        AND (@companyID IS NULL OR s.companyID = @companyID)
                        AND (@contactPersonID IS NULL OR s.contactPersonID = @contactPersonID)
                        AND (@userID IS NULL OR s.userID = @userID);`)

        return response.recordset || [];
    } catch (error) {
        logger.error('Fel vid hämtning av filterrad data för sales: ', error)
    }
}

async function filterPersons(companyID, contactPersonID) {

    try {
        const db = await DBConetion;
        const response = await db.request()
        .input('companyID', sql.Int, companyID)
        .input('contactPersonID', sql.Int, contactPersonID)
        .query(`SELECT cp.contactPersonID, cp.firstName, cp.lastName, cp.email, c.companyName, c.companyID
                FROM contactPerson cp INNER JOIN company c ON cp.companyID = c.companyID
                    WHERE (@companyID IS NULL OR c.companyID = @companyID)
                    AND (@contactPersonID IS NULL OR cp.contactPersonID = @contactPersonID);`)

        return response.recordset || [];
    } catch (error) {
        logger.error('Fell vid hämtningl av filtrerad data för personer: ', error)
    }
}

async function filterCompanies (companyID){

    try {
        const db = await DBConetion;
        const response = await db.request()
        .input('companyID', sql.Int, companyID)
        .query(`SELECT companyID, companyName, orgNr, adress
                FROM company
                WHERE (@companyID IS NULL OR companyID = @companyID);`)

        return response.recordset || [];
    } catch (error) {
        logger.error('Fell vid hämtnig av filter data för företag: ', error);
    }
}

export {filterSales, filterPersons, filterCompanies};