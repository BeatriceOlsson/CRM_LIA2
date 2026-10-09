import express from 'express';
import { companyIdDB, saveCompanyInDb, allCompanyName, companyData, companyOnID, saveOverCompany, deleteCompany } from '../service/companyDatahandeler.js';
import logger from '../middleware/logger.middelware.js';
import { verifyToken } from '../middleware/jwt.middelware.js';

const routes = express.Router();

routes.post('/save', verifyToken, async (req, res) => {
    if(!req.body) {
        return res.status(400).json({message: 'Saaknas infomation om företaget.'});
    }

    const {companyName, orgNr, adress} =req.body;

    try {
        const companyExists = await companyIdDB(companyName);

        if(companyExists.length > 0) {
            return res.status(400).json({ message: 'Företaget existerar redan i systemet.'})
        } 

        await saveCompanyInDb(companyName, orgNr, adress);

        res.status(200).json({ message: 'Flretaget fins nu i systemet.'})
    } catch (error) {
        res.status(500).json({ message: "Fel uppstod vid sparande av företag: ", error})
    }
})

routes.get('/companyList', verifyToken, async (req, res) => {
    try {
     const list = await allCompanyName();

    res.status(200).json(list);   
    } catch (error) {
        logger.error('Kunde inte hämta lista på företag.')
        return res.status(500).json({ message: 'Kunde inte hämmta företags lista'})
    }
})

routes.get('/allCompanyInfo', verifyToken, async (req,res) => {
    try {

        const companyLlist = await companyData();

        res.status(200).json(companyLlist);
    } catch (error) {
        logger.error('Kunde inte hämta data om företag.');
        return res.status(400).json({ message: 'Fel uppstog vid hämtning.'});
    }
})

routes.post('/companyIdData', verifyToken, async ( req, res ) => {
    const { id } = req.body;

    const companyID = id ? Number(id) : null;


    try {
        const companyIDData = await companyOnID(companyID);

        res.status(200).json(companyIDData);
    } catch (error) {
        res.status(400).json({ message: 'Fel uppstog vid hämtning av företags data.'})
    }
})

routes.put('/update', verifyToken, async (req, res) => {
    let { companyID, companyName, orgNr, adress } = req.body;

    if(!companyID) {
        return res.status(500).json({ message: 'Måste finnas ett företag att uppdatera.'})
    }

    companyID = companyID ? Number(companyID) : null;
    companyName = companyName ? companyName : null;
    orgNr = orgNr ? Number(orgNr) : null;
    adress = adress ? adress : null;

    try {
        await saveOverCompany(companyID, companyName, orgNr, adress);

        res.status(200).json({ message: 'Ändringen uppdaterades.'})
    } catch (error) {
        res.status(400).json({ message: 'Fell uppstog när uppdateringen av företag gjordes.'})
    }
})

routes.post('/delete', verifyToken, async (req, res) => {
    const { companyID } = req.body;

    if(!companyID) return res.status(400).json({ message: 'Behöver ha vald företag för att kunna radera data.'});

    const exists = await companyOnID(companyID);
    if(!exists || exists.length === 0) {
        return res.status(400).json({ message: 'Företaget fins inte i systemet.'});
    }

    try {
        await deleteCompany(companyID);

        return res.status(200).json({ message: 'Radering av företag är utförd.'})
    } catch (error) {
        return res.status(500).json({ message: 'Fel uppstog och företag kunde inte tas bort.'})
    }
})

export default routes;