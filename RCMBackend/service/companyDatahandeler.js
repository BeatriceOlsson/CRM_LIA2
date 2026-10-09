import connectToDB from "../config/db.js";
import sql from 'mssql';
import logger from "../middleware/logger.middelware.js";

const DBConetion = connectToDB();

async function saveCompanyInDb( companyName, orgNr, adress ) {
    if(!companyName) return;

    try {
        const db = await DBConetion;

        await db.request()
        .input('companyName', sql.VarChar(100), companyName)
        .input('orgNr', sql.Int, orgNr)
        .input('adress', sql.VarChar(225), adress)
        .query(`INSERT INTO company (companyName, orgNr, adress)
                VALUES (@companyName, @orgNr, @adress)`)

        return true;
    } catch (error) {
        logger.error(`Företag kunde inte sparas: ${error}`)
    }
}

async function companyIdDB( companyName ) {
    if(!companyName) return;

    try {
        const db = await DBConetion;

        const companyId = await db.request()
        .input('companyName', sql.VarChar(100), companyName)
        .query(`SELECT companyID
                FROM company WHERE companyName = @companyName`)

        return companyId.recordset || [];
    } catch (error) {
        return error;
    }
}

async function companyNameDB( companyId ) {
    if(!companyId) return;

    try {
        const db = await DBConetion;

        const companyName = await db.request()
        .input('companyId', sql.Int, companyId)
        .query(`SELECT companyName 
                FROM company WHERE companyID = @companyId`)

        return companyName.recordset || [];
    } catch (error) {
     res.status(500).json({message: 'Kunde inte hämta företag.'});   
    }
}

async function allCompanyName(){
    try{

        const db = await DBConetion;
        const companyData = await db.request()
        .query(`SELECT companyName FROM company`)

        return companyData.recordset || [];
    }catch (error) {
        res.status(500).json({message: 'Kunde inte hämta företag.'});
    }
}

async function companyData() {

    try {
        const db = await DBConetion;
        const response = await db.request()
        .query(`SELECT c.companyID, c.companyName, c.orgNr, c.adress, tsosv.totalValue
                FROM company c LEFT JOIN totalSumOfSalesValue tsosv ON c.companyID = tsosv.companyID;`);

                return response.recordset || [];
    } catch (error) {
        res.status(400).json({ message: 'Kunde inte hämta alla företag.'})
    }
}

async function companyOnID(companyID) {
    if(!companyID) return;

    try {
        
        const db = await DBConetion;
        const response = await db.request()
        .input('companyID', sql.Int, companyID)
        .query(`SELECT companyID, companyName, orgNr, adress
                FROM company
                WHERE companyID = @companyID`)

        return response.recordset || [];
    } catch (error) {
        logger.error('Fel uppstog vid hämtning av företags data: ', error);
    }
}

async function saveOverCompany(companyID, companyName, orgNr, adress) {

    try {
        
        const db = await DBConetion;
        const response = await db.request()
        .input('companyID', sql.Int, companyID)
        .input('companyName', sql.VarChar(100), companyName)
        .input('orgNr', sql.Int, orgNr)
        .input('adress', sql.VarChar(225), adress)
        .query(`UPDATE company
                SET companyName = @companyName, 
                orgNr = @orgNr, 
                adress = @adress
                WHERE companyID = @companyID`)

        return response.recordset;
    } catch (error) {
        logger.error('Kunde inte uppdatera företags data: ', error);
    }
}

async function deleteCompany( companyID ) {
    let transaction;
    try {
        const db = await DBConetion;
        transaction = new sql.Transaction(db);

        await transaction.begin();

        const request = new sql.Request(transaction);
        request.input('companyID', sql.Int, companyID)

        await request.query(`UPDATE contactPerson
                    SET companyID = NULL
                    WHERE companyID = @companyID;`)

        await request.query(`UPDATE sales
                    SET companyID = NULL
                    WHERE companyID = @companyID;`)

        await request.query(`DELETE FROM company
                    WHERE companyID = @companyID;`)

        await transaction.commit();

        return { message: 'Angivet företag har blivit raderad.'}
    } catch (error) {
        logger.error('Kunde inte radera företag.', error)
    }
}


export { saveCompanyInDb, companyIdDB, allCompanyName, companyNameDB, companyData, companyOnID, saveOverCompany, deleteCompany}