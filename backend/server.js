const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

const { Resend } = require('resend');

app.use(express.json());
app.use(cors({
    origin: 'https://vimantech.in.net'
}));

const upload = multer({ dest: 'uploads/' });
const resend = new Resend(process.env.RESEND_API_KEY);

function deleteFile(filePath) {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error('File delete error:', err);
        });
    }
}

app.post('/send-quote', (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: "All fields are required.", status: "error" });
    }

    const mailToMe = {
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

    const mailToCustomer = {
        from: 'customercare@vimantech.in.net',
        to: email,
        subject: `Quote Confirmation from Vimantech`,
        html: `
            <h1>Hello ${name},</h1>
            <p>Thank you for your quote request! We will review your details and get back to you shortly.</p>
            <p>The Vimantech Team</p>
        `,
    };

    Promise.all([
        resend.emails.send(mailToMe),
        resend.emails.send(mailToCustomer)
    ])
    .then(([result1, result2]) => {
        if (result1.error || result2.error) {
            console.error('Resend error:', result1.error || result2.error);
            return res.status(500).json({ message: "Email sending failed.", status: "error" });
        }
        res.status(200).json({ message: "Quote request sent successfully.", status: "success" });
    })
    .catch(error => {
        console.error('Quote email error:', error);
        res.status(500).json({ message: "An error occurred.", status: "error" });
    });
});

app.post('/send-email', upload.single('image'), (req, res) => {
    const { name, email, range, motor, price } = req.body;
    const uploadedFile = req.file;

    if (!name || !email || !range || !motor || !price) {
        deleteFile(uploadedFile?.path);
        return res.status(400).json({ message: "All fields are required.", status: "error" });
    }

    const fileBuffer = fs.readFileSync(uploadedFile.path);
    const base64Content = fileBuffer.toString('base64');

    const mailToMe = {
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
                content: base64Content,
            }
        ],
    };

    const mailToCustomer = {
        from: 'customercare@vimantech.in.net',
        to: email,
        subject: `Order Confirmation from Vimantech`,
        html: `
            <h1>Hello ${name},</h1>
            <p>Your order has been received! We will contact you shortly.</p>
            <ul>
                <li><strong>Range:</strong> ${range} km</li>
                <li><strong>Motor:</strong> ${motor}</li>
                <li><strong>Estimated Cost:</strong> ${price}</li>
            </ul>
            <p>Thank you,<br/>The Vimantech Team</p>
        `,
    };

    Promise.all([
        resend.emails.send(mailToMe),
        resend.emails.send(mailToCustomer)
    ])
    .then(([result1, result2]) => {
        deleteFile(uploadedFile.path);

        if (result1.error || result2.error) {
            console.error('Resend error:', result1.error || result2.error);
            return res.status(500).json({ message: "Email sending failed.", status: "error" });
        }

        res.status(200).json({ message: "Both emails sent successfully.", status: "success" });
    })
    .catch(error => {
        deleteFile(uploadedFile?.path);
        console.error('Order email error:', error);
        res.status(500).json({ message: "An error occurred.", status: "error" });
    });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});