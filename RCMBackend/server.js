import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './roues/user.js';
import companyRouter from './roues/company.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }),
);

app.use(cookieParser());
//console.log('Anrop i server');
app.use('/user', userRouter);
app.use('/company', companyRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Serven körs på port: ', port);
})