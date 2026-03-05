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

export async function GET() {
    try {
        const pool = await sql.connect(sqlConfig);

        const result = await pool.request().query(`
            SELECT * FROM citas ORDER BY id DESC
        `);

        return NextResponse.json(result.recordset);

    } catch (error) {
        console.error("Error SQL:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
