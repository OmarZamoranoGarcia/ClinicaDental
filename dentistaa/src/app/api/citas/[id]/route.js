// app/api/citas/[id]/route.js
import { getConnection } from '../../../db/db';

export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const pool = await getConnection();
        
        await pool.request()
            .input('id', id)
            .query('DELETE FROM CITAS WHERE CitaID = @id');
        
        return Response.json({ success: true });
    } catch (error) {
        console.error('Error al eliminar cita:', error);
        return Response.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const { pacienteID, servicioID, usuarioID, fechaCita, horaCita, estado, notas } = await request.json();
        
        const pool = await getConnection();
        
        await pool.request()
            .input('id', id)
            .input('pacienteID', pacienteID)
            .input('servicioID', servicioID)
            .input('usuarioID', usuarioID)
            .input('fechaCita', fechaCita)
            .input('horaCita', horaCita)
            .input('estado', estado)
            .input('notas', notas)
            .query(`
                UPDATE CITAS 
                SET PacienteID = @pacienteID,
                    ServicioID = @servicioID,
                    UsuarioID = @usuarioID,
                    FechaCita = @fechaCita,
                    HoraCita = @horaCita,
                    Estado = @estado,
                    Notas = @notas
                WHERE CitaID = @id
            `);
        
        return Response.json({ success: true });
    } catch (error) {
        console.error('Error al actualizar cita:', error);
        return Response.json({ error: 'Error del servidor' }, { status: 500 });
    }
}