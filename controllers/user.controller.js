import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'; 

// JWT secret key
const JWT_SECRET = '931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049';

// User Registration
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, age, phone, nationality, gender, role, specialty, licenseNumber, experience, medicalHistory, insuranceDetails } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, Please use a different email." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user based on role
    let userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      phone,
      nationality,
      gender,
      role, // Role could be patient, doctor, or admin
    };

    // If doctor, add doctor-specific fields
    if (role === 'doctor') {
      userData.doctorProfile = {
        specialty,
        licenseNumber,
        experience,
      };
    }

    // If patient, add patient-specific fields
    if (role === 'patient') {
      userData.patientProfile = {
        medicalHistory,
        insuranceDetails,
      };
    }

    // Save user to the database
    const newUser = new User(userData);
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the fetched user (be cautious with logging sensitive data)
    console.log('Fetched user:', { email: user.email, role: user.role });
    
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Log whether the passwords match
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    console.log('Login successful, token generated'); 

    res.status(200).json({ message: "Login successful", token, role: user.role,user: {
      userId: user._id, 
      email: user.email,
      role: user.role,
      phone:user.phone,
      password:user.password,
    }, });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// Get all users based on role
export const getUsersByRole = async (req, res) => {
    const { role } = req.params;
    
    try {
      const users = await User.find({ role });
  
      if (users.length === 0) {
        return res.status(404).json({ message: `No ${role}s found` });
      }
  
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// Get user by ID
export const getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
   


// Fetch User Profile
// Get user profile (Role-based access control)
// export const getUserProfile = async (req, res) => {
//     try {
//       // The token verification and user extraction are handled by the authenticateToken middleware
//       const user = await User.findById(req.user.userId);
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Role-based access control: restrict fields based on user role
//       if (user.role === 'doctor') {
//         res.status(200).json({
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           doctorProfile: user.doctorProfile,
//         });
//       } else if (user.role === 'patient') {
//         res.status(200).json({
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           patientProfile: user.patientProfile,
//         });
//       } else {
//         res.status(200).json({
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//         });
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
export const getUserProfile = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify token and extract user info
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user profile from database using the user ID from the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user profile data as a response
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile (Patient, Doctor)
export const updateUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Delete user (Patient, Doctor)
export const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
