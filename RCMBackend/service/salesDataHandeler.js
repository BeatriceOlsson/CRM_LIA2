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
            FROM sales s LEFT JOIN company c ON s.companyID = c.companyID
            LEFT JOIN contactPerson cp_person ON s.contactPersonID = cp_person.contactPersonID
            LEFT JOIN users u ON s.userID = u.userID
            LEFT JOIN contactPerson cp_sales ON u.contactPersonID = cp_sales.contactPersonID
            LEFT JOIN v_salesCalculationse vs ON s.salesID = vs.salesID`)

            return response.recordset || [];
    } catch (error) {
        logger.error('Kunde inte hämta försäljningar: ', error);
    }
}

async function saveASales(salesValue, title, salesStatus, companyID, contactPersonID, userID, purcheseValue ){
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
        .input('purcheseValue', sql.Decimal(10,2), purcheseValue)
        .query(`INSERT INTO sales (salesValue, title, salesStatus, companyID, contactPersonID, userID, purcheseValue)
                VALUES (@salesValue, @title, @salesStatus, @companyID, @contactPersonID, @userID, @purcheseValue)`)

                return respons.recordset || [];
    } catch (error) {
        logger.error('Kunde inte spara köp: ', error)
        throw error;
    }
}

async function salesOnID(salesID) {
    if(!salesID) return;

    try {
        const db = await DBConetion;
        const respons = await db.request()
        .input('salesID', sql.Int, salesID)
        .query(`SELECT s.salesID, s.contactPersonID, s.companyID, s.userID, s.salesStatus, s.title, s.salesValue,s.purcheseValue
                FROM sales s 
                WHERE s.salesID = @salesID;`)

        return respons.recordset || []; 

    } catch (error) {
        logger.error('Gock inte att hämta data kopplad till id.')
    }
}

async function saveOverSales( salesID, salesValue, title, salesStatus, companyID, contactPersonID, userID, purcheseValue ) {

    try {
        const db = await DBConetion;
        const respons = await db.request()
        .input('salesID', sql.Int, salesID)
        .input('salesValue', sql.Decimal(10,2), salesValue)
        .input('title', sql.VarChar(100), title)
        .input('salesStatus', sql.VarChar(50), salesStatus)
        .input('companyID', sql.Int, companyID)
        .input('contactPersonID', sql.Int, contactPersonID)
        .input('userID', sql.Int, userID)
        .input('purcheseValue', sql.Decimal(10,2), purcheseValue)
        .query(`UPDATE sales
                SET salesValue =  @salesValue, 
                salesStatus = @salesStatus, 
                companyID = @companyID, 
                contactPersonID = @contactPersonID, 
                userID = @userID, 
                title = @title, 
                purcheseValue = @purcheseValue
                WHERE salesID = @salesID;`)

        return respons.recordset;
    } catch (error) {
        logger.error('Kunde inte sparra över den nya datan över föraäljningen.');
    }
}

async function deleteSales( salesID ) {
    let transaction;

    try {
        const db = await DBConetion;
        transaction = new sql.Transaction(db);

        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input('salesID', sql.Int, salesID)

        await request.query(`DELETE FROM sales
                    WHERE salesID = @salesID`)

        await transaction.commit();

        return { message: 'Angiven försäljning har blivit raderad.'}
    } catch (error) {
     logger.error('Kunde inte radera försäljning:', error)   
    }
}

export {getAllSales, saveASales, salesOnID, saveOverSales, deleteSales};