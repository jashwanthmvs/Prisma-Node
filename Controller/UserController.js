import prisma from "../DB/db.config.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
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
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser
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
        const updatedUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                name,
                email,
                password,
            },
        });
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Failed to update user"
        });
    }
}

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
