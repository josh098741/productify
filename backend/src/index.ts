import express from "express"
import cors from "cors"

import {ENV} from "./config/env"
import { clerkMiddleware } from '@clerk/express'

import usersRoutes from "./routes/usersRoutes"
import productRoutes from "./routes/productRoutes"
import commentRoutes from "./routes/commentRoutes"

const app = express()

app.use(cors({
    origin: ENV.FRONTEND_URL,
    credentials: true
}))
app.use(clerkMiddleware()) // Auth object will be attached to the request object
app.use(express.json()); //Parses json request bodies
app.use(express.urlencoded({ extended: true })) // Parses form data (like html forms)

app.get("/", (req,res) => {
    res.json({ 
        message: "Welcome to Productify API - Powered by PostgreSQL, Drizzle ORM & Clerk Auth",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments"
        }
    })
})

app.use("/api/users", usersRoutes)
app.use("/api/products", productRoutes)
app.use("/api/comments", commentRoutes)

app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT))