import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { User } from "./user";
import { Booking } from "./booking";
import { AppDataSource } from "../config/connectDb";
import { FileDto } from "../types/fileDto";

@Entity()
export class Workshop {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: "simple-json" })
  logo: FileDto;

  @Column()
  workshopType: string;

  @Column()
  contactNumber: string;

  @Column()
  city: string;

  @Column()
  fullAddress: string;

  @Column("simple-array")
  selectedServices: string[];

  @Column()
  sparePartsAvailable: string;

  @Column()
  serviceMode: string;

  @Column("simple-array")
  workingDays: string[];

  @Column()
  openingTime: string;

  @Column()
  closingTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.workshop)
  @JoinColumn()
  user: User;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}

export const getworkshopRepository = () =>
  AppDataSource.getRepository(Workshop);
