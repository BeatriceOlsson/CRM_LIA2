import express from 'express'
import { companyIdDB, saveCompanyInDb, allCompanyName, companyData } from '../service/companyDataHandeler.js';
import logger from '../middleware/logger.middelware.js';
import { verifyToken } from '../middleware/jwt.middelware.js';
import { getAllSales } from '../service/salesDataHandeler.js';

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

export default routes;