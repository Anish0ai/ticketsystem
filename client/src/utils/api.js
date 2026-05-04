"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API = axios_1.default.create({
    baseURL: "https://ticketsystem-4ygo.vercel.app/",
});
exports.default = API;
