// src/app/api/rates/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Buscamos a cotação na API externa
    // A opcão 'next: { revalidate: 86400 }' faz o Next.js cachear
    // essa resposta por 24 horas (86400 segundos).
    // Isso é o "buscar a conversão diária".
    const response = await fetch(
      'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL',
      {
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error('Falha ao buscar cotação da API externa');
    }

    const data = await response.json();

    // 2. Extraímos os valores de 'venda' (ask)
    const usdAsk = parseFloat(data.USDBRL.ask); // Ex: 5.40 (1 USD = 5.40 BRL)
    const eurAsk = parseFloat(data.EURBRL.ask); // Ex: 5.80 (1 EUR = 5.80 BRL)

    // 3. Calculamos o inverso (quanto 1 BRL vale em USD e EUR)
    // Se 1 USD = 5.40 BRL, então 1 BRL = 1 / 5.40 USD
    const rates = {
      'BRL': 1,
      'USD': 1 / usdAsk, // Ex: 0.185
      'EUR': 1 / eurAsk, // Ex: 0.172
    };

    // 4. Retornamos os valores para o nosso front-end
    return NextResponse.json(rates);

  } catch (error) {
    console.error("Erro na API de cotação:", error);
    // Em caso de erro, retorna valores padrão para não quebrar o site
    return NextResponse.json(
      { 'BRL': 1, 'USD': 0.18, 'EUR': 0.17 },
      { status: 500 }
    );
  }
}