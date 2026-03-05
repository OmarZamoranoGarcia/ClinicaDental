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

export async function DELETE(request, { params }) {
    // Desenvuelve correctamente los parámetros usando await
    const { id } = await params; // Desenvuelve 'params' para obtener 'id'

    console.log("ID recibido para eliminar:", id); // Verifica el id recibido

    try {
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request()
            .input("id", sql.Int, id)  // Asegúrate de que el 'id' esté correctamente asignado
            .query("DELETE FROM citas WHERE id = @id");

        console.log("Resultado de la eliminación:", result); // Verifica el resultado de la eliminación

        if (result.rowsAffected[0] === 0) {
            return NextResponse.json({ message: "No se encontró la cita con el ID especificado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Cita eliminada correctamente" });

    } catch (error) {
        console.error("Error SQL:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const body = await request.json();

    // Resolviendo la promesa 'params' para obtener 'id'
    const { id } = await params;  // Desempaquetamos params para obtener el id

    console.log("Datos recibidos para actualizar:", body); // Verifica que los datos sean correctos
    console.log("ID recibido para actualización:", id); // Verifica que el id recibido es el correcto

    try {
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request()
            .input("id", sql.Int, id) // Usamos el id ya resuelto
            .input("nombre", sql.VarChar, body.nombre)
            .input("telefono", sql.VarChar, body.telefono)
            .input("correo", sql.VarChar, body.correo)
            .input("fecha", sql.VarChar, body.fecha)
            .input("hora", sql.VarChar, body.hora)
            .input("motivo", sql.VarChar, body.motivo)
            .query(`
                UPDATE citas
                SET nombre=@nombre, telefono=@telefono, correo=@correo, fecha=@fecha, hora=@hora, motivo=@motivo
                WHERE id=@id
            `);

        console.log("Resultado de la actualización:", result); // Verifica el resultado de la consulta

        if (result.rowsAffected[0] === 0) {
            return NextResponse.json({ message: "No se encontró la cita con el ID especificado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Cita actualizada correctamente" });

    } catch (error) {
        console.error("Error SQL:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


