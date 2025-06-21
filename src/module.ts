import * as dotenv from 'dotenv';
dotenv.config();

import { json, urlencoded } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { Application } from "express";
import mongoose from 'mongoose';
import { errorHandler } from '@myshopping-app/common';
import { authRouters } from './auth/auth.routers';


export class AppModule {
    constructor(public app: Application) {
        app.set('trust proxy', true);

        app.use(cookieSession({
            signed: false, //for production set as true
            secure: false,
        }));

        app.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        /*the extended: true option will work fine with postman but not with front-end apps*/
        // app.use(urlencoded({extended: false})); //for session u need to  be set as false
        // app.use(json());
        // Instead of adding an extra dependency, simply use these built-in methods to parse incoming request bodies efficiently!
        app.use(express.urlencoded({ extended: false }))
        app.use(express.json())

        app.use(authRouters);
        
        app.use(errorHandler);

        Object.setPrototypeOf(this, AppModule.prototype);
    }


    async start() {
        if(!process.env.MONGO_URI) {
            throw new Error("Mongo uri must be defined!");
        }

        if(!process.env.JWT_KEY) {
            throw new Error("Jwt Key must be defined!");
        }

        try {
            await mongoose.connect(process.env.MONGO_URI)
        }catch(err) {
            throw new Error("Database connection error!")
        }

        this.app.listen(3000, ()=> console.log("OK! port: 3000 listening"));
    }
}


