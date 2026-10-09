import express from 'express'
import { verifyToken } from '../middleware/jwt.middelware.js';
import { deleteSales, getAllSales, salesOnID, saveASales, saveOverSales } from '../service/salesDataHandeler.js';

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
    let {salesValue, title, salesStatus, companyID, contactPersonID, userID, purcheseValue} = req.body;

    salesValue = salesValue ? Number(salesValue) : null;
    purcheseValue = purcheseValue ? Number(purcheseValue) : null;
    companyID = companyID ? Number(companyID) : null;
    contactPersonID = contactPersonID ? Number(contactPersonID) : null;
    userID = userID ? Number(userID) : null;

if (!companyID || !contactPersonID || !userID) {
    return res.status(400).json({ message: 'Saknas data för att kunna registrera försäljningen.'})
}
    try {
        const saveSale = await saveASales(salesValue, title, salesStatus, companyID, contactPersonID, userID, purcheseValue);

        return res.status(200).json({message: 'Försäljningen har sparats.', saveSale})
    } catch (error) {
        return res.status(400).json({message: 'Fel uppstog vid skaparand av försäljning: ', error})
    }
})

routes.post('/salesID', verifyToken, async ( req, res ) => {
    const {id} = req.body;

    const salesID = id ? Number(id) : null;

    try {
        const salesIDData = await salesOnID(salesID);

        return res.status(200).json(salesIDData);
    } catch (error) {
        return res.status(400).json('Fel upstog vid hämtning av data kopplat till id: ', error);
    }
})

routes.put('/update', verifyToken, async ( req, res ) => {
    let { salesID ,salesValue, title, salesStatus, companyID, contactPersonID, userID, purcheseValue } = req.body;

    if(!salesID) {
        return res.status(500).json({ message: 'Måste finnas en Försäljning att uppdatera'})
    }

    salesValue = salesValue ? Number(salesValue) : null;
    title = title ? title : null;
    salesStatus = salesStatus ? salesStatus : null;
    purcheseValue = purcheseValue ? Number(purcheseValue) : null;
    companyID = companyID ? Number(companyID) : null;
    contactPersonID = contactPersonID ? Number(contactPersonID) : null;
    userID = userID ? Number(userID) : null;

    try {
        await saveOverSales(salesID, salesValue, title, salesStatus, companyID, contactPersonID, userID, purcheseValue);

        res.status(200).json({message: 'Ändringen uppdaetrades.'});
    } catch (error) {
        res.status(400).json({ message: 'Fell upstog när uppdatering av försäljnings gjordes.'})
    }
})

routes.post('/delete', verifyToken, async (req, res) => {
    const { salesID } = req.body;

    if(!salesID) return res.status(400).json({ message: 'Behöver ha vald försäljning för att kunna radera data.' })
    const exists = await salesOnID(salesID);

    if(!exists || exists.length === 0) {
        return res.status(400).json({ message: 'Försäljningen fins inte i systemet.'})
    }

    try {
        await deleteSales(salesID);

        return res.status(200).json({ message: 'Radering av försäljning är utförd.'})
    } catch (error) {
        return res.status(500).json({ message: 'Fel uppstog och försäljning kunde inte tas bort.'})
    }
})

export default routes;