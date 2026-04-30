import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { correoPaciente, nombrePaciente, asunto, cuerpo } = await request.json();

    console.log(`📧 Intentando enviar correo a: ${correoPaciente}, Nombre: ${nombrePaciente}`);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión con Gmail establecida');

    // Enviar correo
    const info = await transporter.sendMail({
      from: `"Clínica Dental" <${process.env.EMAIL_USER}>`,
      to: correoPaciente,
      subject: asunto || `Confirmación de cita - Clínica Dental`,
      html: cuerpo || `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif;">
            <h1 style="color: #2c3e50;">¡Hola ${nombrePaciente}! 🎉</h1>
            <p>Tu cita ha sido <strong>confirmada exitosamente</strong> en ClinicaDental.</p>
            <hr>
            <small>Este es un correo automático, por favor no responder.</small>
          </body>
        </html>
      `,
    });

    console.log('Correo enviado:', info.messageId);
    
    // ✅ IMPORTANTE: Retornar respuesta exitosa
    return NextResponse.json(
      { 
        success: true, 
        message: "Correo enviado correctamente",
        messageId: info.messageId 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error al enviar:", error);
    
    // ✅ Retornar respuesta de error
    return NextResponse.json(
      { 
        success: false, 
        error: "Error al enviar el correo", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}