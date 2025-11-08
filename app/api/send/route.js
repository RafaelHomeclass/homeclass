import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const body = await req.json();
    const { nome, whatsapp, objetivo, email, cidade, investimento } = body;

    // Configurar transporte SMTP do Zoho
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_USER, // seu e-mail Zoho
        pass: process.env.ZOHO_PASS, // senha ou app password
      },
    });

    // Montar o e-mail
    await transporter.sendMail({
      from: `"Landing Page" <${process.env.ZOHO_USER}>`,
      to: process.env.ZOHO_DESTINO, // para onde você quer receber
      subject: 'Novo cadastro no formulário da landing page',
      html: `
        <h2>Novo cadastro recebido</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Objetivo:</strong> ${objetivo}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Cidade/País:</strong> ${cidade}</p>
        <p><strong>Faixa de investimento:</strong> ${investimento}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return Response.json({ success: false, error: error.message });
  }
}
