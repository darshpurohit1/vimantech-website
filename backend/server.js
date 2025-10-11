const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Resend library ko import karo
const { Resend } = require('resend');

app.use(express.json());
app.use(cors({
    origin: 'https://vimantech.in.net'
}));

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Create a Resend client instead of a Nodemailer transporter
const resend = new Resend(process.env.RESEND_API_KEY);

// API endpoint to handle "Get a Quote" requests
app.post('/send-quote', (req, res) => {
    const { name, email, phone, message } = req.body;

    // Email 1: To the business (Quote details)
    const mailOptionsToMe = {
        from: 'customercare@vimantech.in.net',
        to: 'purohitdarsh64@gmail.com',
        subject: `New Quote Request from ${name}`,
        html: `
            <h1>New Quote Request Received!</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
    };

    // Email 2: To the customer (Confirmation for their quote)
    const mailOptionsToCustomer = {
        from: 'customercare@vimantech.in.net',
        to: email,
        subject: `Quote Confirmation from Vimantech`,
        html: `
            <h1>Hello ${name},</h1>
            <p>Thank you for your quote request! We will review your details and get back to you with a personalized quote.</p>
            <p>The Vimantech Team</p>
        `,
    };

    // Send both emails simultaneously using Resend API
    Promise.all([
        resend.emails.send(mailOptionsToMe),
        resend.emails.send(mailOptionsToCustomer)
    ])
    .then(() => {
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
        to: 'purohitdarsh64@gmail.com',
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
                content:fs.readFileSync(uploadedFile.path),
            }
        ],
    };
      

    // Email 2: To the customer (Confirmation)
    const mailOptionsToCustomer = {
        from: 'customercare@vimantech.in.net',
        to: email,
        subject: `Order Confirmation from Vimantech`,
        html: `
            <h1>Hello ${name},</h1>
            <p>Your order has been received! We will contact you shortly to confirm and process your request.</p>
            <p>Here are your order details:</p>
            <ul>
                <li><strong>Range:</strong> ${range} km</li>
                <li><strong>Motor:</strong> ${motor}</li>
                <li><strong>Estimated Cost:</strong> ${price}</li>
            </ul>
            <p>Thank you, </p>
            <p>The Vimantech Team</p>
        `,
    };

    // Send both emails simultaneously using Resend API
    Promise.all([
        resend.emails.send(mailOptionsToMe),
        resend.emails.send(mailOptionsToCustomer)
    ])
    .then(() => {
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