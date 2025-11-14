"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaEuroSign, FaDollarSign, FaBrazilianRealSign } from "react-icons/fa6";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { empreendimentosData } from "@/data/empreendimentos";
import { translations } from "@/lib/translations";
import Newsletter from "./components/Newsletter";
import Formulario from "./components/Formulario";

// Componentes SVG para as bandeiras
const BRFlag = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#009738" />
    <path fill="#ffdf00" d="M256 51.3L460.7 256 256 460.7 51.3 256z" />
    <circle cx="256" cy="256" r="120" fill="#012169" />
    <path fill="#009738" d="M256 160c-11.4 0-22.3 2.1-32.3 6.1l-68.4-68.4-11 11 68.4 68.4c-4 10-6.1 20.9-6.1 32.3 0 52.9 43.1 96 96 96s96-43.1 96-96-43.1-96-96-96z" />
    <path fill="#fff" d="M256 192c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z" />
  </svg>
);

const USFlag = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#b22234" />
    <rect width="512" height="352" fill="#fff" />
    <rect width="512" height="256" fill="#b22234" />
    <rect width="512" height="160" fill="#fff" />
    <rect width="512" height="64" fill="#b22234" />
    <rect width="256" height="256" fill="#3c3b6e" />
    <g fill="#fff">
      <path d="M74.8 19.2l12.4 38.3 40.2-12.7-27.4 30.1 12.4 38.3-27.4-30.1-40.2 12.7 12.4-38.3-27.4-30.1 40.2 12.7zM140.8 19.2l12.4 38.3 40.2-12.7-27.4 30.1 12.4 38.3-27.4-30.1-40.2 12.7 12.4-38.3-27.4-30.1 40.2 12.7z" />
    </g>
  </svg>
);

const ESFlag = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#aa151b" />
    <rect y="128" width="512" height="256" fill="#ffc400" />
    <rect y="128" width="512" height="64" fill="#aa151b" />
    <rect y="320" width="512" height="64" fill="#aa151b" />
    <g transform="translate(192, 192) scale(0.6)">
      <g fill="#fff" stroke="#000" strokeWidth="2">
        <path d="M128 32c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64z" />
        <path fill="#c40026" d="M128 48c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z" />
        <path fill="#ffc400" d="M128 64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32z" />
        <path d="M112 96h32v16h-32z" />
      </g>
    </g>
  </svg>
);

export default function Home() {
  const [step, setStep] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState(null);
  const [currentMoeda, setCurrentMoeda] = useState('BRL');
  const [currentIdioma, setCurrentIdioma] = useState('PT'); // Este estado agora controla tudo
  const [lightboxImageIndex, setLightboxImageIndex] = useState(null);
  const lang = 'PT'; // pode vir de um context, cookie ou rota (/en, /es)
  const t = translations[lang];
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    pais: '',
    cidade: '',
    ticket: '',
    objetivo: ''
  });

  const [conversionRates, setConversionRates] = useState({
    'BRL': 1,
    'USD': 0.18, // Valor padrão/fallback
    'EUR': 0.17, // Valor padrão/fallback
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('/api/rates');
        if (!response.ok) {
          throw new Error('Falha ao buscar taxas locais');
        }
        const rates = await response.json();
        setConversionRates(rates);
      } catch (error) {
        console.error("Não foi possível carregar as taxas de câmbio:", error);
      }
    })();
  }, []);


  // Pega o objeto de tradução correto com base no estado 'currentIdioma'
  const content = translations[currentIdioma];

  // Atualize a função formatPrice para usar o ESTADO
  const formatPrice = (priceBRL) => {
    if (!priceBRL) {
      return content.precoSobConsulta || "Valor sob consulta";
    }

    // USA O ESTADO 'conversionRates' AQUI
    const rate = conversionRates[currentMoeda];
    const convertedPrice = priceBRL * rate;

    const localeMap = {
      'PT': 'pt-BR',
      'EN': 'en-US',
      'ES': 'es-ES',
    };
    const locale = localeMap[currentIdioma] || 'pt-BR';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currentMoeda,
      minimumFractionDigits: 2,
    }).format(convertedPrice);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", formData);
    alert("Formulário enviado com sucesso!");
  };

  const openModal = (id) => {
    setSelectedEmpreendimento(empreendimentosData.find(emp => emp.id === id));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEmpreendimento(null);
    setLightboxImageIndex(null);
  };
  const goToNextImage = (e) => {
    e.stopPropagation();
    if (selectedEmpreendimento) {
      const totalImages = selectedEmpreendimento.images.length;
      setLightboxImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }
  };

  const goToPrevImage = (e) => {
    e.stopPropagation();
    if (selectedEmpreendimento) {
      const totalImages = selectedEmpreendimento.images.length;
      setLightboxImageIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
    }
  };

  const moedasOptions = [
    { value: 'BRL', label: 'R$ BRL', icon: <FaBrazilianRealSign className="text-orange-600" /> },
    { value: 'USD', label: '$ USD', icon: <FaDollarSign className="text-orange-600" /> },
    { value: 'EUR', label: '€ EUR', icon: <FaEuroSign className="text-orange-600" /> },
  ];

  const idiomasOptions = [
    { value: 'PT', label: 'PT', icon: <BRFlag className="w-5 h-5" /> },
    { value: 'EN', label: 'EN', icon: <USFlag className="w-5 h-5" /> },
    { value: 'ES', label: 'ES', icon: <ESFlag className="w-5 h-5" /> },
  ];

  {
    (() => {
      // 1. Separa os dados em duas listas
      const goianiaEmpreendimentos = empreendimentosData.filter(e =>
        e.location.PT.includes("Goiânia")
      );
      const balnearioEmpreendimentos = empreendimentosData.filter(e =>
        e.location.PT.includes("Balneário Camboriú")
      );

      // 2. Cria uma função limpa para renderizar o card (evita repetição)
      const renderEmpreendimentoCard = (empreendimento) => (
        <div key={empreendimento.id}>
          {/* REQUISIÇÃO 1: Nome do empreendimento em cima */}
          <h4 className="text-xl font-serif font-semibold text-orange-500 mb-3 text-center min-h-[64px] flex items-center justify-center px-2">
            {empreendimento.title[currentIdioma]}
          </h4>

          {/* Card da Imagem (clicável) */}
          <div
            className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-xl"
            onClick={() => openModal(empreendimento.id)}
          >
            <Image
              src={empreendimento.coverImage}
              alt={empreendimento.title[currentIdioma]}
              width={600}
              height={400}
              className="object-cover w-full h-72 lg:h-80 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-white font-sans font-semibold text-lg tracking-wide">{content.empreendimentosVerDetalhes}</span>
            </div>
          </div>
        </div>
      );

      globalThis.goianiaEmpreendimentos = goianiaEmpreendimentos;
      globalThis.balnearioEmpreendimentos = balnearioEmpreendimentos;
      globalThis.renderEmpreendimentoCard = renderEmpreendimentoCard;
    })()
  }

  return (
    <main className="font-sans text-gray-900">
      {/* Menu */}
      <header className="flex justify-between items-center px-6 py-4 bg-black shadow-md sticky top-0 z-50">
        <img src="/image/Logohome-.png" alt="Logo da Home" className="w-28" />
        <nav className="hidden md:flex gap-6 text-base text-white font-sans font-medium">
          {/* TEXTOS ATUALIZADOS */}
          <a href="#empreendimentos" className="hover:text-orange-600 transition-colors">
            {content.navEmpreendimentos}
          </a>
          <a href="#cadastro" className="hover:text-orange-600 transition-colors">
            {content.navCadastro}
          </a>
          <a href="#mercado" className="hover:text-orange-600 transition-colors">
            {content.navMercado}
          </a>
          <a href="#newsletter" className="hover:text-orange-600 transition-colors">
            {content.navNewsletter}
          </a>
        </nav>
        <div className="flex gap-3 items-center text-sm font-sans">
          {/* Seletor de Moeda */}
          <div className="relative inline-flex items-center group">
            <select
              value={currentMoeda}
              onChange={(e) => setCurrentMoeda(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-9 py-2 text-gray-700 font-sans cursor-pointer shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
            >
              {moedasOptions.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500 group-hover:text-orange-600">
              {moedasOptions.find(m => m.value === currentMoeda)?.icon}
            </div>
          </div>

          {/* Seletor de Idioma */}
          <div className="relative inline-flex items-center group">
            <select
              value={currentIdioma}
              onChange={(e) => setCurrentIdioma(e.target.value)} // Este onChange atualiza o estado
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-9 py-2 text-gray-700 font-sans cursor-pointer shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
            >
              {idiomasOptions.map((i) => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-gray-500 group-hover:text-orange-600">
              {idiomasOptions.find(i => i.value === currentIdioma)?.icon}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center text-center text-white bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/video-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="video/videogo.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 max-w-2xl p-6 bg-black bg-opacity-30 rounded-lg backdrop-blur-sm">
          {/* TEXTOS ATUALIZADOS */}
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight">
            <span className="font-bold text-orange-500 text-7xl">{content.heroTitleHighlight}</span> {content.heroTitleStart}
          </h1>
          <p className="mt-4 text-lg md:text-xl font-sans">
            {content.heroSubtitle}
          </p>
          <a
            href="#cadastro"
            className="mt-6 inline-block bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full text-lg font-sans font-semibold transition-all duration-300 transform hover:scale-105"
          >
            {content.heroButton}
          </a>
        </div>
      </section>

      {/* Informações sobre a Home Class */}
      <section className="py-20 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-serif font-bold mb-12">{content.homeClassTitle}</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* TEXTOS ATUALIZADOS */}
          <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-sans font-semibold text-lg mb-2 text-orange-500">{content.hcAssessoriaTitle}</h3>
            <p className="font-sans text-gray-600">{content.hcAssessoriaText}</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-sans font-semibold text-lg mb-2 text-orange-500">{content.hcCarteiraTitle}</h3>
            <p className="font-sans text-gray-600">{content.hcCarteiraText}</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-sans font-semibold text-lg mb-2 text-orange-500">{content.hcAnaliseTitle}</h3>
            <p className="font-sans text-gray-600">{content.hcAnaliseText}</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-sans font-semibold text-lg mb-2 text-orange-500">{content.hcMarketingTitle}</h3>
            <p className="font-sans text-gray-600">{content.hcMarketingText}</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-sans font-semibold text-lg mb-2 text-orange-500">{content.hcTransparenciaTitle}</h3>
            <p className="font-sans text-gray-600">{content.hcTransparenciaText}</p>
          </div>
          <div className="p-8 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-sans font-semibold text-lg mb-2 text-orange-500">{content.hcSuporteTitle}</h3>
            <p className="font-sans text-gray-600">{content.hcSuporteText}</p>
          </div>
        </div>
      </section>

      {/* Empreendimentos */}
      <section className="py-16 px-6" id="empreendimentos">
        <h2 className="text-3xl font-serif font-bold mb-12 text-center text-white">{content.empreendimentosTitle}</h2>
        <h3 className="text-2xl font-serif font-bold mt-10 mb-10 text-center text-white">
          Goiânia
        </h3>

        {/* Grid 1: Goiânia */}
        {/* Ajustei o gap-y (vertical) para 10 para dar espaço ao novo título h4 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-6xl mx-auto">
          {globalThis.goianiaEmpreendimentos.map(globalThis.renderEmpreendimentoCard)}
        </div>

        {/* REQUISIÇÃO 2: Separador e Grid de Balneário */}
        {globalThis.balnearioEmpreendimentos.length > 0 && (
          <>
            {/* Título Separador */}
            <h3 className="text-2xl font-serif font-bold mt-20 mb-10 text-center text-white">
              Balneário Camboriú
            </h3>

            {/* Grid 2: Balneário */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 max-w-6xl mx-auto">
              {globalThis.balnearioEmpreendimentos.map(globalThis.renderEmpreendimentoCard)}
            </div>
          </>
        )}
      </section>

      {/* Informações sobre o Mercado Imobiliário */}
      <section className="py-16 px-6 bg-white" id="mercado">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-center mb-8">{content.mercadoTitle}</h2>
          <p className="text-lg text-center mb-12 text-gray-600 font-sans">
            {content.mercadoSubtitle}
          </p>
          <div className="grid md:grid-cols-2 gap-12">
            {/* TEXTOS ATUALIZADOS */}
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-serif font-bold mb-4 text-orange-600">{content.mercadoGynTitle}</h3>
              <p className="font-sans text-gray-600">
                {content.mercadoGynText}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-serif font-bold mb-4 text-orange-600">{content.mercadoBcTitle}</h3>
              <p className="font-sans text-gray-600">
                {content.mercadoBcText}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-serif font-bold mb-4 text-orange-600">{content.mercadoGynTitle2}</h3>
              <p className="font-sans text-gray-600">
                {content.mercadoGynText2}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-serif font-bold mb-4 text-orange-600">{content.mercadoBcTitle2}</h3>
              <p className="font-sans text-gray-600">
                {content.mercadoBcText2}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-serif font-bold mb-4 text-orange-600">{content.mercadoGynTitle3}</h3>
              <p className="font-sans text-gray-600">
                {content.mercadoGynText3}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-2xl text-center">
              <h3 className="text-2xl font-serif font-bold mb-4 text-orange-600">{content.mercadoBcTitle3}</h3>
              <p className="font-sans text-gray-600">
                {content.mercadoBcText3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Cadastro */}
      <Formulario content={content} />

      {/* Newsletter */}
      <Newsletter content={content} />

      {/* Última Chamada */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-serif font-bold mb-4">{content.ctaTitle}</h2>
        <p className="mb-6 text-gray-300 font-sans">{content.ctaText}</p>
        <a
          href="#cadastro"
          className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-full text-lg font-sans font-semibold transition-all duration-300 transform hover:scale-105"
        >
          {content.ctaButton}
        </a>
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center">
        <p className="font-sans">{content.footerCopyright}</p>
        <div className="flex justify-center gap-6 mt-4 font-sans">
          {/* WhatsApp */}
          <a
            href="https://wa.me/55629139-3737"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-green-500 transition-colors flex items-center gap-2"
          >
            <FaWhatsapp className="text-lg" />
            {content.footerWhatsapp}
          </a>

          {/* E-mail */}
          <a
            href="mailto:soares@homeclass.imb.br"
            className="hover:text-red-400 transition-colors flex items-center gap-2"
          >
            <MdEmail className="text-lg" />
            {content.footerEmail}
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com/homeclass.imob"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition-colors flex items-center gap-2"
          >
            <FaInstagram className="text-lg" />
            {content.footerInstagram}
          </a>
        </div>
      </footer>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white p-6 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold z-10"
            >
              &times;
            </button>
            {selectedEmpreendimento && (
              <div>
                <h3 className="text-2xl font-serif font-bold mb-2">{selectedEmpreendimento.title[currentIdioma]}</h3>
                <p className="text-gray-500 mb-4 font-sans">{selectedEmpreendimento.location[currentIdioma]}</p>
                <p className="text-gray-700 mb-6 font-sans">{selectedEmpreendimento.description[currentIdioma]}</p>
                <p className="text-2xl font-sans font-bold text-orange-600 mb-4">
                  {selectedEmpreendimento.priceBRL && selectedEmpreendimento.priceBRL > 0 ? (
                    <>
                      <span className="font-medium">
                        {translations[currentIdioma].precoAPartirDe}
                      </span>
                      {' '}
                      {formatPrice(selectedEmpreendimento.priceBRL)}
                    </>
                  ) : (
                    <span className="font-medium">
                      {translations[currentIdioma].precoSobConsulta}
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedEmpreendimento.images.map((img, index) => (
                    <div key={index} className="relative w-full h-64 sm:h-72 lg:h-80">
                      <Image
                        src={img}
                        alt={`${selectedEmpreendimento.title[currentIdioma]} imagem ${index + 1}`}
                        fill
                        className="object-cover rounded-lg shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setLightboxImageIndex(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox*/}
      {lightboxImageIndex !== null && selectedEmpreendimento && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4 font-sans"
          onClick={() => setLightboxImageIndex(null)}
        >
          <button
            onClick={() => setLightboxImageIndex(null)}
            className="absolute top-6 right-6 text-white text-4xl font-bold z-[70] hover:text-gray-300"
          >
            &times;
          </button>
          <div
            className="relative w-full max-w-6xl h-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedEmpreendimento.images[lightboxImageIndex]}
              alt={`Imagem ampliada ${lightboxImageIndex + 1}`}
              fill
              style={{ objectFit: 'contain' }}
              className="rounded-lg"
              priority={true}
            />
          </div>
          {selectedEmpreendimento.images.length > 1 && (
            <>
              <button
                onClick={goToPrevImage}
                className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 z-[70] bg-white/20 p-3 rounded-full text-white hover:bg-white/40 transition-colors"
                aria-label="Imagem anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={goToNextImage}
                className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 z-[70] bg-white/20 p-3 rounded-full text-white hover:bg-white/40 transition-colors"
                aria-label="Próxima imagem"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}
    </main>
  );
}