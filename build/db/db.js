"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno
dotenv_1.default.config();
class Database {
    constructor() {
        this.pool = new pg_1.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
        this.testConnection();
    }
    // Función para probar la conexión a la base de datos
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            let client;
            try {
                client = yield this.pool.connect();
                console.log('Conexión a la base de datos exitosa');
                yield client.query('SELECT NOW()');
            }
            catch (err) {
                console.error('Error al conectar a la base de datos:', err);
            }
            finally {
                if (client)
                    client.release(); //Se libera al cliente para evitar gastar recursos
            }
        });
    }
    // Método para obtener un cliente del pool
    getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.pool.connect();
        });
    }
}
exports.default = new Database();
