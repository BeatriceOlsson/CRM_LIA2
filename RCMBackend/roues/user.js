import express from 'express'
import bcrypt from 'bcrypt'
import { fetchUserEmail, savingNewPerson, fetchUserInformation } from '../service/userLoginHandeler.js';
import logger from '../middleware/logger.middelware.js';
import { clearToken, createToken, verifyToken } from '../middleware/jwt.middelware.js';
import { companyIdDB, companyNameDB } from '../service/companyDatahandeler.js';

const routes = express.Router();

routes.post('/login', async (req, res) => {
    if(!req.body) {
        return res.status(400).json({message: 'Användar info saknas.'});
    }

    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: 'Email och lösenord krävs.'});
    }
console.log('1', email, password);
    try {
        const userInformation = await fetchUserInformation(email.trim());
        const DBpassword = userInformation[0]?.password;
console.log('2', userInformation);
        const isMatch = await bcrypt.compare(password, DBpassword);
console.log('2.5');
        if(!isMatch) {
            return res.status(401).json({message: 'Fel email eller lösenord.'});
        }
console.log('3');
        const {firstName, lastName, companyID} = userInformation[0];

        const companyResult = await companyNameDB(companyID);
        const companyName = companyResult[0]?.companyName;
console.log('4');
        createToken(firstName, lastName, email, companyName, res);
console.log('5');
        return res.status(200).json({
            message: 'Inloggning lyckades.',
            user: { firstName, lastName, company: companyName }
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
        if(companyIDArray.length < 0) {
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

export default routes;