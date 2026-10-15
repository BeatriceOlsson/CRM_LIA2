import express, { response } from 'express';
import { verifyToken } from '../middleware/jwt.middelware.js';
import { filterCompanies, filterPersons, filterSales } from '../service/filterDataHandeler.js';

const routes = express.Router();

function numberFilter(data ,calculation, smallestNumber, highestNumber, filterType) {

        if(filterType && calculation) {
        data = data.filter((item) => {
            let filter = Number(item[filterType]);

            switch (calculation) {
                case "greaterThen" :
                    return filter >= smallestNumber;
                case "smallerThen":
                    return filter <= smallestNumber;
                case "between":
                    if(smallestNumber !== null && highestNumber !== null) {
                        return filter >= smallestNumber && filter <= highestNumber;
                    }
                default:
                    return true;
            }
            })
         }

         return data;
}

routes.post('/filterSales', verifyToken, async (req, res) => {
 let {salesStatus, companyID, contactPersonID, userID, calculation, smallestNumber, highestNumber, filterType} = req.body;

 const status1 = Array.isArray(salesStatus) && salesStatus[0] ? salesStatus[0] : null;
 const status2 = Array.isArray(salesStatus) && salesStatus[1] ? salesStatus[1] : null;
 companyID = companyID ? Number(companyID) : null;
 contactPersonID = contactPersonID ? Number(contactPersonID) : null;
 userID = userID ? Number(userID) : null;

 try {
     let filterdData = await filterSales (status1, status2, companyID, contactPersonID, userID);

    if(filterType && smallestNumber) {
        filterdData = numberFilter( filterdData ,calculation, smallestNumber, highestNumber, filterType);
    }

    const cleanData = filterdData.map( item => ({
        ...item, CPFirstName: item.CPFirstName ?? "",
        CPLastName: item.CPLastName ?? "",
        salesFirstName: item.salesFirstName ?? "",
        salesLastName: item.salesLastName ?? ""
    }))

     return res.status(200).json(cleanData);
 } catch (error) {
    return res.status(400).json({status:"failed", message: 'Kunde inte hämta filtrerad data.'});
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
        return res.status(400).json({status:"failed", message: 'Fell uppstig vid hämtning av filtrerad personer.'});
    }
})

routes.post('/filterCompany', verifyToken, async (req, res) => {
    let {companyID, calculation, smallestNumber, highestNumber, filterType} = req.body;

    companyID = companyID ? Number(companyID) : null;

    try {
        let filterdData = await filterCompanies(companyID);
        
        if(filterType && smallestNumber) {
            filterdData = numberFilter(filterdData, calculation, smallestNumber, highestNumber, filterType)
        }

        return res.status(200).json(filterdData);
    } catch (error) {
        return res.status(400).json({status:"failed", message: 'Fell uppstig vid hämtning av filtrerad företag.'})
    }
})

export default routes;