import { withApiAuthRequired } from '@auth0/nextjs-auth0';
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');

export default withApiAuthRequired(function handler(req, res) {
    const file = req.file;
        if (file) {
            console.log('uploaded');
        }
        if (file.length === 0) {
            return res.badRequest('No file was uploaded');
        }

        const credentials = PDFServicesSdk.Credentials
            .serviceAccountCredentialsBuilder()
            .fromFile('pdfservices-api-credentials.json')
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
            });
    })