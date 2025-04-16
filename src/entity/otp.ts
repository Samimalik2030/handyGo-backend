import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";
import { AppDataSource } from "../config/connectDb";
  
  @Entity()
  export class Otp {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    email: string;
  
    @Column()
    otp: number

  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
export const getOtpRepository = ()=> AppDataSource.getRepository(Otp);

  