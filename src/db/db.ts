import { Pool, PoolClient } from 'pg'
import dotenv from 'dotenv'
import Joi from 'joi'

// Cargar variables de entorno
dotenv.config()
 
class Database {
    private pool: Pool

    constructor() {
        this.pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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