'use client';
import { useState } from 'react';

export default function Formulario({ content }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        alert(content.formSuccess || 'Cadastro enviado com sucesso! Entraremos em contato via WhatsApp ✅');
        e.target.reset();
        setStep(1);
      } else {
        alert(content.formError || 'Erro ao enviar o cadastro. Verifique sua conexão.');
      }
    } catch (err) {
      console.error(err);
      alert(content.formError || 'Erro ao enviar o formulário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-gray-100" id="cadastro">
      <h2 className="text-3xl font-serif font-bold mb-8 text-center">{content.formTitle}</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-2xl space-y-6"
      >
        {/* Etapa 1 */}
        <div className={`transition-opacity duration-500 ${step === 1 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
          <input
            name="nome"
            type="text"
            placeholder={content.formNome}
            required
            className="w-full border-b-2 border-gray-300 py-3 focus:border-orange-500 transition-colors"
          />
          <input
            name="whatsapp"
            type="tel"
            placeholder={content.formWhatsapp}
            required
            className="w-full border-b-2 border-gray-300 py-3 mt-4 focus:border-orange-500 transition-colors"
          />
          <select
            name="objetivo"
            required
            className="w-full border-b-2 border-gray-300 py-3 mt-4 focus:border-orange-500 transition-colors"
          >
            <option value="">{content.formObjetivo}</option>
            <option>{content.formObjetivoInvestir}</option>
            <option>{content.formObjetivoMorar}</option>
          </select>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full mt-8 bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            {content.formContinuar}
          </button>
        </div>

        {/* Etapa 2 */}
        <div className={`transition-opacity duration-500 ${step === 2 ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
          <input
            name="email"
            type="email"
            placeholder={content.formEmail}
            required
            className="w-full border-b-2 border-gray-300 py-3 focus:border-orange-500 transition-colors"
          />
          <input
            name="cidade"
            type="text"
            placeholder={content.formCidadePais}
            className="w-full border-b-2 border-gray-300 py-3 mt-4 focus:border-orange-500 transition-colors"
          />
          <select
            name="investimento"
            className="w-full border-b-2 border-gray-300 py-3 mt-4 focus:border-orange-500 transition-colors"
          >
            <option value="">{content.formFaixaInvestimento}</option>
            <option>{content.formFaixa1}</option>
            <option>{content.formFaixa2}</option>
            <option>{content.formFaixa3}</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            {loading ? content.formLoading || 'Enviando...' : content.formEnviar}
          </button>
        </div>
      </form>
    </section>
  );
}
