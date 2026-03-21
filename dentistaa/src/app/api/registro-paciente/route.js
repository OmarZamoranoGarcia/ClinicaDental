// app/api/registro-paciente/route.js
import { getConnection } from '../../db/db';

export async function POST(request) {
    try {
        const { 
            nombreCompleto, 
            email, 
            telefono, 
            fechaNacimiento, 
            direccion, 
            nombreUsuario, 
            contrasena 
        } = await request.json();
        
        // Validar campos requeridos
        if (!nombreCompleto || !email || !nombreUsuario || !contrasena || !fechaNacimiento) {
            return Response.json(
                { error: 'Todos los campos marcados con * son requeridos' },
                { status: 400 }
            );
        }
        
        // Validar longitud de contraseña
        if (contrasena.length < 6) {
            return Response.json(
                { error: 'La contraseña debe tener al menos 6 caracteres' },
                { status: 400 }
            );
        }
        
        const pool = await getConnection();
        
        // Verificar si el email ya existe
        const emailCheck = await pool
            .request()
            .input('email', email)
            .query('SELECT Email FROM PACIENTES WHERE Email = @email');
        
        if (emailCheck.recordset.length > 0) {
            return Response.json(
                { error: 'El correo electrónico ya está registrado' },
                { status: 400 }
            );
        }
        
        // Verificar si el nombre de usuario ya existe
        const userCheck = await pool
            .request()
            .input('nombreUsuario', nombreUsuario)
            .query('SELECT NombreUsuario FROM PACIENTES WHERE NombreUsuario = @nombreUsuario');
        
        if (userCheck.recordset.length > 0) {
            return Response.json(
                { error: 'El nombre de usuario ya está en uso' },
                { status: 400 }
            );
        }
        
        // Insertar nuevo paciente
        const result = await pool
            .request()
            .input('nombreCompleto', nombreCompleto)
            .input('email', email)
            .input('telefono', telefono || null)
            .input('fechaNacimiento', fechaNacimiento)
            .input('direccion', direccion || null)
            .input('nombreUsuario', nombreUsuario)
            .input('contrasena', contrasena) // En producción deberías hashear con bcrypt
            .query(`
                INSERT INTO PACIENTES (NombreCompleto, Email, Telefono, FechaNacimiento, Direccion, NombreUsuario, ContrasenaHash, Activo, FechaRegistro)
                VALUES (@nombreCompleto, @email, @telefono, @fechaNacimiento, @direccion, @nombreUsuario, @contrasena, 1, GETDATE())
            `);
        
        return Response.json({
            success: true,
            message: 'Paciente registrado exitosamente'
        });
        
    } catch (error) {
        console.error('Error en registro de paciente:', error);
        return Response.json(
            { error: 'Error del servidor' },
            { status: 500 }
        );
    }
}