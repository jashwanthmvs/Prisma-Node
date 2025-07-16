import prisma from "../DB/db.config.js";

export const createPost = async (req, res) => {
    const { userId, title, description } = req.body;

    if (!userId || isNaN(parseInt(userId))) {
        return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    try {
        const newPost = await prisma.post.create({
            data: {
                userId: parseInt(userId),
                title,
                description,
            },
        });
        res.status(201).json({ success: true, message: "Post created successfully", data: newPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to create post" });
    }
};

export const showAllPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                user: true,
                comments: true,
                tags: true
            }
        });

        res.status(200).json({ success: true, data: posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to get posts" });
    }
};


export const fetchPostByLogic = async (req, res) => {
    try{
        const posts = await prisma.post.findMany({ 
            include: {
                user: true,
            },
            where: {
                title: {
                    contains: "Ai tools",
                },
            }
        })
        res.status(200).json({ success: true, data: posts });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to get posts" });
    }
}

export const showPost = async (req, res) => {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
        return res.status(400).json({ success: false, error: "Invalid post ID" });
    }

    try {
        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.status(200).json({ success: true, message: "Post fetched successfully", data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to get post" });
    }
};

export const updatePost = async (req, res) => {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
        return res.status(400).json({ success: false, error: "Invalid post ID" });
    }

    try {
        const post = await prisma.post.update({
            where: { id: postId },
            data: {
                title: req.body.title,
                description: req.body.description,
            },
        });
        res.status(200).json({ success: true, message: "Post updated successfully", data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to update post" });
    }
};

export const deletePost = async (req, res) => {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
        return res.status(400).json({ success: false, error: "Invalid post ID" });
    }

    try {
        const post = await prisma.post.delete({
            where: { id: postId },
        });
        res.status(200).json({ success: true, message: "Post deleted successfully", data: post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to delete post" });
    }
};
