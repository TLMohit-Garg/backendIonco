import DoctorConsultation  from '../models/stripe.model.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY);

// POST request to create a Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    // Validate request body using Yup schema
    await DoctorConsultation.validate(req.body, { abortEarly: false });

    const { patientEmail, doctorPrice, preferredCurrency, doctorName, consultationDate, serviceCharges } = req.body;

    // Add 30% to the doctorPrice
    // const increasedPrice = doctorPrice * 1.25;
    const serviceCharge = doctorPrice * 0.30; // 30% service charge
    const totalPrice = doctorPrice + serviceCharge; // Total price with service charges

    // Convert the price to cents and create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: patientEmail,
      line_items: [
        {
          price_data: {
            currency: preferredCurrency.toLowerCase(),
            product_data: {
              name: `Consultation with Dr. ${doctorName}`,
              description: `Consultation on ${consultationDate}. Service charges included.`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe requires price in cents
          },
          quantity: 1,
        },
        {
            price_data: {
              currency: preferredCurrency.toLowerCase(),
              product_data: {
                name: 'Service Charge',
                description: '30% Service Charge',
              },
              unit_amount: Math.round(serviceCharge * 100), // Price in cents
            },
            quantity: 1,
          },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

     // Create a new DoctorConsultation entry in MongoDB
     const newConsultation = new DoctorConsultation({
        patientEmail,
        doctorName,
        consultationDate,
        serviceCharges,
        // doctorPrice: increasedPrice, // Store the increased price
        // sessionId: session.id, // Optional: Store the session ID for reference
      });
  
      // Save the consultation to the database
      await newConsultation.save();

    // Send the session URL back to the client
    res.status(200).send({ url: session.url, sessionId: session.id });
  } catch (error) {
    // Handle validation or Stripe errors
    
    res.status(500).send({ error: error.message });
  }
};

// GET request to retrieve a Stripe Checkout Session
export const getCheckoutSession = async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.status(200).send(session);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

export const gettransactionList = async(req, res) => {
    try{
        const transactions = await DoctorConsultation.find({});
        res.status(200).json(transactions);
    }catch(error){
        res.status(500).send({error: error.message});
    }
}


// import Stripe from "stripe";
// import dotenv from "dotenv";
// import doctorConsultationSchema from "../models/stripe.model.js";

// dotenv.config();

// const stripe = Stripe(process.env.STRIPE_KEY);

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

// // Create a new Stripe Checkout Session
// // export const createCheckoutSession = async (req, res) => {
// //   const { patientEmail, doctorPrice, preferredCurrency } = req.body;
// //   let currency = 'gbp'; 

// //   if (preferredCurrency && supportedCurrencies.includes(preferredCurrency.toLowerCase())) {
// //     currency = preferredCurrency.toLowerCase();
// //   }

// //   // Add 25% to the doctorPrice
// //   const increasedPrice = doctorPrice * 1.25;

// //   // Convert the amount to USD for the minimum price check
// //   const amountInUSD = increasedPrice * (conversionRates[currency] || 1);
// //   if (amountInUSD < minAmountInUSD) {
// //     return res.status(400).send({ error: `The minimum amount required is $${minAmountInUSD}.` });
// //   }

// //   try {
// //     const session = await stripe.checkout.sessions.create({
// //       customer_email: patientEmail,  // Use patientID as the email here for identification
// //       line_items: [
// //         {
// //           price_data: {
// //             currency,
// //             product_data: {
// //               name: 'Doctor Consultation',
// //               description: 'Consultation fee includes service charges and applicable taxes.',
// //             },
// //             unit_amount: Math.round(increasedPrice * 100),  // Stripe expects the price in cents
// //           },
// //           quantity: 1,
// //         },
// //       ],
// //       mode: 'payment',
// //       success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
// //       cancel_url: `${process.env.CLIENT_URL}/cancel`,
// //     });

// //     res.send({ url: session.url, sessionId: session.id });
// //   } catch (error) {
// //     res.status(500).send({ error: error.message });
// //   }
// // };
// export const createCheckoutSession = async (req, res) => {
//     try {
//       // Validate the incoming data using Yup schema
//       await doctorConsultationSchema.validate(req.body, { abortEarly: false });
  
//       const { patientEmail, doctorPrice, preferredCurrency, doctorName, consultationDate, serviceCharges } = req.body;
  
//       // Business logic for creating a Stripe checkout session or saving the data
//       const currency = preferredCurrency.toLowerCase();
  
//       const session = await stripe.checkout.sessions.create({
//         customer_email: patientEmail,
//         line_items: [
//           {
//             price_data: {
//               currency,
//               product_data: {
//                 name: `Consultation with Dr. ${doctorName}`,
//                 description: `Consultation on ${consultationDate}. Service charges included.`,
//               },
//               unit_amount: Math.round(doctorPrice * 1.25 * 100),  // Price multiplied by 1.25 and converted to cents
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//         cancel_url: `${process.env.CLIENT_URL}/cancel`,
//       });
  
//       // Return the session URL
//       res.status(200).send({ url: session.url, sessionId: session.id });
  
//     } catch (error) {
//       // Handle validation errors or any other errors
//       if (error instanceof Yup.ValidationError) {
//         return res.status(400).send({ errors: error.errors });
//       }
//       res.status(500).send({ error: error.message });
//     }
//   };

// // Retrieve a Stripe session by session ID
// export const getSessionById = async (req, res) => {
//   const { sessionId } = req.params;
  
//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     console.log("Session data:", session);  // Log session for debugging
//     res.status(200).send(session);
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// };
