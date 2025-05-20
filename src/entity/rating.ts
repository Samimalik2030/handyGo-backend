import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
  } from "typeorm";
  import { User } from "./user";
  import { Workshop } from "./workshop";
  import { AppDataSource } from "../config/connectDb";
  
  @Entity()
  export class Rating {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: "int", width: 1 })
    stars: number;
  
    @Column({ type: "text", nullable: true })
    comment: string;
  
    @ManyToOne(() => User, (user) => user.ratings)
    user: User;
  
    @ManyToOne(() => Workshop, (workshop) => workshop.ratings)
    workshop: Workshop;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  
  export const getRatingRepository = () => AppDataSource.getRepository(Rating);
  