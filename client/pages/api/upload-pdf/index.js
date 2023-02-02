const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
import formidable from 'formidable';
import nextConnect from 'next-connect';
import fs from 'fs/promises'
import path from 'path';
import multer from 'multer'

export const config = {
    api: {
        bodyParser: false,
    }
};

const form = formidable({ multiples: true }); // uploaded files will be an array

export default async function handler (req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err,fields,files) => {
        console.log(files.file.filepath);
        const credentials = PDFServicesSdk.Credentials
            .serviceAccountCredentialsBuilder()
            .withAccountId(process.env.ADOBE_ACCT_ID)
            .withClientId(process.env.ADOBE_CLIENT_ID)
            .withClientSecret(process.env.ADOBE_CLIENT_SECRET)
            .withOrganizationId(process.env.ADOBE_ORG_ID)
            .withPrivateKey(process.env.ADOBE_PRIVATE_KEY)
            .build();
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
        const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
        .addElementsToExtract(
            PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT,
            PDFServicesSdk.ExtractPDF.options.ExtractElementType.TABLES)
        .build();

        const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew();
        const input = PDFServicesSdk.FileRef.createFromLocalFile(
            files.file.filepath,
            PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
            // file.data,'pdf'
        );
        // Set operation input from a source file.
        extractPDFOperation.setInput(input);

        // Set options
        extractPDFOperation.setOptions(options);

        extractPDFOperation.execute(executionContext)
            .then(result => res.json(result))
            .catch(err => {
                if(err instanceof PDFServicesSdk.Error.ServiceApiError
                    || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                    console.log('Exception encountered while executing operation', err);
                    return res.status(501).json(err);
                } else {
                    console.log('Exception encountered while executing operation', err);
                    return res.status(503).json(err);

                }
            });
    })
}






       /* const credentials = PDFServicesSdk.Credentials
            .serviceAccountCredentialsBuilder()
            .withAccountId(process.env.ADOBE_ACCT_ID)
            .withClientId(process.env.ADOBE_CLIENT_ID)
            .withClientSecret(process.env.ADOBE_CLIENT_SECRET)
            .withOrganizationId(process.env.ADOBE_ORG_ID)
            .withPrivateKey(process.env.ADOBE_PRIVATE_KEY)
            .build();
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
        const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
        .addElementsToExtract(
            PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT,
            PDFServicesSdk.ExtractPDF.options.ExtractElementType.TABLES)
        .build();

        const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew();
        const input = PDFServicesSdk.FileRef.createFromStream(
            file.data,
            PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
            // file.data,'pdf'
        );
        // Set operation input from a source file.
        extractPDFOperation.setInput(input);

        // Set options
        extractPDFOperation.setOptions(options);

        extractPDFOperation.execute(executionContext)
            .then(result => res.json(result))
            .catch(err => {
                if(err instanceof PDFServicesSdk.Error.ServiceApiError
                    || err instanceof PDFServicesSdk.Error.ServiceUsageError) {
                    console.log('Exception encountered while executing operation', err);
                    return res.serverError(err);
                } else {
                    console.log('Exception encountered while executing operation', err);
                    return res.serverError(err);

                }
            }); */

