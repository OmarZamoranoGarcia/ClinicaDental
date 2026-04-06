import { getConnection } from '../../../db/db';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const usuarioID = url.searchParams.get('usuarioID');
    const fechaCita = url.searchParams.get('fechaCita');

    if (!usuarioID || !fechaCita) {
      return Response.json(
        { error: 'Se requiere usuarioID y fechaCita para consultar disponibilidad' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const result = await pool.request()
      .input('usuarioID', usuarioID)
      .input('fechaCita', fechaCita)
      .query(`
        SELECT
          c.CitaID,
          CONVERT(VARCHAR(5), c.HoraCita, 108) as HoraCita,
          s.DuracionMinutos
        FROM CITAS c
        INNER JOIN SERVICIOS s ON c.ServicioID = s.ServicioID
        WHERE c.UsuarioID = @usuarioID
          AND c.FechaCita = @fechaCita
        ORDER BY c.HoraCita
      `);

    return Response.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener disponibilidad de citas:', error);
    return Response.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
