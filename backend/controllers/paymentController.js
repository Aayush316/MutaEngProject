const Razorpay = require("razorpay");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

let useremail="";

// Set up email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Razorpay order creation
exports.checkout = async (req, res) => {
    try {
        const { amount, userEmail } = req.body;
        useremail=userEmail

        const options = {
            amount, // Amount from frontend (in paise)
            currency: "INR",
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Payment verification and sending invoice
exports.paymentVerification = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userEmail = useremail; // Ensure req.user is set by middleware
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Send success email
            const invoiceDetails = {
                to: userEmail,
                subject: "Payment Success Invoice",
                text: `Dear customer,\n\nThank you for your payment of ₹${req.body.amount / 100}. Your payment ID is ${razorpay_payment_id}.\n\nRegards,\nE-Commerce Store`,
            };

            transporter.sendMail(invoiceDetails, (err, info) => {
                if (err) {
                    console.error("Error sending success email:", err);
                    return res.status(500).json({ success: false, message: "Payment verified, but email sending failed." });
                } else {
                    console.log("Success email sent:", info.response);
                }
            });

            return res.status(200).json({
                success: true,
                message: "Payment verified successfully, and invoice sent.",
            });
        } else {
            // Send failure email
            const failureEmailDetails = {
                to: userEmail,
                subject: "Payment Failure Notification",
                text: `Dear customer,\n\nUnfortunately, your payment failed. Please try again.\n\nRegards,\nE-Commerce Store`,
            };

            transporter.sendMail(failureEmailDetails, (err, info) => {
                if (err) {
                    console.error("Error sending failure email:", err);
                } else {
                    console.log("Failure email sent:", info.response);
                }
            });

            return res.status(400).json({ success: false, message: "Payment verification failed." });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ success: false, message: "Internal server error during payment verification." });
    }
};
