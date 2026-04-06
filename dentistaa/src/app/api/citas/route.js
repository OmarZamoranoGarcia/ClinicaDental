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
        
        // 2. Verificar que el servicio existe y obtener la duración
        const servicioCheck = await pool.request()
            .input('servicioID', servicioID)
            .query('SELECT ServicioID, DuracionMinutos FROM SERVICIOS WHERE ServicioID = @servicioID AND Activo = 1');
        
        if (servicioCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El servicio seleccionado no existe o no está disponible' },
                { status: 400 }
            );
        }

        const duracionMinutos = servicioCheck.recordset[0].DuracionMinutos;
        const getTimeString = (time) => {
            if (typeof time === 'string') {
                return time.slice(0, 5);
            }
            if (time instanceof Date) {
                return time.toISOString().slice(11, 16);
            }
            return '';
        };

        const timeToMinutes = (time) => {
            const normalized = getTimeString(time);
            const [hours, minutes] = normalized.split(":").map(Number);
            return hours * 60 + minutes;
        };

        const inicioCita = timeToMinutes(horaCita);
        const finCita = inicioCita + duracionMinutos;

        if (inicioCita < 8 * 60 || finCita > 17 * 60) {
            return Response.json(
                { error: 'El horario debe ser entre las 08:00 y las 17:00 según la duración del servicio' },
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

        // 4. Verificar solapamiento de citas para el mismo dentista en el mismo día
        const citasExistentes = await pool.request()
            .input('usuarioID', usuarioID)
            .input('fechaCita', fechaCita)
            .query(`
                SELECT c.CitaID, CONVERT(VARCHAR(5), c.HoraCita, 108) as HoraCita, s.DuracionMinutos
                FROM CITAS c
                INNER JOIN SERVICIOS s ON c.ServicioID = s.ServicioID
                WHERE c.UsuarioID = @usuarioID
                  AND c.FechaCita = @fechaCita
            `);

        const overlap = citasExistentes.recordset.some((cita) => {
            const inicioExistente = timeToMinutes(cita.HoraCita);
            const finExistente = inicioExistente + cita.DuracionMinutos;
            return inicioCita < finExistente && inicioExistente < finCita;
        });

        if (overlap) {
            return Response.json(
                { error: 'El dentista ya tiene una cita que se solapa con el horario seleccionado' },
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