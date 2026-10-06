import express from 'express';
import { verifyToken } from '../middleware/jwt.middelware.js';
import { filterCompanies, filterPersons, filterSales } from '../service/filterDataHandeler.js';

const routes = express.Router();

routes.post('/filterSales', verifyToken, async (req, res) => {
 let {salesStatus, companyID, contactPersonID, usersID} = req.body;

 const status1 = Array.isArray(salesStatus) && salesStatus[0] ? salesStatus[0] : null;
 const status2 = Array.isArray(salesStatus) && salesStatus[1] ? salesStatus[1] : null;
 companyID = companyID ? Number(companyID) : null;
 contactPersonID = contactPersonID ? Number(contactPersonID) : null;
 usersID = usersID ? Number(usersID) : null;

 try {
     const filterdData = await filterSales (status1, status2, companyID, contactPersonID, usersID);

     return res.status(200).json(filterdData);
 } catch (error) {
    return res.status(400).json({ message: 'Kunde inte hämta filtrerad data.'});
 }

})

routes.post('/filterPersons', verifyToken, async (req, res) => {
    let {companyID, contactPersonID} = req.body;

    companyID = companyID ? Number(companyID) : null;
    contactPersonID = contactPersonID ? Number(contactPersonID) : null;

    try {
        const filterdData = await filterPersons(companyID, contactPersonID);

        return res.status(200).json(filterdData);
    } catch (error) {
        return res.status(400).json({message: 'Fell uppstig vid hämtning av filtrerad personer.'});
    }
})

routes.post('/filterCompany', verifyToken, async (req, res) => {
    let {companyID} = req.body;

    companyID = companyID ? Number(companyID) : null;

    try {
        const filterdData = await filterCompanies(companyID);

        return res.status(200).json(filterdData);
    } catch (error) {
        return res.status(400).json({ message: 'Fell uppstig vid hämtning av filtrerad företag.'})
    }
})

export default routes;