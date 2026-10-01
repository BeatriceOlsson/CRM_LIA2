import express from 'express'
import { verifyToken } from '../middleware/jwt.middelware.js';
import { getAllSales, saveASales } from '../service/salesDataHandeler.js';

const routes = express.Router();

routes.get('/sales', verifyToken, async (req,res) => {

    try {
        const dataSales = await getAllSales();

        return res.status(200).json(dataSales);
    } catch (error) {
        return res.status(400).json({ message: 'Kunde inte hämta alal försälningar: ', error});
    }
})

routes.post('/registerSales', verifyToken, async (req, res) => {
    let {salesValue, salesStatus, companyID, contactPersonID, userID} = req.body;

    salesValue = salesValue ? Number(salesValue) : null;
    companyID = companyID ? Number(companyID) : null;
    contactPersonID = contactPersonID ? Number(contactPersonID) : null;
    userID = userID ? Number(userID) : null;

if (!companyID || !contactPersonID || !userID) {
    return res.status(400).json({ message: 'Saknas data för att kunna registrera försäljningen.'})
}
    try {
        const saveSale = await saveASales(salesValue, salesStatus, companyID, contactPersonID, userID);

        return res.status(200).json({message: 'Försäljningen har sparats.', saveSale})
    } catch (error) {
        return res.status(400).json({message: 'Fel uppstog vid skaparand av försäljning: ', error})
    }
})

export default routes;