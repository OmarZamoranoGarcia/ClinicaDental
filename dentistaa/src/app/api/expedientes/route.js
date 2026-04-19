import { NextResponse } from "next/server";
import { getConnection, sql } from "../../db/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const pacienteID = searchParams.get("pacienteID");

  try {
    const pool = await getConnection();
    let query = "SELECT * FROM EXPEDIENTES";
    const requestDb = pool.request();

    if (pacienteID) {
      query += " WHERE PacienteID = @pacienteID";
      requestDb.input("pacienteID", sql.Int, parseInt(pacienteID, 10));
    }

    const result = await requestDb.query(query);
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error("Error fetching expedientes:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { PacienteID, UsuarioID, FechaCreacion, MotivoGeneral, ObservacionesGenerales } = body;

    const pool = await getConnection();
    const requestDb = pool.request();
    requestDb.input("PacienteID", sql.Int, parseInt(PacienteID, 10));
    requestDb.input("UsuarioID", sql.Int, parseInt(UsuarioID, 10));
    requestDb.input("FechaCreacion", sql.DateTime, FechaCreacion);
    requestDb.input("MotivoGeneral", sql.NVarChar(sql.MAX), MotivoGeneral || null);
    requestDb.input("ObservacionesGenerales", sql.NVarChar(sql.MAX), ObservacionesGenerales || null);

    const query = `
      INSERT INTO EXPEDIENTES (PacienteID, UsuarioID, FechaCreacion, MotivoGeneral, ObservacionesGenerales)
      VALUES (@PacienteID, @UsuarioID, @FechaCreacion, @MotivoGeneral, @ObservacionesGenerales)
    `;

    await requestDb.query(query);
    return NextResponse.json({ message: "Expediente creado exitosamente" }, { status: 201 });
  } catch (error) {
    console.error("Error creating expediente:", error);
    const errorMessage = error?.message || "Error interno del servidor";
    if (error?.number === 2627 || error?.number === 2601 || error?.code === "EREQUEST") {
      return NextResponse.json({ error: "Ya existe un expediente para este paciente." }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}