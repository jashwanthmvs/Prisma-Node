import prisma from "../DB/db.config.js";

export const createComment = async (req, res) => {
    try {
        const { comment, postId, userId } = req.body;

        if (!comment?.trim()) { // if comment is not provided
            return res.status(400).json({ error: "Comment text is required" });
        }
        if (!postId || isNaN(parseInt(postId))) { // if postId is not provided or not a number
            return res.status(400).json({ error: "Valid postId is required" });
        }
        if (!userId || isNaN(parseInt(userId))) { // if userId is not provided or not a number
            return res.status(400).json({ error: "Valid userId is required" });
        }

        const newComment = await prisma.comment.create({ // create a new comment
            data: {
                comment: comment.trim(), // trim the comment. trim() removes leading and trailing whitespace
                postId: parseInt(postId), // convert postId to integer
                userId: parseInt(userId), // convert userId to integer
            },
        });
        
        res.status(201).json({ // return the new comment
            success: true,
            message: "Comment created successfully", 
            data: newComment 
        });
    } catch (error) {
        console.error("Create Comment Error:", error); // log the error
        res.status(500).json({ 
            success: false,
            error: "Failed to create comment" 
        });
    }
};

export const showAllComments = async (req, res) => { // get all comments
    try {
        const page = parseInt(req.query.page) || 1; // get page number from query
        const limit = parseInt(req.query.limit) || 10; // get limit from query
        const skip = (page - 1) * limit; // calculate skip

        // find all comments and count total comments. Promise.all is used to wait for both queries to complete
        // this is more efficient than running the queries separately
        // this is because Promise.all waits for all the promises to resolve before moving on to the next line

        const [comments, total] = await Promise.all([ 
            prisma.comment.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.comment.count()
        ]);

        res.status(200).json({
            success: true,
            data: comments,
            meta: {
                total,
                page,
                pages: Math.ceil(total / limit),
                limit
            }
        });
    } catch (error) {
        console.error("Get All Comments Error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to retrieve comments" 
        });
    }
};

// get all comments of a particular post 

export const showAllCommentsOfPost = async (req, res) => {
    try {
        const postId = parseInt(req.params.id); // Note that here postId is int not uuid
        if (isNaN(postId)) {
            return res.status(400).json({ 
                success: false,
                error: "Invalid post ID" 
            });
        }

        const comments = await prisma.comment.findMany({
            where: { postId }
        });

        res.status(200).json({ 
            success: true,
            data: comments 
        });
    } catch (error) {
        console.error("Get All Comments of Post Error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to retrieve comments of post" 
        });
    }
};

export const showComment = async (req, res) => { 
    try {
        const commentId = req.params.id; // Note that here commentId is uuid not int

        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        });

        if (!comment) {
            return res.status(404).json({ 
                success: false,
                error: "Comment not found" 
            });
        }

        res.status(200).json({ 
            success: true,
            data: comment 
        });
    } catch (error) {
        console.error("Get Comment Error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to retrieve comment" 
        });
    }
};


export const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id; // Note that here commentId is uuid not int
        const { comment: commentText } = req.body;

        if (!commentText?.trim()) {
            return res.status(400).json({ 
                success: false,
                error: "Comment text is required" 
            });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { comment: commentText.trim() },
        });

        res.status(200).json({ 
            success: true,
            message: "Comment updated successfully", 
            data: updatedComment 
        });
    } catch (error) {
        console.error("Update Comment Error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to update comment" 
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id; // Note that here commentId is uuid not int

        await prisma.comment.delete({
            where: { id: commentId },
        });

        res.status(200).json({ 
            success: true,
            message: "Comment deleted successfully" 
        });
    } catch (error) {
        console.error("Delete Comment Error:", error);
        res.status(500).json({ 
            success: false,
            error: "Failed to delete comment" 
        });
    }
};
