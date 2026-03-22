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
                CONVERT(VARCHAR(5), HoraCita, 108) as HoraCita,
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
        
        // Validaciones básicas
        if (!servicioID || !usuarioID || !fechaCita || !horaCita) {
            return Response.json(
                { error: 'Servicio, dentista, fecha y hora son requeridos' },
                { status: 400 }
            );
        }
        
        const pool = await getConnection();
        
        // 1. Verificar que el dentista existe y tiene rol 2 (doctor)
        const doctorCheck = await pool.request()
            .input('usuarioID', usuarioID)
            .query(`
                SELECT u.UsuarioID, r.NombreRol 
                FROM USUARIOS u
                INNER JOIN ROLES r ON u.RolID = r.RolID
                WHERE u.UsuarioID = @usuarioID AND u.Activo = 1 AND r.RolID = 2
            `);
        
        if (doctorCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El dentista seleccionado no es válido o no está activo' },
                { status: 400 }
            );
        }
        
        // 2. Verificar que el servicio existe
        const servicioCheck = await pool.request()
            .input('servicioID', servicioID)
            .query('SELECT ServicioID FROM SERVICIOS WHERE ServicioID = @servicioID AND Activo = 1');
        
        if (servicioCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El servicio seleccionado no existe o no está disponible' },
                { status: 400 }
            );
        }
        
        // 3. Determinar el pacienteID según quién hace la petición
        // IMPORTANTE: Aquí debes obtener el usuario de la sesión/token
        // Por ahora, asumimos que si no viene pacienteID, es un paciente agendando
        let finalPacienteID = pacienteID;
        
        if (!finalPacienteID) {
            // Si no viene pacienteID, debe ser un paciente agendando
            // Aquí deberías obtener el PacienteID de la sesión del usuario logueado
            // Por ahora, devolvemos error, pero en producción lo tomarías del token
            return Response.json(
                { error: 'No se pudo identificar al paciente. Por favor inicia sesión nuevamente.' },
                { status: 401 }
            );
        }
        
        // Verificar que el paciente existe
        const pacienteCheck = await pool.request()
            .input('pacienteID', finalPacienteID)
            .query('SELECT PacienteID FROM PACIENTES WHERE PacienteID = @pacienteID AND Activo = 1');
        
        if (pacienteCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El paciente seleccionado no existe o está inactivo' },
                { status: 400 }
            );
        }
        
        // 4. Verificar que no exista una cita en el mismo día y hora para el mismo dentista
        const citaExistente = await pool.request()
            .input('usuarioID', usuarioID)
            .input('fechaCita', fechaCita)
            .input('horaCita', horaCita)
            .query(`
                SELECT CitaID FROM CITAS 
                WHERE UsuarioID = @usuarioID 
                AND FechaCita = @fechaCita 
                AND HoraCita = @horaCita
            `);
        
        if (citaExistente.recordset.length > 0) {
            return Response.json(
                { error: 'El dentista ya tiene una cita agendada en ese horario' },
                { status: 400 }
            );
        }
        
        // 5. Insertar nueva cita
        await pool.request()
            .input('pacienteID', finalPacienteID)
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