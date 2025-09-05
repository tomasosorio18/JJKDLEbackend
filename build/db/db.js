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
const joi_1 = __importDefault(require("joi"));
// Cargar variables de entorno
dotenv_1.default.config();
// Aca se validan las variables de entorno
const envSchema = joi_1.default.object({
    DB_USER: joi_1.default.string().required(),
    DB_HOST: joi_1.default.string().required(),
    DB_NAME: joi_1.default.string().required(),
    DB_PASSWORD: joi_1.default.string().required(),
    DB_PORT: joi_1.default.number().default(5432),
}).unknown();
const { error, value: envVars } = envSchema.validate(process.env);
if (error) {
    console.error("Error en las variables de entorno:", error.message);
    process.exit(1);
}
class Database {
    constructor() {
        this.pool = new pg_1.Pool({
            user: envVars.DB_USER,
            host: envVars.DB_HOST,
            database: envVars.DB_NAME,
            password: envVars.DB_PASSWORD,
            port: envVars.DB_PORT,
            max: 20, // Tamaño máximo del pool
            idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar una conexión inactiva
            connectionTimeoutMillis: 10000, // Tiempo máximo para establecer una conexión
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
