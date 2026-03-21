// app/api/login/route.js
import { getConnection } from '../../db/db';

export async function POST(request) {
    try {
        const { usuario, password } = await request.json();
        
        // Validar campos
        if (!usuario || !password) {
            return Response.json(
                { success: false, error: 'Usuario y contraseña son requeridos' },
                { status: 400 }
            );
        }
        
        const pool = await getConnection();
        
        // 1. PRIMERO BUSCAR EN USUARIOS (personal: admin, doctor, recepcionista)
        let result = await pool
            .request()
            .input('usuario', usuario)
            .input('password', password)
            .query(`
                SELECT 
                    u.UsuarioID as id,
                    u.NombreCompleto as nombre,
                    u.NombreUsuario as usuario,
                    u.ContrasenaHash,
                    u.Activo,
                    u.RolID as rolId,
                    r.NombreRol as rol,
                    'usuario' as tipo
                FROM USUARIOS u
                INNER JOIN ROLES r ON u.RolID = r.RolID
                WHERE u.NombreUsuario = @usuario AND u.ContrasenaHash = @password
            `);
        
        let usuarioData = result.recordset[0];
        
        // 2. SI NO SE ENCUENTRA EN USUARIOS, BUSCAR EN PACIENTES
        if (!usuarioData) {
            result = await pool
                .request()
                .input('usuario', usuario)
                .input('password', password)
                .query(`
                    SELECT 
                        PacienteID as id,
                        NombreCompleto as nombre,
                        NombreUsuario as usuario,
                        ContrasenaHash,
                        Activo,
                        4 as rolId,
                        'paciente' as rol,
                        'paciente' as tipo
                    FROM PACIENTES
                    WHERE NombreUsuario = @usuario AND ContrasenaHash = @password
                `);
            
            usuarioData = result.recordset[0];
        }
        
        // 3. SI NO SE ENCUENTRA EN NINGUNA, ERROR
        if (!usuarioData) {
            return Response.json(
                { success: false, error: 'Usuario o contraseña incorrectos' },
                { status: 401 }
            );
        }
        
        // Verificar si está activo
        if (!usuarioData.Activo) {
            return Response.json(
                { success: false, error: usuarioData.tipo === 'paciente' ? 'Cuenta desactivada, contacta al administrador' : 'Usuario desactivado' },
                { status: 401 }
            );
        }
        
        // Guardar sesión
        return Response.json({
            success: true,
            usuario: {
                id: usuarioData.id,
                nombre: usuarioData.nombre,
                usuario: usuarioData.usuario,
                rol: usuarioData.rol,
                rolId: usuarioData.rolId,
                tipo: usuarioData.tipo  // 'usuario' o 'paciente'
            }
        });
        
    } catch (error) {
        console.error('Error en login:', error);
        return Response.json(
            { success: false, error: 'Error del servidor' },
            { status: 500 }
        );
    }
}