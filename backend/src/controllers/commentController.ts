import { Response,Request } from "express"
import * as queries from "../db/queries"
import { getAuth } from "@clerk/express"

export const createComment = async (req:Request, res:Response) => {
    try{
        const { userId } = getAuth(req)
        if(!userId) return res.status(401).json({
            error: "Unauthorized"
        })

        const { productId } = req.params
        const { content } = req.body

        if(!content) return res.status(400).json({ error: "Comment content is required" })

        // Verify that the producct 
        const product = await queries.getProductById(productId)
        if(!product) return res.status(404).json({
            error: "Product cannot be found"
        })

        const comment = await queries.createComment({
            content,
            userId,
            productId
        })

        res.status(201).json(comment)
    }catch(error){
        console.error("Error in creating the comment")
        res.status(500).json({ error: "failed to create comment" })
    }
}

export const deleteComment = async (req:Request, res:Response) => {
    try{
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthorized" })
        
        const { commentId } = req.params

        // Check if comment exists and belongs to the user
        const existingComment = await queries.getCommentById(commentId)
        if(!existingComment) return res.status(404).json({ error:"Comment not found" })

        if(existingComment.userId !== userId){
            return res.status(403).json({ error: "You can only delete your own comments" })
        }

        await queries.deleteComment(commentId)
        res.status(200).json({ message: "Comment deleted succefully" })
    }catch(error){
        console.error("Error in deleting comment: ", error)
        res.status(500).json({ error: "Failed to delete comment" })
    }
}