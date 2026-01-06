import { Router } from "express"
import * as productController from "../controllers/productController"
import { requireAuth } from "@clerk/express"

const router = Router()

// GET /api/products => Get all the products (pubic)
router.get("/", productController.getAllProducts)

export default router