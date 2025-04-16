import express, { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { authGuard } from "../guards/auth-guard";

import AppError from "../utils/appError";
import { uploadImage } from "../config/imagekit";
import { FileDto } from "../types/fileDto";
import { getworkshopRepository } from "../entity/workshop";
import { Like } from "typeorm";

const workshopRouter = express.Router();
const workshopRepository = getworkshopRepository();

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////      Get Workshops      ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

workshopRouter.get(
  "/",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { city, area, name, type, userId } = req.query;

    const where: any = {};

    if (city) where.city = city;
    if (area) where.fullAddress = Like(`%${area}%`);
    if (name) where.name = name;
    if (type) where.workshopType = type;
    if (userId) where.user = { id: userId };

    const foundWorkshops = await workshopRepository.find({where});

    res.status(200).json(foundWorkshops);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////      Store Workshop      ///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

workshopRouter.post(
  "/",
  catchAsync(authGuard),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newWorkshop = workshopRepository.create(req.body);
    await workshopRepository.save(newWorkshop);
    res.status(201).json(newWorkshop);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////      Get Workshop      ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

workshopRouter.get(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundWorkshop = await workshopRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundWorkshop) {
      return next(new AppError("Workshop not found", 404));
    }
    res.status(200).json(foundWorkshop);
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////      Update Workshop      /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

workshopRouter.patch(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    console.log(id, "id");
    const foundWorkshop = await workshopRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundWorkshop) {
      return next(new AppError("Workshop not found", 404));
    }
    const updatedWorkshop = await workshopRepository.save({
      ...foundWorkshop,
      ...req.body,
    });
    res.status(200).json({
      message: "Workshop updated sucessfully",
      workshop: updatedWorkshop,
    });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////      Delete Workshop      /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

workshopRouter.delete(
  "/:id",
  catchAsync(authGuard),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const foundWorkshop = await workshopRepository.findOneBy({
      id: idInNumber,
    });
    if (!foundWorkshop) {
      return next(new AppError("Workshop not found", 404));
    }
    await workshopRepository.remove(foundWorkshop);
    res.status(204).json({ message: "Workshop deleted successfully" });
  })
);

///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////    Update Profile    //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

workshopRouter.patch(
  "/patch-logo",
  catchAsync(authGuard),
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const idInNumber = Number(id);
    const workshop = await workshopRepository.findOneBy({
      id: idInNumber,
    });
    if (!workshop) {
      return next(new AppError("Workshop not found", 404));
    }
    const file = req.file as Express.Multer.File;
    const uploadedFile = await uploadImage(file);
    workshop.logo = uploadedFile as FileDto;
    await workshopRepository.save(workshop);

    res.status(200).json({
      message: "Logo uploaded successfully",
      profileImage: workshop.logo,
    });
  })
);

export default workshopRouter;
