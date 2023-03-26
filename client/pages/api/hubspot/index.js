import { withApiAuthRequired} from '@auth0/nextjs-auth0'
import axios from 'axios';
const hubspot = require('@hubspot/api-client')
const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_KEY })
const formidable = require('formidable')
const {Storage} = require('@google-cloud/storage');
const fs = require('fs')

export const config = {
    api: {
        bodyParser: false
    }
}

const storage = new Storage({keyFilename: 'service-key.json'});
const bucketName = 'blastoise-starfish';

// Helper Functions Start
async function uploadFileToGCS(file){
    const generationMatchPrecondition = 0
    const options = {
        destination: `${file.newFilename}_invoice`,
        preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
    }
    try {
        const resp = await storage.bucket(bucketName).upload(file.filepath, options);
        const filename = resp[0].name
            // These options will allow temporary read access to the file
        const URLoptions = {
            version: 'v2', // defaults to 'v2' if missing.
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60, // one hour
        };
        
            // Get a v2 signed URL for the file
        const [url] = await storage
            .bucket(bucketName)
            .file(filename)
            .getSignedUrl(URLoptions);        
        return url;
    } catch {
        console.error()
    }
   
}

async function uploadFileHubspot(filename,url){
    const ImportFromUrlInput = { 
        access: "PUBLIC_NOT_INDEXABLE", 
        ttl: "P12M", 
        name: `${filename}_invoice.pdf`, 
        url: url, 
        folderPath: "docs", 
        duplicateValidationStrategy: "NONE", 
        duplicateValidationScope: "ENTIRE_PORTAL",
        type:'pdf', 
        overwrite: true };

    try {
      const apiResponse = await hubspotClient.files.filesApi.importFromUrl(ImportFromUrlInput);
      return apiResponse;
    } catch (e) {
      e.message === 'HTTP request failed'
        ? console.error(JSON.stringify(e.response, null, 2))
        : console.error(e)
    }
}

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

async function createAssociation(userId,companyId) {
    try {
        const createdAssociation = await hubspotClient.crm.companies.associationsApi.create(companyId, 'contacts', userId, [{"associationCategory":"HUBSPOT_DEFINED", "associationTypeId":2}])
        return createdAssociation
    }
    catch (err) {
        console.error(err)
    }
}

function createContactObj(data) {
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
    return contactObj;
}

function createCompanyObj(data) {
    const companyObj = {
        properties: {
            name: data.deal.dealer,
            salesperson: data.deal.salesperson
        },
    }
    return companyObj
}
//Helper Functions End 

// Main Function
export default withApiAuthRequired( async function handler (req,res){
      
    try {
        const form = formidable();
        form.parse(req,async (err,fields,files) => {
            const data = JSON.parse(fields.data)
            const file = files.file
            const uploaded = await uploadFileToGCS(file)
            const invoice = await uploadFileHubspot(file.newFilename,uploaded)
            const contact = createContactObj(data);
            const company = createCompanyObj(data);
            const foundContact = await findContact(contact.properties.email)
            const foundCompany = await findCompany(company)
            const invoiceID = invoice?.id;
            if (!foundContact && !foundCompany) {
                const newContact = await hubspotClient.crm.contacts.basicApi.create(contact);
                const newCompany = await hubspotClient.crm.companies.basicApi.create(company);
                const contactId = JSON.parse(newContact.id);
                if (newContact && newCompany) {
                    await createAssociation(newContact.id, newCompany.id)
                }
                if (invoice) {
                    console.log(invoice)
                    const noteProperties = {
                        "properties":{
                            "hubspot_owner_id":"283191206",
                            "hs_timestamp": Date.now(),
                            "hs_note_body":"",
                            "hs_attachment_ids":invoice?.id
                        },
                        "associations":{
                            "to":[{"id":contactId}],
                            "types": [{"associationCategory":"HUBSPOT_DEFINED","associationTypeId":10}],
                        },
                        "attachments": [
                            {
                                "id": invoiceID
                            }
                        ]
                    }
                    const note = await hubspotClient.crm.objects.notes.basicApi.create(noteProperties)
                    if (note) {
                            console.log(note)
                            res.status(200).json({
                                message:"Success"
                            }) 
                    } else {
                        res.status(400).json({
                            message:"Problem uploading invoice. Error code: 01"
                        })
                    }

                } else {
                    res.status(400).json({
                        message:"Problem uploading invoice. Error code: 01A"
                    })
                }
            }

           else if (!foundContact && foundCompany) {
                const newContact = await hubspotClient.crm.contacts.basicApi.create(contact);
                const contactId = JSON.parse(newContact.id);
                if (newContact) {
                    await createAssociation(contactId, foundCompany.id)
                }
                if (invoice) {
                    console.log(invoice)
                    const noteProperties = {
                        "properties":{
                            "hubspot_owner_id":"283191206",
                            "hs_timestamp": Date.now(),
                            "hs_note_body":"",
                            "hs_attachment_ids":invoice?.id

                        },
                        "associations":{
                            "to":[{"id":contactId}],
                            "types": [{"associationCategory":"HUBSPOT_DEFINED","associationTypeId":10}]
                        },
                        "attachments": [
                            {
                                "id": invoiceID
                            }
                        ]
                    }
                    const note = await hubspotClient.crm.objects.notes.basicApi.create(noteProperties)
                    if (note) {
                        console.log(note)
                        res.status(200).json({
                            message:"Success"
                        })
                    } else {
                        res.status(503).json({
                            message:"Problem uploading invoice. Error code: 02"
                        })
                    }

                } else {
                    res.status(400).json({
                        message:"Problem uploading invoice. Error code: 02A"
                    })
                }

            }

            else if (foundContact && foundCompany) {
                const contactId = JSON.parse(foundContact.id);
                if (invoice) {
                    const noteProperties = {
                        "properties":{
                            "hubspot_owner_id":"283191206",
                            "hs_timestamp": Date.now(),
                            "hs_note_body":"",
                            "hs_attachment_ids":invoice?.id

                        },
                        "associations":{
                            "to":[{"id":contactId}],
                            "types": [{"associationCategory":"HUBSPOT_DEFINED","associationTypeId":10}]                        
                        },
                        "attachments": [
                            {
                                "id": invoiceID
                            }
                        ]
                    }
                    const note = await hubspotClient.crm.objects.notes.basicApi.create(noteProperties)
                    if (note) {
                        console.log(note)
                        res.status(200).json({
                            message:"Success"
                        })
                    } else {
                        res.status(503).json({
                            message:"Problem uploading invoice. Error code: 03"
                        })
                    }

                } else {
                    res.status(400).json({
                        message:"Problem uploading invoice. Error code: 03A"
                    })
                }
            }

            if (err) {
                console.log(err);
                res.status(400).json({message:'Bad Request'})
            }
            if (!fields && !files) {
                res.status(400).json({message:'No empty requests'})
            }
        })
      
        } catch (err) {
        err.message === 'HTTP request failed'
            ? res.status(400).json(err.message)
            : console.error(err)
        }
});
// End Main Function
