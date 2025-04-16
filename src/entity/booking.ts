import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user";
import { Workshop } from "./workshop";
import { AppDataSource } from "../config/connectDb";

export enum BookingStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings)  
  user: User;

  @ManyToOne(() => Workshop, (workshop) => workshop.bookings)
  workshop: Workshop;

  @Column()
  date: string;

  @Column()
  serviceType: string;

  @Column({ type: "time" })
  time: string;

  @Column({ type: "enum", enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column("simple-array")
  services: string[];

  @Column({ type: "text", nullable: true })
  problemDescription: string;

  @CreateDateColumn()
  createdAt: Date;
}

export const getBookingRepository = ()=> AppDataSource.getRepository(Booking)

