import { NextResponse } from "next/server";
import { getConnection, sql } from "../../../db/db";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const pool = await getConnection();
    const result = await pool.request()
      .input("id", sql.Int, parseInt(id, 10))
      .query("SELECT * FROM EXPEDIENTES WHERE ExpedienteID = @id");

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: "Expediente no encontrado." }, { status: 404 });
    }

    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching expediente by id:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { MotivoGeneral, ObservacionesGenerales } = await request.json();

    const pool = await getConnection();
    await pool.request()
      .input("id", sql.Int, parseInt(id, 10))
      .input("MotivoGeneral", sql.NVarChar(sql.MAX), MotivoGeneral || null)
      .input("ObservacionesGenerales", sql.NVarChar(sql.MAX), ObservacionesGenerales || null)
      .query(`
        UPDATE EXPEDIENTES
        SET MotivoGeneral = @MotivoGeneral,
            ObservacionesGenerales = @ObservacionesGenerales
        WHERE ExpedienteID = @id
      `);

    return NextResponse.json({ message: "Expediente actualizado correctamente." });
  } catch (error) {
    console.error("Error updating expediente:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
