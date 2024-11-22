import express from 'express';
import { createCheckoutSession, getCheckoutSession, gettransactionList, handleStripeWebhook } from '../controllers/stripe.controller.js';

const router = express.Router();

// Route for creating a new Stripe Checkout session
router.post('/createCheckoutSession', createCheckoutSession);

// Route for retrieving an existing Stripe Checkout session
router.get('/session/:sessionId', getCheckoutSession);

//Route for fetch all the transaction details
router.get("/transactions", gettransactionList);

router.post("/webhook", express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;



// import express from "express";
// import Stripe from "stripe";
// import dotenv from "dotenv";

// dotenv.config();

// const stripe = Stripe(process.env.STRIPE_KEY)
// const router = express.Router();

// const supportedCurrencies = ['usd', 'eur', 'gbp', 'inr', 'aud', 'cad', 'jpy'];
// const minAmountInUSD = 0.50;

// const conversionRates = {
//   'usd': 1,
//   'eur': 1.1,
//   'gbp': 1.3,
//   'inr': 0.012,
//   'aud': 0.64, 
//   'cad': 0.75,
//   'jpy': 0.0067
// };

// // Route for creating a Checkout Session
// router.post('/createCheckoutSession', async (req, res) => {
//   const { patientEmail, doctorPrice, preferredCurrency  } = req.body;
//   let currency = 'gbp'; 

//   if (preferredCurrency && supportedCurrencies.includes(preferredCurrency.toLowerCase())) {
//     currency = preferredCurrency.toLowerCase();
//   }

//    // Add 25% to the doctorPrice
//    const increasedPrice = doctorPrice * 1.25;

//    // Convert the amount to USD for the minimum price check
//   const amountInUSD = increasedPrice * (conversionRates[currency] || 1);
//   if (amountInUSD < minAmountInUSD) {
//     return res.status(400).send({ error: `The minimum amount required is $${minAmountInUSD}.` });
//   }

//   try {
//     const session = await stripe.checkout.sessions.create({
//       customer_email: patientEmail,  // Use patientID as the email here for identification
//       line_items: [
//         {
//           price_data: {
//             currency,
//             product_data: {
//               name: 'Doctor Consultation',
//               description: 'Consultation fee includes service charges and applicable taxes.',
//             },
//             unit_amount: doctorPrice * 100,  // Price from doctor's flash card in cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/cancel`,
//     });

//     res.send({ url: session.url, sessionId: session.id  });  // Send the Stripe Checkout URL to frontend
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// router.get("/session/:sessionId",async(req,res)=> {
//   const { sessionId } = req.params;
//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     // Log session data for debugging purposes
//     console.log("Session data:", session);
//     res.status(200).send(session);
//   } catch (error) {
//     res.status(500).send({error:error.message});
//   }
// })
//   export default router;