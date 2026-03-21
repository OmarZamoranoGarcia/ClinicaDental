// app/api/servicios/route.js
import { getConnection } from '../../db/db';

export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT ServicioID, NombreServicio 
            FROM SERVICIOS 
            WHERE Activo = 1
            ORDER BY NombreServicio
        `);
        return Response.json(result.recordset);
    } catch (error) {
        return Response.json({ error: 'Error' }, { status: 500 });
    }
}