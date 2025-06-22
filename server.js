//Import required modules
const express = require('express');
const server = express();
const hbs = require('hbs');
const multer = require('multer');

//Set view engine and views directory
server.set('view engine', 'hbs');
server.set('views', 'templates');

// Serve static files from the "static" directory and "uploads" directory
server.use(express.static(__dirname + '/static/'));
server.use('/uploads', express.static('uploads'));

//Configure multer for file uploads, storing files in the "uploads" directory
// const upload = multer({ dest: 'uploads' });
const upload = multer({ dest: 'static/uploads' });

//Define the directory for HTML templates
const html_dir = __dirname + '/templates/';

//Define the server port
const PORT = 3000;

//Start the server and listen on the defined port
server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

/**
 * Handle GET request for the homepage
 * Serves the "form.html" file
 */
server.get('/', (req, res) => {
    res.sendFile(html_dir + 'form.html');
});

/**
 * Handle POST request for form submission
 * Uses multer to handle single file upload
 */
server.post('/send', upload.single('uploadedImage'), (req, res) => {
    //Extract form fields from request body
    const {
        'sender-first-name': senderFirstName,
        'sender-last-name': senderLastName,
        'recipient-first-name': recipientFirstName,
        'recipient-last-name': recipientLastName,
        'recipient-message': recipientMessage,
        'notification-method': notificationMethod,
        'recipient-phone': recipientPhone,
        'recipient-email': recipientEmail,
        'credit-card-type': creditCardType,
        'recipient-card': cardNumber,
        'expiration-date': expirationDate,
        'card-ccv': cardCCV,
        'amount': paymentAmount,
        'terms-conditions': termsAndConditions
    } = req.body;

    // Define maximum allowed file size (200 KB)
    const maxFileSize = 200 * 1024;

    //Define an error message for banned users
    const bannedUser = { bannedUser: "This recipient has been blocked from receiving payments.<br>Please verify the recipient or try a different one." };

    //Initialize an array to store validation errors
    let errors = [];

    // Check if sender is banned
    if ((senderFirstName.toLowerCase() === "stuart" || senderFirstName.toLowerCase() === "stu") && senderLastName.toLowerCase() === "dent") {
        return res.render('error', { bannedUser });
    }

    //Check if recipient is banned
    if ((recipientFirstName.toLowerCase() === "stuart" || recipientFirstName.toLowerCase() === "stu") && recipientLastName.toLowerCase() === "dent") {
        return res.render('error', { bannedUser });
    }

    //Validate form fields (name, email, phone, payment details, etc.)
    if (!senderFirstName || !/^[A-Za-z' ]+$/.test(senderFirstName)) {
        errors.push({ errorSenderFirstName: "Invalid Sender First Name" });
    }
    if (!senderLastName || !/^[A-Za-z' ]+$/.test(senderLastName)) {
        errors.push({ errorSenderLastName: "Invalid Sender Last Name" });
    }
    if (!req.file) {
        errors.push({ noFile: "No File was Uploaded" });
    } else if (req.file.size > maxFileSize) {
        errors.push({ largeFile: "File Uploaded was Too Large" });
    }
    if (!recipientFirstName || !/^[A-Za-z' ]+$/.test(recipientFirstName)) {
        errors.push({ errorRecipientFirstName: "Invalid Recipient First Name" });
    }
    if (!recipientLastName || !/^[A-Za-z' ]+$/.test(recipientLastName)) {
        errors.push({ errorRecipientLastName: "Invalid Recipient Last Name" });
    }
    if (!recipientMessage || recipientMessage.length < 10) {
        errors.push({ errorRecipientMessage: "Invalid Recipient Message" });
    }
    if (notificationMethod === "Email" && (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail))) {
        errors.push({ errorRecipientEmail: "Invalid Recipient Email" });
    }
    if (notificationMethod === "SMS" && (!recipientPhone || !/^[0-9]+$/.test(recipientPhone) || recipientPhone.length !== 10)) {
        errors.push({ errorRecipientPhone: "Invalid Recipient Phone Number" });
    }
    if (!creditCardType) {
        errors.push({ errorCreditCardType: "Invalid Credit Card Type" });
    }
    if (!cardNumber || !/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardNumber)) {
        errors.push({ errorCreditCardNumber: "Invalid Credit Card Number" });
    }
    
    //Validate credit card expiration date
    if (expirationDate && /^\d{2}\/\d{4}$/.test(expirationDate)) {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const [inputMonth, inputYear] = expirationDate.split('/').map(Number);
        if (inputYear < currentYear || (inputYear === currentYear && inputMonth < currentMonth)) {
            errors.push({ expiredCard: "The Credit Card Entered Is Expired" });
        }
    } else {
        errors.push({ errorExpirationDate: "Invalid Credit Card Expiration Date" });
    }
    
    //Validate credit card CCV
    if (!cardCCV || !/^[0-9]+$/.test(cardCCV) || cardCCV.length > 4 || cardCCV.length < 3) {
        errors.push({ errorCCV: "Invalid Credit Card CCV" });
    }
    
    //Validate payment amount
    if (paymentAmount < 0.01) {
        errors.push({ errorPayment: "Invalid Payment Amount" });
    }
    
    //Ensure terms and conditions are accepted
    if (!termsAndConditions) {
        errors.push({ errorTermsAndConditions: "You Must Accept Our Terms and Conditions" });
    }

    //Handle errors or proceed with successful submission
    if (errors.length === 0) {
        const imagePath = `/uploads/${req.file.filename}`;
        let lastFourDigits = cardNumber.slice(-4);
        return res.render('success', {
            senderFirstName,
            senderLastName,
            recipientFirstName,
            recipientLastName,
            recipientMessage,
            notificationMethod,
            recipientPhone,
            recipientEmail,
            creditCardType,
            lastFourDigits,
            expirationDate,
            cardCCV,
            paymentAmount,
            termsAndConditions,
            imagePath
        });
    } else {
        return res.render('error', { errors });
    }
});
