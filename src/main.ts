import { JwtPayload } from "@myshopping-app/common";
import { AppModule } from "./module";
import express from 'express';

declare global {
    namespace Express {
        interface Request {
            currentUser?: JwtPayload
        }
    }
}

const bootstrap = () => {
    const app = new AppModule(express());

    app.start();
};


bootstrap();