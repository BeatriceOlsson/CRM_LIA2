import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;

function createToken( firstName, lastName, email, companyName, contactPersonID, userID,res) {
    const payload = {
        firstName: firstName, 
        lastName: lastName,
        email: email,
        company: companyName,
        contactPersonID: contactPersonID,
        userID: userID
    }

    const token = jwt.sign(payload, secretKey, { expiresIn: '5h'});

    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })
}

function verifyToken(req, res, next) {
    const token = req.cookies?.auth_token;
    if (!token) {
        return res.status(401).json({ message: 'Ej längre tilgång.'})
    }

    try {
        const verify = jwt.verify(token, secretKey);

        req.user = verify;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Ogiltig token' });
    }
}

function clearToken( req, res ) {
    res.clearCookie('auth_token', {
         httpOnly: true,
        secure: false,
        sameSite: 'lax'
    })
    return res.status(200).json({ message: 'Användare har joggast ut.'});
}

export {createToken, verifyToken, clearToken};