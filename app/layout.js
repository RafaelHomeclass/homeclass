// app/layout.js
import './globals.css';
import { Cormorant_Garamond, Roboto } from 'next/font/google';

// Títulos: uma fonte serifada que transmite elegância e sofisticação
const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-cormorant',
});

// Corpo do texto: uma fonte sans-serif limpa e altamente legível
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

export const metadata = {
  title: 'HomeClass - Oportunidades de Alto Padrão em Imóveis',
  description: 'Descubra 7 oportunidades exclusivas de altíssimo padrão em Goiânia e Balneário Camboriú. Valorização comprovada, arquitetura internacional e unidades limitadas.',
  robots: 'index, follow',
  openGraph: {
    title: 'HomeClass',
    description: 'Imóveis de luxo com alto potencial de valorização.',
    url: 'https://homeclass.com.br',
    siteName: 'HomeClass',
    images: [
      {
        url: 'https://homeclass.com.br/og-image.jpg', // Adicione uma imagem de prévia
        width: 1200,
        height: 630,
        alt: 'Imóveis de Luxo HomeClass',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HomeClass',
    description: 'Imóveis de luxo com alto potencial de valorização.',
    images: ['https://homeclass.com.br/og-image.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${cormorantGaramond.variable} ${roboto.variable}`}>
      <body>{children}</body>
    </html>
  );
}