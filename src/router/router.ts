import express from "express";
import authRouter from "../routes/authRoutes";
import workshopRouter from "../routes/workshopRoutes";
import bookingRouter from "../routes/bookingRoutes";
import imageRouter from "../routes/imageRoutes";
import ratingRouter from "../routes/ratingsRoutes";
const router = express.Router()
router.use("/auth", authRouter)
router.use("/workshops", workshopRouter)
router.use("/bookings", bookingRouter)
router.use('/images',imageRouter)
router.use('/ratings',ratingRouter)



export default router