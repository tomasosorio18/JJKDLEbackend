"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
const personajes_routes_1 = __importDefault(require("./routes/personajes.routes"));
const games_routes_1 = __importDefault(require("./routes/games.routes"));
const cors_1 = __importDefault(require("cors"));
const env = dotenv_1.default.config();
dotenv_expand_1.default.expand(env);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use("/images", express_1.default.static("public/images"));
app.use("/voices", express_1.default.static("public/voices"));
const allowedOrigins = ['http://localhost:5173', 'https://jjk-dle.vercel.app', 'https://jjk-dle.vercel.app/'];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use("/api/personajes", personajes_routes_1.default);
app.use("/game", games_routes_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
app.get("/", (req, res) => {
    res.send("Hello World!");
});
