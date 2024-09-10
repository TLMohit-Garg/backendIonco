import DoctorSignup from "../models/doctorsignup.model.js";

// export  const doctorRegistration = async(req, res) => {
//     try {
//         const signup = await DoctorSignup.create(req.body);
//         res.status(201).json(signup);
//     } catch (error) {
//     res.status(500).json({message: error.message});
//     }
// };

export const doctorRegistration = async (req, res) => {
    const { email, ...otherFields } = req.body;
  
    try {
      const existingUser = await DoctorSignup.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
      }
  
      const newUser = await DoctorSignup.create({ email, ...otherFields });
      res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
export const getdoctors = async(req, res) => {
    try{
       const doctors = await DoctorSignup.find({});
       res.status(200).json(doctors);
    }catch(error){
    res.status(500).json({message: error.message});
    }
};
