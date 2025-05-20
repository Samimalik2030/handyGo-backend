import express from "express";
import { authGuard } from "../guards/auth-guard";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { getRatingRepository } from "../entity/rating";
import { getworkshopRepository, Workshop } from "../entity/workshop";
import { getUserRepository } from "../entity/user";

const ratingRouter = express.Router();
const RatingRepository = getRatingRepository();
const workshopRepository = getworkshopRepository();
const userRepository = getUserRepository();



///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Get All Ratings      ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

ratingRouter.get(
  "/",
  catchAsync(async (req, res, next) => {
    const { userId, workshopId } = req.query;

    const where: any = {};
    if (userId) where.user = { id: userId };
    if (workshopId) where.workshop = { id: workshopId };

    const foundRatings = await RatingRepository.find({
      where,
      relations: ["user", "workshop"],
    });

    res.status(200).json(foundRatings);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Store Rating      //////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

ratingRouter.post(
  "/",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const {workshopId,customerId} = req.body
    // const foundWorkshop = workshopRepository.findBy({
    //   id:workshopId
    // })
    //    const foundUser = userRepository.findBy({
    //   id:customerId
    // })
    const newRating = RatingRepository.create(req.body);
    await RatingRepository.save(newRating);
    res.status(201).json({
      message: "Thank you for submitting your rating!",
      rating: newRating,
    });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Get Single Rating      /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

ratingRouter.get(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundRating = await RatingRepository.findOne({
      where: { id: idInNumber },
      relations: ["user", "workshop"],
    });
    if (!foundRating) {
      return next(new AppError("Rating not found", 404));
    }
    res.status(200).json(foundRating);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Update Rating      /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

ratingRouter.patch(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundRating = await RatingRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundRating) {
      return next(new AppError("Rating not found", 404));
    }
    RatingRepository.merge(foundRating, req.body);
    await RatingRepository.save(foundRating);
    res.status(200).json(foundRating);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////      Delete Rating      /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

ratingRouter.delete(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundRating = await RatingRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundRating) {
      return next(new AppError("Rating not found", 404));
    }
    await RatingRepository.remove(foundRating);
    res.status(204).json(null);
  })
);

export default ratingRouter;
