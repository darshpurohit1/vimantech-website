const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors= require('cors');
const app = express();
const port = process.env.PORT || 3000
app.use(express.json());
app.use(cors());

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create a Nodemailer transporter using Postmark's SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.postmarkapp.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.AUTH_USER,
        pass: process.env.AUTH_PASS
    }
});
    // API endpoint to handle "Get a Quote" requests
app.post('/send-quote', (req, res) => {
    const { name, email, phone, message } = req.body;

    // Email 1: To the business (Quote details)
    const mailOptionsToMe = {
        from: 'customercare@vimantech.in.net',
        to: 'customercare@vimantech.in.net',
        subject: `New Quote Request from ${name}`,
        html: `
            <h1>New Quote Request Received!</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Needs:</strong> ${message}</p>
        `
    };

    // Email 2: To the customer (Confirmation for their quote)
    const mailOptionsToCustomer = {
        from: 'customercare@vimantech.in.net',
        to: email,
        subject: `Quote Confirmation from Vimantech`,
        html: `
            <h1>Hello ${name},</h1>
            <p>Thank you for your quote request! We will review your details and get back to you with a personalized quote shortly.</p>
            <p>Thank you,</p>
            <p>The Vimantech Team</p>
        `
    };

    // Send both emails simultaneously
    Promise.all([
        transporter.sendMail(mailOptionsToMe),
        transporter.sendMail(mailOptionsToCustomer)
    ])
    .then(results => {
        res.status(200).json({ message: "Quote request sent successfully.", status: "success" });
    })
    .catch(error => {
        console.error('Email sending error:', error);
        res.status(500).json({ message: "An error occurred while sending the quote request.", status: "error" });
    });
});

// API endpoint to handle email sending with file upload
app.post('/send-email', upload.single('image'), (req, res) => {
    const { name, email, range, motor, price } = req.body;
    const uploadedFile = req.file;

    // Email 1: To the business (Order details and image)
    const mailOptionsToMe = {
        from: 'customercare@vimantech.in.net',
        to: 'customercare@vimantech.in.net', // The business email to receive the order
        subject: `New Order: ${name}`,
        html: `
            <h1>New Custom Order Received!</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Range:</strong> ${range} km</p>
            <p><strong>Motor:</strong> ${motor}</p>
            <p><strong>Estimated Cost:</strong> ${price}</p>
        `,
        attachments: [
            {
                filename: uploadedFile.originalname,
                path: uploadedFile.path
            }
        ]
    };

    // Email 2: To the customer (Confirmation)
    const mailOptionsToCustomer = {
        from: 'customercare@vimantech.in.net',
        to: email, // The customer's email from the form
        subject: `Order Confirmation from Vimantech`,
        html: `
            <h1>Hello ${name},</h1>
            <p>Your order has been received! We will contact you shortly.</p>
            <p>Here are your order details:</p>
            <ul>
                <li><strong>Range:</strong> ${range} km</li>
                <li><strong>Motor:</strong> ${motor}</li>
                <li><strong>Estimated Cost:</strong> ${price}</li>
            </ul>
            <p>Thank you,</p>
            <p>The Vimantech Team</p>
        `
    };

    // Send both emails simultaneously
    Promise.all([
        transporter.sendMail(mailOptionsToMe),
        transporter.sendMail(mailOptionsToCustomer)
    ])
    .then(results => {
        res.status(200).json({ message: "Both emails sent successfully.", status: "success" });
    })
    .catch(error => {
        console.error('Email sending error:', error);
        res.status(500).json({ message: "An error occurred while sending the email.", status: "error" });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});