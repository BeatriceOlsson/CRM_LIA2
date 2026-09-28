import connectToDB from "../config/db.js";
import sql from 'mssql';
import logger from "../middleware/logger.middelware.js";

const DBConetion = connectToDB();

async function saveCompanyInDb( companyName ) {
    if(!companyName) return;

    try {
        const db = await DBConetion;

        await db.request()
        .input('companyName', sql.VarChar(100), companyName)
        .query(`INSERT INTO company (companyName)
                VALUES (@companyName)`)

        return true;
    } catch (error) {
        logger.error(`Företag kunde inte sparas: ${error}`)
    }
}

async function companyIdDB( companyName ) {
    if(!companyName) return;
console.log('anrop om id');
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
        console.log('Inann anrop');
        const db = await DBConetion;
        const companyData = await db.request()
        .query(`SELECT companyName FROM company`)
console.log('efter anrop', companyData);
        return companyData.recordset || [];
    }catch (error) {
        res.status(500).json({message: 'Kunde inte hämta företag.'});
    }
}

export { saveCompanyInDb, companyIdDB, allCompanyName, companyNameDB }