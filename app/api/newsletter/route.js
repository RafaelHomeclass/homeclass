import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "E-mail obrigatório" }, { status: 400 });
    }

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;

    if (!apiKey || !audienceId) {
      return NextResponse.json({ error: "Configuração Mailchimp ausente" }, { status: 500 });
    }

    const dataCenter = apiKey.split("-")[1]; // pega o DC da chave

    // Mailchimp exige Basic Auth
    const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");

    const res = await fetch(`https://${dataCenter}.api.mailchimp.com/3.0/lists/${audienceId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Erro Mailchimp:", error);
      return NextResponse.json({ error: error.detail || "Erro ao cadastrar" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
