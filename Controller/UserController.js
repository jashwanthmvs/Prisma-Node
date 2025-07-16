import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                // Exclude password from response
                password: false
            }
        });
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to get users"
        });
    }
}

export const getUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
        }
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                // Exclude password from response
                password: false
            }
        });
        if (!findUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: findUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to get user"
        });
    }
}

export const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }

        // Check if user already exists
        const findUser = await prisma.user.findUnique({
            where: {
                email
            },
        });
        if (findUser) {
            return res.status(400).json({
                success: false,
                error: "User already exists"
            });
        }

        // Hash the password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userWithoutPassword
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Failed to create user"
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
        }
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!findUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }

        // Prepare update data
        const updateData = {
            name,
            email,
        };

        // Only hash and update password if provided
        if (password) {
            const saltRounds = 12;
            updateData.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = updatedUser;

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: userWithoutPassword
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to update user"
        });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }

        // Find user by email (include password for verification)
        const user = await prisma.user.findUnique({
            where: {
                email
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid credentials"
            });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: userWithoutPassword
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to login"
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: "Invalid user ID"
            });
        }
        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!findUser) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            });
        }
        const deletedUser = await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to delete user"
        });
    }
}
