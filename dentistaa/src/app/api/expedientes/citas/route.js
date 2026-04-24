import { NextResponse } from "next/server";
import { getConnection, sql } from "../../../db/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const expedienteID = searchParams.get("expedienteID");

  if (!expedienteID) {
    return NextResponse.json({ error: "Se requiere expedienteID." }, { status: 400 });
  }

  try {
    const pool = await getConnection();
    const result = await pool.request()
      .input("expedienteID", sql.Int, parseInt(expedienteID, 10))
      .query(`
        SELECT
          e.ExpedienteID,
          p.NombreCompleto,
          c.CitaID,
          c.FechaCita,
          CONVERT(VARCHAR(5), c.HoraCita, 108) as HoraCita,
          c.Estado,
          c.Notas
        FROM EXPEDIENTES e
        JOIN PACIENTES p ON e.PacienteID = p.PacienteID
        JOIN CITAS c ON p.PacienteID = c.PacienteID
        WHERE e.ExpedienteID = @expedienteID
        ORDER BY c.FechaCita DESC
      `);

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Error fetching citas for expediente:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
