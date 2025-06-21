"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const module_1 = require("./module");
const express_1 = __importDefault(require("express"));
const bootstrap = () => {
    const app = new module_1.AppModule((0, express_1.default)());
    app.start();
};
bootstrap();
