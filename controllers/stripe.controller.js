import DoctorConsultation  from '../models/stripe.model.js';
import dotenv from 'dotenv';
import Stripe from 'stripe';
const endpointSecret = 'your-webhook-signing-secret';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY);

// POST request to create a Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const { patientEmail, doctorPrice, preferredCurrency, doctorName, serviceCharges } = req.body;

    // Convert the price to cents and create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: patientEmail,
      line_items: [
        {
          price_data: {
            currency: preferredCurrency.toLowerCase(),
            product_data: {
              name: `Consultation with Dr. ${doctorName}`,
              description: `Service charges included.`,
            },
            unit_amount: Math.round(doctorPrice * 100), // Stripe requires price in cents
          },
          quantity: 1,
        },
        
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Send the session URL back to the client
    res.status(200).send({ url: session.url, sessionId: session.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// GET request to retrieve a Stripe Checkout Session
export const getCheckoutSession = async (req, res) => {
  const { sessionId } = req.params;
  
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if(session.payment_status === "paid"){
      sendPaymentSuccessEmail(session.customer_email, session.amount_total / 100, session.currency, session.id);
    }
    res.status(200).send(session);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// Function to send payment success email
const sendPaymentSuccessEmail = async (email, amount, currency, sessionId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Payment Successful - Consultation Booking',
      // text: `Dear User,\n\nThank you for your payment of ${amount}
      //  ${currency.toUpperCase()}.\nYour session ID is ${sessionId}.
      //  \n\nWe look forward to serving you.\n\nBest Regards,\nYour Healthcare Team`,
      text: `Dear ${
        email === process.env.ADMIN_EMAIL ? 'Admin' : 'User'
      },\n\nThank you for your payment of ${amount} ${currency.toUpperCase()}.\nYour session ID is ${sessionId}.\n\nBest Regards,\nYour Healthcare Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log('Payment success email sent.');
  } catch (error) {
    console.error('Failed to send payment success email:', error.message);
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

export const handleStripeWebhook =async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
      // Verify the Stripe webhook signature
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
      case 'checkout.session.completed':
          const session = event.data.object;
          console.log('Payment was successful:', session);
          // Trigger your success logic here
          // Example: Update your database or send a confirmation email

           // Send email to the user
      await sendPaymentSuccessEmail(
        session.customer_email, 
        session.amount_total / 100, 
        session.currency, 
        session.id
      );

      // Send email to the admin
      await sendPaymentSuccessEmail(
        process.env.ADMIN_EMAIL, // Admin email
        session.amount_total / 100,
        session.currency,
        session.id
      );

          break;

      case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Payment Intent was successful:', paymentIntent);
          // Handle payment confirmation logic here
          break;

      default:
          console.warn(`Unhandled event type: ${event.type}`);
  }

  // Respond to Stripe
  res.status(200).json({ received: true });
};









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
