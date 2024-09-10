import Signup from"../models/signup.model.js";

// export  const patientRegistration = async(req, res) => {
//     try {
//         const signup = await Signup.create(req.body);
//         res.status(201).json(signup);
//     } catch (error) {
//     res.status(500).json({message: error.message});
//     }
// };
export const patientRegistration = async (req, res) => {
    const { email, ...otherFields } = req.body;
  
    try {
      // Check if the email already exists
      const existingUser = await Signup.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
      }
  
      // If email is unique, create a new user
      const newUser = await Signup.create({ email, ...otherFields });
      res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
