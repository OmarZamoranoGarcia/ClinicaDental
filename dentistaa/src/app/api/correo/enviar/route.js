import { getConnection } from '../../../db/db';

export async function POST(request) {
  try {
    const { usuarioID, rol, asunto, cuerpo } = await request.json();

    // Validar campos requeridos
    if (!usuarioID || !rol) {
      return Response.json(
        { success: false, error: 'usuarioID y rol son requeridos' },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    let email = '';
    let nombre = '';

    // Buscar email según el rol
    if (rol === 'paciente' || rol === 4) {
      // Buscar en tabla PACIENTES
      const result = await pool
        .request()
        .input('PacienteID', usuarioID)
        .query('SELECT Email, NombreCompleto FROM PACIENTES WHERE PacienteID = @PacienteID');
      
      if (result.recordset.length > 0) {
        email = result.recordset[0].Email;
        nombre = result.recordset[0].NombreCompleto;
      }
    } else {
      // Buscar en tabla USUARIOS
      const result = await pool
        .request()
        .input('UsuarioID', usuarioID)
        .query('SELECT Email, NombreCompleto FROM USUARIOS WHERE UsuarioID = @UsuarioID');
      
      if (result.recordset.length > 0) {
        email = result.recordset[0].Email;
        nombre = result.recordset[0].NombreCompleto;
      }
    }

    if (!email) {
      return Response.json(
        { success: false, error: 'No se encontró el email del usuario' },
        { status: 404 }
      );
    }

    console.log(`📧 Correo encontrado: ${email} (${nombre})`);

    // Ahora llamar al endpoint de correo para enviar el correo
    const correoResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/correo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correoPaciente: email,
        nombrePaciente: nombre,
        asunto: asunto || 'Confirmación de cita - Clínica Dental',
        cuerpo: cuerpo
      })
    });

    const correoData = await correoResponse.json();

    if (!correoResponse.ok) {
      console.error('Error al enviar correo:', correoData);
      return Response.json(
        { success: false, error: correoData.error || 'Error al enviar el correo' },
        { status: 500 }
      );
    }

    console.log('Correo enviado exitosamente');

    return Response.json({
      success: true,
      message: 'Correo enviado exitosamente',
      email,
      nombre,
      messageId: correoData.messageId
    });

  } catch (error) {
    console.error('Error al enviar correo:', error);
    return Response.json(
      { success: false, error: 'Error al enviar el correo: ' + error.message },
      { status: 500 }
    );
  }
}
