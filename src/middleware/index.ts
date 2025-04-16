import { Express, json } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
export default function middleware(app:Express){
    app.use(json());
    app.use(
        cors({
          origin: "http://localhost:5173", 
          methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
          allowedHeaders: ["Content-Type", "Authorization"],
        })
      );
    app.use(morgan("dev"));
    app.use(helmet());
}
