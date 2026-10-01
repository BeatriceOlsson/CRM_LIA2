import express from 'express';
import { allUserNames, getUsersID, saveSalesUser } from '../service/usersDataHandeler.js';

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

export default routes;