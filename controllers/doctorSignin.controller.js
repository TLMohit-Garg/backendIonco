import Signup from "../models/doctorsignup.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

 const JWT_SECRET = "931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049";
// const JWT_SECRET = process.env.JWT_SECRET;

export const doctorSignin = async(req, res) => {
    const { email, password } = req.body;
      try {
        // Find the user by email
        const user = await Signup.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
         // Create a JWT token
         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
        // If successful, send a success response
        res.status(200).json({ message: 'Sign-in successful', token  });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}