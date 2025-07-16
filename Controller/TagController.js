import prisma from "../DB/db.config.js";
import { v4 as uuidv4 } from "uuid"; //
// do we need to installl anything 
// npm install uuid

export const createTag = async (req, res) => {
    const { name } = req.body;
    try {
        const newTag = await prisma.tag.create({
            data: {
                name: name,
                tagId: uuidv4(), // uuidv4() is a function that generates a random uuid 
            }
        });
        res.status(201).json({ success: true, message: "Tag created successfully", data: newTag });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to create tag" });
    }
};

export const getAllTags = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany(
            {
                orderBy: {
                    name: "asc",
                }
            }
        );
        res.status(200).json({ success: true, data: tags });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to get tags" });
    }
};

export const fetchTagByPrefix = async (req, res) => {
    try{
        const tags = await prisma.tag.findMany({ 
            include: {
                posts: true,
            },
            where: {
                name: {
                    contains: "Pawan",
                    mode: "insensitive",
                },
            },
            orderBy: {
                name: "asc",
            }
        })
        res.status(200).json({ success: true, data: tags });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to get tags" });
    }
}

export const getTag = async (req, res) => {
    const tagId = req.params.id;
    try {
        const tag = await prisma.tag.findUnique({
            where: { tagId: tagId },
        });
        if (!tag) {
            return res.status(404).json({ success: false, error: "Tag not found" });
        }
        res.status(200).json({ success: true, data: tag });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to get tag" });
    }
};

export const updateTag = async (req, res) => {
    const tagId = req.params.id;
    const { name } = req.body;
    try {
        const tag = await prisma.tag.update({
            where: { tagId: tagId },
            data: {
               name
            },
        });
        res.status(200).json({ success: true, message: "Tag updated successfully", data: tag });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to update tag" });
    }
};

export const deleteTag = async (req, res) => {
    const tagId = req.params.id;
    try {
        const tag = await prisma.tag.delete({
            where: { tagId: tagId },
        });
        res.status(200).json({ success: true, message: "Tag deleted successfully", data: tag });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to delete tag" });
    }
};

