import express from 'express';
import { allUserNames, deliteUser, getUsersID, saveSalesUser, userIDData } from '../service/usersDataHandeler.js';
import { verifyToken } from '../middleware/jwt.middelware.js';

const routes = express.Router();

routes.post('/createUsers', async (req, res) => {
    const { contactPersonID } = req.body;

    if(!contactPersonID){
        return res.status(400).json({ message: 'Behöver ha användar info för att gå vidare.'})
    }

    try {
        const userExist = await getUsersID(contactPersonID);

        if(userExist.length > 0) {
            return res.status(400).json({ message: 'Användare fins redan registrerat.'});
        }

        await saveSalesUser(contactPersonID);

        return res.status(200).json({ message: 'Användare sparad.'})
    } catch (error) {
        return res.status(500).json({ message:'Gick inte att spara användare'});
    }
})

routes.get('/userPersonList', async (req,res) => {
    const allUsers = await allUserNames();

    return res.status(200).json(allUsers);
})

routes.post('/delete', verifyToken, async ( req, res ) => {
    const { userID } = req.body;

    if(!userID) return res.status(500).json({ message: 'Behöver ha vald användare för att kunna radera data.'})

    const userExist = await userIDData(userID);

    if(!userExist || userExist.length === 0) {
        return res.status(400).json({ message: 'Användare fins inte i systemet.'});
    }

    try {
        await deliteUser(userID);

        return res.status(200).json({ message: 'Radering av användare är utförd.'})
    } catch (error) {
        return res.status(400).json({ message: 'Fel uppstog och användare kunde inte tas bort.'})
    }
})

export default routes;