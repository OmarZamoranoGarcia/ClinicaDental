// src/testDB.js
import { getConnection } from './app/db/db.js';

async function testConnection() {
    console.log('🔍 Probando conexión a la base de datos...\n');
    
    try {
        const pool = await getConnection();
        
        // Prueba 1: Obtener fecha y versión
        const result = await pool.request().query(`
            SELECT 
                GETDATE() as fecha_servidor,
                DB_NAME() as base_datos_actual,
                USER_NAME() as usuario_actual
        `);
        
        console.log('CONEXIÓN EXITOSA!\n');
        console.log('Fecha del servidor:', result.recordset[0].fecha_servidor);
        console.log('Base de datos actual:', result.recordset[0].base_datos_actual);
        console.log('Usuario conectado:', result.recordset[0].usuario_actual);
        
        // Prueba 2: Verificar tablas
        const tables = await pool.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
        `);
        
        console.log('\n📋 Tablas encontradas:');
        if (tables.recordset.length > 0) {
            tables.recordset.forEach(table => {
                console.log(`   - ${table.TABLE_NAME}`);
            });
        } else {
            console.log('   No hay tablas creadas aún');
        }
        
        console.log('\nBase de datos lista para usar!');
        
    } catch (error) {
        console.error('ERROR DE CONEXIÓN:\n');
        console.error('Mensaje:', error.message);
        
        if (error.code === 'ELOGIN') {
            console.error('\n💡 Error de autenticación:');
            console.error('1. Verifica que el usuario "sa" esté habilitado');
            console.error('2. Confirma la contraseña sea correcta');
            console.error('3. En SSMS, verifica que puedas conectarte con esas credenciales');
        } else if (error.code === 'ESOCKET') {
            console.error('\n💡 Error de red:');
            console.error('1. Verifica que SQL Server esté corriendo');
            console.error('2. Confirma que el puerto 1433 esté habilitado');
            console.error('3. Revisa que el nombre del servidor sea correcto');
        }
    }
}

testConnection();