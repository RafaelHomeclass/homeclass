"use client";
import { useState } from "react";

export default function Newsletter({ content }) {
  if (!content) return null; // evita erro caso não receba a prop

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus("loading");

  const res = await fetch("/api/newsletter", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (res.ok) {
    setStatus("success");
    setEmail("");
  } else {
    setStatus("error");
  }
};


  const getButtonText = () => {
    switch (status) {
      case "loading":
        return content.newsletterLoading || "Enviando...";
      case "success":
        return content.newsletterSuccess || "Inscrito!";
      default:
        return content.newsletterButton;
    }
  };

  return (
    <section className="py-20 px-6 bg-white" id="newsletter">
      <div className="max-w-xl mx-auto text-center p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-serif font-bold mb-4">
          {content.newsletterTitle}
        </h2>
        <p className="text-lg text-gray-600 mb-6 font-sans">
          {content.newsletterText}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={content.newsletterPlaceholder}
            required
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors disabled:opacity-60"
          >
            {getButtonText()}
          </button>
        </form>

        {status === "error" && (
          <p className="text-red-600 mt-2">
            {content.newsletterError || "Ocorreu um erro. Tente novamente."}
          </p>
        )}
      </div>
    </section>
  );
}
