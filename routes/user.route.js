import express from 'express';
import { registerUser, loginUser, getUsersByRole, getUserById, getUserProfile, updateUser, deleteUser } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser); // User registration
router.post('/login', loginUser);       // User login

// Protected routes (authentication required)
router.get('/profile', authenticateToken, getUserProfile);       // Get user profile (protected)
router.get('/role/:role', authenticateToken, getUsersByRole);    // Get users by role (protected)
router.get('/:id', getUserById);              // Get user by ID (protected)
router.put('/:id', authenticateToken, updateUser);               // Update user (protected)
router.delete('/:id', authenticateToken, deleteUser);            // Delete user (protected)

export default router;
