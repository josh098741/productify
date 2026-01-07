import { Router } from "express"
import { requireAuth } from "@clerk/express"
import * as commentController from "../controllers/commentController"

const router = Router()

// POST /api/comment/:productId - Add comment to the product (protected)
router.post("/:productId", requireAuth(), commentController.createComment)

// DELETE /api/comments/:commentId - Delete comment (protected - owner only)
router.delete("/:commentId", requireAuth(), commentController.deleteComment)

export default router