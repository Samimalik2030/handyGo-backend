import express, { NextFunction } from "express";
import { authGuard } from "../guards/auth-guard";
import catchAsync from "../utils/catchAsync";

import AppError from "../utils/appError";
import { getBookingRepository } from "../entity/booking";
const bookingRouter = express.Router();
const BookingRepository = getBookingRepository();

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Get Booking      ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

bookingRouter.get(
  "/",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { status, userId,workshopId } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (workshopId) where.workshop = { id: workshopId };
    if (userId) where.user = { id: userId };



    const foundBookings = await BookingRepository.find({
      where,
      relations: ["user", "workshop"],
    });

    res.status(200).json(foundBookings);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Store Booking      /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

bookingRouter.post(
  "/",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const newBooking = BookingRepository.create(req.body);
    await BookingRepository.save(newBooking);
    res.status(201).json({
      message:
        "Thank you! Your booking has been submitted. We’ll notify you once the mechanic approves it.",
      booking: newBooking,
    });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Get Booking      ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

bookingRouter.get(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundBooking = await BookingRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundBooking) {
      return next(new AppError("Booking not found", 404));
    }
    res.status(200).json(foundBooking);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Update Booking      ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

bookingRouter.patch(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundBooking = await BookingRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundBooking) {
      return next(new AppError("Booking not found", 404));
    }
    BookingRepository.merge(foundBooking, req.body);
    await BookingRepository.save(foundBooking);
    res.status(200).json(foundBooking);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Delete Booking      ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

bookingRouter.delete(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundBooking = await BookingRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundBooking) {
      return next(new AppError("Booking not found", 404));
    }
    await BookingRepository.remove(foundBooking);
    res.status(204).json(null);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////     Update Status     ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

bookingRouter.patch(
  "/:id/status",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundBooking = await BookingRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundBooking) {
      return next(new AppError("Booking not found", 404));
    }
    foundBooking.status = req.body.status;
    await BookingRepository.save(foundBooking);
    res.status(200).json({
        message:"Booking status updated sucessfully",
        booking:foundBooking
    });
  })
);

export default bookingRouter;
