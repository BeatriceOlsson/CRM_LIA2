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
        .query(`SELECT companyID, companyName, orgNr, adress
                FROM company`);

                return response.recordset || [];
    } catch (error) {
        res.status(400).json({ message: 'Kunde inte hämta alla företag.'})
    }
}


export { saveCompanyInDb, companyIdDB, allCompanyName, companyNameDB, companyData }