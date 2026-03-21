// app/api/pacientes/route.js
import { getConnection } from '../../db/db';

export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT PacienteID, NombreCompleto 
            FROM PACIENTES 
            ORDER BY NombreCompleto
        `);
        return Response.json(result.recordset);
    } catch (error) {
        return Response.json({ error: 'Error' }, { status: 500 });
    }
}