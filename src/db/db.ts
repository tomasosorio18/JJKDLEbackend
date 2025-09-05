import { Pool, PoolClient } from 'pg'
import dotenv from 'dotenv'
import Joi from 'joi'

// Cargar variables de entorno
dotenv.config()

// Aca se validan las variables de entorno
const envSchema = Joi.object({
    DB_USER: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
}).unknown()

const { error, value: envVars } = envSchema.validate(process.env)
if (error) {
   console.error("Error en las variables de entorno:", error.message)
    process.exit(1)
}
 
class Database {
    private pool: Pool

    constructor() {
        this.pool = new Pool({
            user: envVars.DB_USER,
            host: envVars.DB_HOST,
            database: envVars.DB_NAME,
            password: envVars.DB_PASSWORD,
            port: envVars.DB_PORT,
            max: 20, // Tamaño máximo del pool
            idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar una conexión inactiva
            connectionTimeoutMillis: 10000, // Tiempo máximo para establecer una conexión
        })

        this.testConnection()
    }

    // Función para probar la conexión a la base de datos
    private async testConnection(): Promise<void> {
        let client: PoolClient | undefined
        try {
            client = await this.pool.connect()
            console.log('Conexión a la base de datos exitosa')
            await client.query('SELECT NOW()')
        } catch (err) {
            console.error('Error al conectar a la base de datos:', err)
        } finally {
            if (client) client.release()//Se libera al cliente para evitar gastar recursos
        }
    }

    // Método para obtener un cliente del pool
    public async getClient(): Promise<PoolClient> {
        return this.pool.connect()
    }
}

export default new Database()