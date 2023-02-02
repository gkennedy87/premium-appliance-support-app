import { withApiAuthRequired} from '@auth0/nextjs-auth0'
import e from 'express';

const hubspot = require('@hubspot/api-client')
const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_KEY })
async function findContact(target){
        const limit = 100;
        const after = undefined;
        const properties = undefined;
        const propertiesWithHistory = undefined;
        const associations = undefined;
        const archived = false;
        const users = await hubspotClient.crm.contacts.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived)
        if (users) {
            const userArr = users.results.map(i => i.properties)
            const foundUser = userArr.filter(u => u.email === target)
            if (foundUser) {
                return foundUser[0];
            } else {
                return null;
            }
        } else {
            return null;
        }
}
async function findCompany(com) {
    const limit = 100;
    const after = undefined;
    const properties = undefined;
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;
    const companies = await hubspotClient.crm.contacts.basicApi.getPage(limit,after,properties,propertiesWithHistory,associations,archived)
    if (companies) {
        const companyArr = companies.results.map(i => i.properties)
            const foundCompany = companyArr.filter(u => u.name === com)
            if (foundCompany) {
                return foundCompany[0];
            } else {
                return null;
            }
    } else {
        return null;
    }
}

async function createAssociation(userId,companyId, dealId) {
   
    /* dealObj.associations = [
        {
            "to": {
               "id": parseInt(companyId)
             },
             "types": [
               {
                 "associationCategory": "HUBSPOT_DEFINED",
                 "associationTypeId": 5
               } ]
           }, 
           {
            "to": {
               "id": parseInt(userId)
             },
             "types": [
               {
                 "associationCategory": "HUBSPOT_DEFINED",
                 "associationTypeId": 3
               } ]
       }
    ] */

    const company = "company";
    const CompAssociationSpec = [
    {
        "associationCategory": "HUBSPOT_DEFINED",
        "associationTypeId": 5
    }
    ];
    const user = "user"
    const UserAssociationSpec = [
        {
            "associationCategory": "HUBSPOT_DEFINED",
            "associationTypeId": 3
        }
        ];
    const companyAssociationRes = await hubspotClient.crm.deals.associationsApi.create(dealId, "company", companyId, CompAssociationSpec);
    const contactAssociationRes = await hubspotClient.crm.deals.associationsApi.create(dealId, "user", userId, UserAssociationSpec);
    if (companyAssociationRes && contactAssociationRes) {
        return true
    } else {
        return false
    }
}

export default withApiAuthRequired( async function handler(req,res){
    if (!req.body) {
        res.status(400).json({
            message: 'No empty requests'
        })
    }
    const data = req.body;
    const contactObj = {
        properties: {
            firstname: data.customer.firstName,
            lastname: data.customer.lastName,
            phone: data.customer.phone,
            email: data.customer.email,
            address:data.customer.address,
            designer: data.deal.designer,
            builder: data.deal.builder,
        },
    }
    const companyObj = {
        properties: {
            name: data.deal.dealer,
            salesperson: data.deal.salesperson
        },
    }

    let dealObject = {
        properties: {
            "dealname": String(contactObj.properties.firstname+' '+contactObj.properties.lastname),
            "closedate":String(data.deal.datePurchased),
            "delivery_date": String(data.deal.deliveryDate),
            "brand": String(data.deal.brand),
            "model": String(data.deal.model),
            "quantity_purchased": String(data.deal.quantity),
            "dealstage": "closedwon",
            "pipeline":"default",
            "serial_numbers": String(data.deal.serialNumbers),
            "hubspot_owner_id": "283191206",
        },
    }
      
    try {
        const foundContact = await findContact(contactObj.properties.email)
        if (foundContact) {
            const contactId = foundContact.hs_object_id
            const foundCompany = await findCompany(companyObj);
            if (foundCompany) {
                const dealApi = await hubspotClient.crm.deals.basicApi.create(dealObject);
                if (dealApi) {
                    const associations = await createAssociation(foundContact.hs_object_id, foundCompany.hs_object_id,dealApi.id)
                        if (associations) {
                            res.status(200).json(
                                {
                                    message:'success', data:{dealApi, associations}
                                }
                            )
                        } else {
                            res.status(400).json({
                                message: 'No association created'
                            })
                        }
                } else {
                    res.status(400).json(
                        {
                            message: 'Bad request'
                        }
                    )
                }
            } else {
                const companyApi = await hubspotClient.crm.companies.basicApi.create(companyObj);
                if (companyApi) {
                   // const dealWithAssociations = await createAssociation(foundContact.hs_object_id, companyApi.id,dealObject)
                    const dealApi = await hubspotClient.crm.deals.basicApi.create(dealObject);
                    if (dealApi) {
                        const associations = await createAssociation(foundContact.hs_object_id, companyApi.id,dealApi.id)
                        if (associations) {
                            res.status(200).json(
                                {
                                    message:'success', data:{dealApi, associations}
                                }
                            )
                        } else {
                            res.status(400).json({
                                message: 'No association created'
                            })
                        }
                        
                    } else {
                        res.status(400).json({
                            message:'Bad request'
                        })
                    }
                } else {
                    res.status(400).json({
                        message:'bad request'
                    })
                }
            }
        } else {
            const contactApiResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj);
            if (contactApiResponse) {
                const companyApiResponse = await hubspotClient.crm.companies.basicApi.create(companyObj);
                if (companyApiResponse) {
                    const contactId = contactApiResponse.id
                    const companyId = companyApiResponse.id
                   // const dealWithAssociations = await createAssociation(contactId,companyId,dealObject)
                    console.log(dealWithAssociations)
                    const dealApi = await hubspotClient.crm.deals.basicApi.create(dealObject);
                    if (dealApi) {
                        const associations = await createAssociation(contactId, companyId,dealApi.id)
                        if (associations) {
                            res.status(200).json(
                                {
                                    message:'success', data:{dealApi, associations}
                                }
                            )
                        } else {
                            res.status(400).json({
                                message: 'No association created'
                            })
                        }
                    } else {
                        res.status(400).json(
                            {
                                message: 'Bad request'
                            }
                        )
                    }
                }
                else {
                    res.status(400).json({
                        message: 'Bad Request.'
                    })
                }
    
            } else {
                res.status(400).json({
                    message: "Bad Request"
                })
            }
        }
        } catch (err) {
        err.message === 'HTTP request failed'
            ? res.status(400).json(err.message)
            : console.error(err)
        }
});