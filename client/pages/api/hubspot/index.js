import { withApiAuthRequired} from '@auth0/nextjs-auth0'

const hubspot = require('@hubspot/api-client')
const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_KEY })

export default withApiAuthRequired( async function handler(req,res){
    const data = req.body;
    res.status(200).json(data)
    // Create properties for [brand, designer, builder, deliveryDate, model, quantity, serialNumbers]

    /* const contactObj = {
        properties: {
            firstname: data.customer.firstName,
            lastname: data.customer.lastName,
            phone: data.customer.phone,
            email: data.customer.email,

        },
    }
    const companyObj = {
        properties: {
            name: data.deal.dealer,
        },
    }
    const dealObject = {
        properties: {
            closeDate: data.deal.datePurchased,
            deliveryDate: data.deal.deliveryDate,
            brand:
        }
    }
    
    const createContactResponse = await hubspotClient.crm.contacts.basicApi.create(contactObj)
    const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create(companyObj)
    const createDealResponse = await hubspotClient.crm.deals.basicApi
    await hubspotClient.crm.companies.associationsApi.create(
        createCompanyResponse.id,
        'contacts',
        createContactResponse.id,
        'company_to_contact'
    ) */
});