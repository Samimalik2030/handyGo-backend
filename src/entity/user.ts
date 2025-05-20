import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,

} from "typeorm";
import { Workshop } from "./workshop";
import { Booking } from "./booking";
import { AppDataSource } from "../config/connectDb";
import { FileDto } from "../types/fileDto";
import { Rating } from "./rating";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'simple-json',
    default: null,
  })
  profileImage: FileDto;

  @Column({ nullable: false })
  role: string;
  
  

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Workshop, (workshop) => workshop.user)
  workshop: Workshop;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Rating[];

}

export const getUserRepository = ()=> AppDataSource.getRepository(User);
