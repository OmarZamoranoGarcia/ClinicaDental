// app/api/servicios/route.js
import { getConnection } from '../../db/db';

// GET - Obtener todos los servicios
export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`
            SELECT 
                ServicioID,
                NombreServicio,
                Descripcion,
                DuracionMinutos,
                Precio,
                Activo
            FROM SERVICIOS
            ORDER BY NombreServicio
        `);
        
        return Response.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        return Response.json({ error: 'Error del servidor' }, { status: 500 });
    }
}

// POST - Crear un nuevo servicio
export async function POST(request) {
    try {
        const { NombreServicio, Descripcion, DuracionMinutos, Precio, Activo } = await request.json();
        
        // Validaciones
        if (!NombreServicio) {
            return Response.json(
                { error: 'El nombre del servicio es requerido' },
                { status: 400 }
            );
        }
        if (!Precio || Precio < 0) {
            return Response.json(
                { error: 'El precio es requerido y debe ser mayor o igual a 0' },
                { status: 400 }
            );
        }
        if (!DuracionMinutos || DuracionMinutos <= 0) {
            return Response.json(
                { error: 'La duración es requerida y debe ser mayor a 0 minutos' },
                { status: 400 }
            );
        }
        
        const pool = await getConnection();
        
        // Verificar si ya existe un servicio con el mismo nombre
        const existeCheck = await pool.request()
            .input('nombre', NombreServicio)
            .query('SELECT ServicioID FROM SERVICIOS WHERE NombreServicio = @nombre');
        
        if (existeCheck.recordset.length > 0) {
            return Response.json(
                { error: 'Ya existe un servicio con ese nombre' },
                { status: 400 }
            );
        }
        
        // Insertar nuevo servicio
        await pool.request()
            .input('nombre', NombreServicio)
            .input('descripcion', Descripcion || null)
            .input('duracion', DuracionMinutos)
            .input('precio', Precio)
            .input('activo', Activo !== undefined ? Activo : 1)
            .query(`
                INSERT INTO SERVICIOS (NombreServicio, Descripcion, DuracionMinutos, Precio, Activo)
                VALUES (@nombre, @descripcion, @duracion, @precio, @activo)
            `);
        
        return Response.json(
            { success: true, message: 'Servicio creado correctamente' },
            { status: 201 }
        );
        
    } catch (error) {
        console.error('Error al crear servicio:', error);
        return Response.json(
            { error: 'Error del servidor' },
            { status: 500 }
        );
    }
}

// PATCH - Actualizar un servicio (por ID en la URL)
export async function PATCH(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        
        if (!id) {
            return Response.json(
                { error: 'ID del servicio es requerido' },
                { status: 400 }
            );
        }
        
        const { NombreServicio, Descripcion, DuracionMinutos, Precio, Activo } = await request.json();
        
        const pool = await getConnection();
        
        // Verificar que el servicio existe
        const existeCheck = await pool.request()
            .input('id', id)
            .query('SELECT ServicioID FROM SERVICIOS WHERE ServicioID = @id');
        
        if (existeCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El servicio no existe' },
                { status: 404 }
            );
        }
        
        // Verificar que el nuevo nombre no exista en otro servicio
        if (NombreServicio) {
            const nombreCheck = await pool.request()
                .input('nombre', NombreServicio)
                .input('id', id)
                .query('SELECT ServicioID FROM SERVICIOS WHERE NombreServicio = @nombre AND ServicioID != @id');
            
            if (nombreCheck.recordset.length > 0) {
                return Response.json(
                    { error: 'Ya existe otro servicio con ese nombre' },
                    { status: 400 }
                );
            }
        }
        
        // Construir la consulta de actualización
        let updates = [];
        if (NombreServicio !== undefined) updates.push('NombreServicio = @nombre');
        if (Descripcion !== undefined) updates.push('Descripcion = @descripcion');
        if (DuracionMinutos !== undefined) updates.push('DuracionMinutos = @duracion');
        if (Precio !== undefined) updates.push('Precio = @precio');
        if (Activo !== undefined) updates.push('Activo = @activo');
        
        if (updates.length === 0) {
            return Response.json(
                { error: 'No hay campos para actualizar' },
                { status: 400 }
            );
        }
        
        const query = `UPDATE SERVICIOS SET ${updates.join(', ')} WHERE ServicioID = @id`;
        
        const requestDB = pool.request()
            .input('id', id);
        
        if (NombreServicio !== undefined) requestDB.input('nombre', NombreServicio);
        if (Descripcion !== undefined) requestDB.input('descripcion', Descripcion);
        if (DuracionMinutos !== undefined) requestDB.input('duracion', DuracionMinutos);
        if (Precio !== undefined) requestDB.input('precio', Precio);
        if (Activo !== undefined) requestDB.input('activo', Activo);
        
        await requestDB.query(query);
        
        return Response.json(
            { success: true, message: 'Servicio actualizado correctamente' },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        return Response.json(
            { error: 'Error del servidor' },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar un servicio (por ID en la URL)
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');
        
        if (!id) {
            return Response.json(
                { error: 'ID del servicio es requerido' },
                { status: 400 }
            );
        }
        
        const pool = await getConnection();
        
        // Verificar que el servicio existe
        const existeCheck = await pool.request()
            .input('id', id)
            .query('SELECT ServicioID FROM SERVICIOS WHERE ServicioID = @id');
        
        if (existeCheck.recordset.length === 0) {
            return Response.json(
                { error: 'El servicio no existe' },
                { status: 404 }
            );
        }
        
        // Verificar si el servicio tiene citas asociadas
        const citasCheck = await pool.request()
            .input('id', id)
            .query('SELECT CitaID FROM CITAS WHERE ServicioID = @id');
        
        if (citasCheck.recordset.length > 0) {
            return Response.json(
                { error: 'No se puede eliminar el servicio porque tiene citas asociadas' },
                { status: 400 }
            );
        }
        
        // Eliminar servicio (borrado físico)
        await pool.request()
            .input('id', id)
            .query('DELETE FROM SERVICIOS WHERE ServicioID = @id');
        
        return Response.json(
            { success: true, message: 'Servicio eliminado correctamente' },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        return Response.json(
            { error: 'Error del servidor' },
            { status: 500 }
        );
    }
}