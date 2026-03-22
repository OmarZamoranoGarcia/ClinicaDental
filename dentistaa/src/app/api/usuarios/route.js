// app/api/usuarios/route.js
import { getConnection } from '../../db/db';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const rol = searchParams.get('rol');
        
        const pool = await getConnection();
        
        let query = `
            SELECT u.UsuarioID, u.NombreCompleto, u.NombreUsuario, r.NombreRol, r.RolID
            FROM USUARIOS u
            INNER JOIN ROLES r ON u.RolID = r.RolID
            WHERE u.Activo = 1
        `;
        
        // Si se pide filtrar por rol específico
        if (rol) {
            query += ` AND r.RolID = @rol`;
        }
        
        query += ` ORDER BY u.NombreCompleto`;
        
        const requestDB = pool.request();
        if (rol) {
            requestDB.input('rol', rol);
        }
        
        const result = await requestDB.query(query);
        
        return Response.json(result.recordset);
    } catch (error) {
        console.error('Error en API usuarios:', error);
        return Response.json([]);
    }
}