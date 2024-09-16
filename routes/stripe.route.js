import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = Stripe(process.env.STRIPE_KEY)
const router = express.Router();


// router.post('/create-checkout-session', async (req, res) => {
//     const session = await stripe.checkout.sessions.create({
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'T-shirt',
//             },
//             unit_amount: 2000,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/checkout-success`,
//       cancel_url: `${process.env.CLIENT_URL}/cart`,
//     });
  
//     res.send({url: session.url});
//   });
// Set your secret key

// Route for creating a Checkout Session
router.post('/createCheckoutSession', async (req, res) => {
  const { patientID, doctorPrice } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: patientID,  // Use patientID as the email here for identification
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Doctor Consultation',
            },
            unit_amount: doctorPrice * 100,  // Price from doctor's flash card in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    });

    res.send({ url: session.url });  // Send the Stripe Checkout URL to frontend
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


  export default router;