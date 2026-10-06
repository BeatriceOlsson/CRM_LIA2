import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import contactPersonRouter from './roues/contactPerson.js';
import companyRouter from './roues/company.js';
import salesRouter from './roues/sales.js';
import usersRouter from './roues/users.js';
import filterRouter from './roues/filter.js';

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
app.use('/contactPerson', contactPersonRouter);
app.use('/company', companyRouter);
app.use('/sales', salesRouter);
app.use('/users', usersRouter);
app.use('/filter', filterRouter)


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Serven körs på port: ', port);
})