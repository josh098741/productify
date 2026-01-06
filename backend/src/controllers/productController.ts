import type { Request,Response } from "express"

import * as queries from "../db/queries"
import { getAuth } from "@clerk/express"

// Get All Products (public)
export const getAllProducts = async (req: Request,res: Response) => {
    try{
        const products = await queries.getAllProducts()
        res.status(200).json(products)
    }catch(error){
        console.error("Error in getting products:", error)
        res.status(500).json({ error: "Failed to get products" })
    }
}

// Get products by current user (protected)
export const getMyProducts = async (req: Request, res: Response) => {
    try{
        const { userId } = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthorized" })

        const products = await queries.getProductsByUserId(userId)
        res.status(200).json(products)
    }catch(error){
        console.error("Error in geetting user products:", error)
        res.status(500).json({ error: "Failed to get userproducts" })
    }
}

// Get single product by ID (public)
export const getProductById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params
        const product = await queries.getProductById(id)

        if(!product){
            return res.status(404).json({ error: "Product not found" })
        }

        res.status(200).json(product)
    }catch(error){
        console.error("Error in getting product: ", error)
        res.status(500).json({ error: "Failed to get product" })
    }
}

// Create product (protected)
export const createProduct = async (req: Request,res: Response) => {
    try{
        const { userId } = getAuth(req)
        if(!userId){
            return res.status(401).json({ error: "Unauthorized" })
        }

        const {title, description, imageUrl} = req.body
        if(!title || !description || !imageUrl){
            res.status(400).json({ error: "Title, description and imageUrl are required" })
            return
        }

        const product = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId
        })

        res.status(201).json(product)
    }catch(error){
        console.error("Error in creating product:", error)
        res.status(500).json({ error: "Failed to create product" })
    }
}

// Update product (protected - owner only)
export const updateProduct = async (req: Request,res: Response) => {
    try{
        const { userId } = getAuth(req)
        if(!userId) return res.status(401).json({ error: "Unauthorized" })

        const { id } = req.params
        const { title, description, imageUrl } = req.body

        // Check if product exists and belongs to the current user
        const existingProduct = await queries.getProductById(id)
        if(!existingProduct){
            res.status(404).json({
                error: "Product not found"
            })

            return
        }

        if(existingProduct.userId !== userId){
            res.status(403).json({ error: "ou can only upate your own products" })
            return
        }

        const product = await queries.updateProduct(id, {
            title,
            description,
            imageUrl
        })

        res.status(200).json(product)
    }catch(error){
        console.error("error updating product:", error)
        res.status(500).json({ error: "Failed to update product" })
    }
}