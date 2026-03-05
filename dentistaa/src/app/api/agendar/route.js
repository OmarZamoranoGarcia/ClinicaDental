import { NextResponse } from "next/server";
import sql from "mssql";

const sqlConfig = {
    user: "sa",
    password: "Inge2025@",
    server: "TIJ1WK004005\\SQLEXPRESS",
    database: "citas_db",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export async function POST(request) {
    try {
        const body = await request.json();

        const pool = await sql.connect(sqlConfig);

        await pool.request()
            .input("nombre", sql.VarChar, body.nombre)
            .input("telefono", sql.VarChar, body.telefono)
            .input("correo", sql.VarChar, body.correo)
            .input("fecha", sql.VarChar, body.fecha)
            .input("hora", sql.VarChar, body.hora)
            .input("motivo", sql.VarChar(sql.MAX), body.motivo)
            .query(`
                INSERT INTO citas (nombre, telefono, correo, fecha, hora, motivo)
                VALUES (@nombre, @telefono, @correo, @fecha, @hora, @motivo)
            `);

        return NextResponse.json({ message: "Cita agendada correctamente" });
    } catch (error) {
        console.error("ERROR EN API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
