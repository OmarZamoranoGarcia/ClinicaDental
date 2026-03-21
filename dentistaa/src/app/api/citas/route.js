// app/api/citas/route.js
import { getConnection } from './../../db/db';

export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                CitaID,
                PacienteID,
                ServicioID,
                UsuarioID,
                FechaCita,
                HoraCita,
                Estado,
                Notas,
                FechaCreacion
            FROM CITAS
            ORDER BY FechaCita DESC, HoraCita DESC
        `);
        
        return Response.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener citas:', error);
        return Response.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { pacienteID, servicioID, usuarioID, fechaCita, horaCita, estado, notas } = await request.json();
        
        // Validaciones
        if (!pacienteID || !servicioID || !usuarioID || !fechaCita || !horaCita) {
            return Response.json(
                { error: 'Todos los campos marcados con * son requeridos' },
                { status: 400 }
            );
        }
        
        const pool = await getConnection();
        
        // Verificar que el paciente existe
        const pacienteCheck = await pool.request()
            .input('pacienteID', pacienteID)
            .query('SELECT PacienteID FROM PACIENTES WHERE PacienteID = @pacienteID');
        
        if (pacienteCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El paciente seleccionado no existe' },
                { status: 400 }
            );
        }
        
        // Verificar que el servicio existe
        const servicioCheck = await pool.request()
            .input('servicioID', servicioID)
            .query('SELECT ServicioID FROM SERVICIOS WHERE ServicioID = @servicioID');
        
        if (servicioCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El servicio seleccionado no existe' },
                { status: 400 }
            );
        }
        
        // Verificar que el usuario (dentista) existe
        const usuarioCheck = await pool.request()
            .input('usuarioID', usuarioID)
            .query('SELECT UsuarioID FROM USUARIOS WHERE UsuarioID = @usuarioID AND Activo = 1');
        
        if (usuarioCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El dentista seleccionado no existe o está inactivo' },
                { status: 400 }
            );
        }
        
        // Insertar nueva cita
        const result = await pool.request()
            .input('pacienteID', pacienteID)
            .input('servicioID', servicioID)
            .input('usuarioID', usuarioID)
            .input('fechaCita', fechaCita)
            .input('horaCita', horaCita)
            .input('estado', estado || 'Pendiente')
            .input('notas', notas || null)
            .query(`
                INSERT INTO CITAS (PacienteID, ServicioID, UsuarioID, FechaCita, HoraCita, Estado, Notas, FechaCreacion)
                VALUES (@pacienteID, @servicioID, @usuarioID, @fechaCita, @horaCita, @estado, @notas, GETDATE())
            `);
        
        return Response.json(
            { success: true, message: 'Cita agendada correctamente' },
            { status: 201 }
        );
        
    } catch (error) {
        console.error('Error al crear cita:', error);
        return Response.json(
            { error: 'Error del servidor' },
            { status: 500 }
        );
    }
}