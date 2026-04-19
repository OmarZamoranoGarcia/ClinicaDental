import sql from 'mssql';

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: process.env.DB_TRUST_CERT === "true",
        enableArithAbort: process.env.DB_ENABLE_ARITH_ABORT === "true",
    },
    connectionTimeout: Number(process.env.DB_CONN_TIMEOUT),
    requestTimeout: Number(process.env.DB_REQ_TIMEOUT),
};

let pool = null;

export async function getConnection() {
    try {
        if (pool && pool.connected) {
            return pool;
        }
        
        // Si hay un pool pero está desconectado, crear nuevo
        if (pool && !pool.connected) {
            pool = null;
        }
        
        console.log('Conectando a SQL Server...');
        console.log(`Servidor: ${config.server}`);
        console.log(`Usuario: ${config.user}`);
        console.log(`Base de datos: ${config.database}`);
        
        pool = await sql.connect(config);
        console.log('onexión exitosa a la base de datos');
        return pool;
        
    } catch (error) {
        console.error('Error de conexión a BD:');
        console.error(`Mensaje: ${error.message}`);
        if (error.code) {
            console.error(`Código: ${error.code}`);
        }
        if (error.originalError) {
            console.error(`Error original: ${error.originalError.message}`);
        }
        throw error;
    }
}

// Función para cerrar la conexión (útil al cerrar la app)
export async function closeConnection() {
    try {
        if (pool) {
            await pool.close();
            console.log('🔌 Conexión a BD cerrada');
        }
    } catch (error) {
        console.error('Error al cerrar conexión:', error);
    }
}

export { sql };