import bcrypt from 'bcrypt';

// Hash the password
export const hashPassword = async (plainTextPassword) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainTextPassword, salt);
};

// Compare passwords
export const comparePasswords = async (plainTextPassword, hashedPassword) => {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};
