// app/api/usuarios/route.js
import { getConnection } from '../../db/db';

export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT u.UsuarioID, u.NombreCompleto, r.NombreRol
            FROM USUARIOS u
            INNER JOIN ROLES r ON u.RolID = r.RolID
            WHERE u.Activo = 1
            ORDER BY u.NombreCompleto
        `);
        return Response.json(result.recordset);
    } catch (error) {
        return Response.json({ error: 'Error' }, { status: 500 });
    }
}