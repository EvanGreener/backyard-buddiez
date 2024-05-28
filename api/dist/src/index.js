"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const firebase_config_1 = require("../firebase-config");
const app_1 = require("firebase/app");
// Initialize Firebase
const firebaseApp = (0, app_1.initializeApp)(firebase_config_1.firebaseConfig);
// const analytics = getAnalytics(firebaseApp)
// Initialize server
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 7777;
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
