import express, { response } from 'express'
import bcrypt from 'bcrypt'
import { fetchUserEmail, savingNewPerson, fetchUserInformation, getAllUsers, contactOnID, saveOverContact, deletePerson } from '../service/contactPersonDataHandeler.js';
import logger from '../middleware/logger.middelware.js';
import { clearToken, createToken, verifyToken } from '../middleware/jwt.middelware.js';
import { companyIdDB, companyNameDB } from '../service/companyDatahandeler.js';
import { getUsersID } from '../service/usersDataHandeler.js';

const routes = express.Router();

routes.get('/contactPerson', verifyToken, async (req, res) => {

    try {
        const response = await getAllUsers(); 

        return res.status(200).json(response);
    } catch (error) {
        return res.status(400).json({ message: "Kunde inte hämta personer", error});
    }
})

routes.post('/login', async (req, res) => {
    if(!req.body) {
        return res.status(400).json({message: 'Användar info saknas.'});
    }

    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Email och lösenord krävs.'});
    }

    try {
        const userInformation = await fetchUserInformation(email.trim());
        const DBpassword = userInformation[0]?.password;

        const isMatch = await bcrypt.compare(password, DBpassword);

        if(!isMatch) {
            return res.status(400).json({message: 'Fel email eller lösenord.'});
        }

        const {firstName, lastName, companyID, contactPersonID, userID} = userInformation[0];

        const companyResult = await companyNameDB(companyID);
        const companyName = companyResult[0]?.companyName;

        createToken(firstName, lastName, email, companyName, contactPersonID, userID, res);

        return res.status(200).json({
            message: 'Inloggning lyckades.',
            user: { firstName, lastName, company: companyName, contactPersonID, userID }
        });
    } catch (error) {
        logger.error('Fel vid inlog: ', error);
        res.status(500).json({message: 'Fel uppstog vin inlogning: ', error})
    }
})

routes.post('/register', verifyToken, async (req, res) => {

    if(!req.body) {
        return res.status(400).json({message: 'Användar info saknas.'});
    }

    const {firstName, lastName, email, password, companyName} = req.body

    let mailCheck =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!mailCheck.test(email)) {
        return res.status(400).json({message: 'Mailen godkändes inte.'})
    }

    try {
        const emailExist = await fetchUserEmail(email);

        if(emailExist.length > 0) {
            return res.status(400).json({message: 'Angiven email existerar redan i systemet, email behöver vara unikt.'});
        }

        const companyIDArray = await companyIdDB(companyName);
        if(companyIDArray.length === 0) {
            return res.status(400).json({message: 'Företaget fins innte i systemet.'})
        }
        const companyId = companyIDArray[0]?.companyID;

        await savingNewPerson(firstName, lastName, email, password, companyId);

        res.status(200).json({message: 'Anvndare har sparats.'});
    } catch (error) {
        res.status(500).json({message: 'Kunde inte spara användare.'});

    }
})

routes.get('/validate', verifyToken, async (req, res) => {
    res.json({ authenticated: true, user: req.user})
})

routes.post('/logOut', async (req, res) => {
    return clearToken(res, res);
})

routes.post('/contactOnID', verifyToken, async (req, res) => {
    const { id } = req.body;

    const contactPersonID = id ? Number(id) : null;

    try {
        const contacIdData = await contactOnID(contactPersonID);

        res.status(200).json(contacIdData);
    } catch (error) {
        res.status(400).json({ message: 'Fel upstog vid hämtning av användare.'})
    }
})

routes.put('/update', verifyToken, async (req, res) => {
    let {firstName, lastName, email, companyID, contactPersonID} = req.body;

    if(!contactPersonID) {
        return res.status(500).json({ message: 'Måste finnas en användare att uppdatera.'})
    }

    contactPersonID = contactPersonID ? Number(contactPersonID) : null;
    firstName = firstName ? firstName : null;
    lastName = lastName ? lastName : null;
    email = email ? email: null;
    companyID = companyID ? Number(companyID) : null;

    try {
        const save = await saveOverContact(firstName, lastName, email, companyID, contactPersonID);

        res.status(200).json({ message: 'Ändringan updaterades.'})
    } catch (error) {
        res.status(400).json({ message: 'Fel uppstog vid uppdatering av person.'})
    }
})

routes.post('/delete', verifyToken, async (req, res) => {
    const { contactPersonID } = req.body;
console.log('1');
    if(!contactPersonID) return res.status(400).json({ message: 'Behöver ha vald användare för att kunna radera data.'})
    
    const personExist = await contactOnID(contactPersonID);
console.log(personExist);
    if(!personExist || personExist === 0) {
        return res.status(400).json({ message: 'Användare fins inte i systemet.'})
    }
console.log('2');
    const user = await getUsersID(contactPersonID);
    const userID = user && user.length > 0 ? user[0].userID : null;
console.log(userID);
    try {
        await deletePerson(contactPersonID, userID);

        res.status(200).json({ message: 'Radering av användare är utförd.'})
    } catch (error) {
        return res.status(500).json({ message: 'Fel uppstog och användare kunde inte tas bort.'})
    }
})

export default routes;