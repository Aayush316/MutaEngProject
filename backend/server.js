const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db'); // Import the connectDB function

const paymentRoute = require("./routes/paymentRoutes.js");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/auth', authRoutes);
app.use("/api", paymentRoute);

app.get("/api/getkey", (req, res) => {
    res.status(200).json({
        key: process.env.RAZORPAY_API_KEY,
    });
});

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => console.error(err));
