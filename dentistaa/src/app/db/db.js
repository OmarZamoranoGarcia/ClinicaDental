import sql from 'mssql';

const config = {
    user: "sa",  
    password: "Zago0413", 
    server: "localhost",
    database: "ClinicaDental",    
    port: 1433,        
    options: {
        encrypt: true,   
        trustServerCertificate: true,
        enableArithAbort: true,
    },
    connectionTimeout: 30000,
    requestTimeout: 30000
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