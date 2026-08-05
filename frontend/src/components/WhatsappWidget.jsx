import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const TELEFONE = "557199124780";

export default function WhatsappWidget() {
  const [aberto, setAberto] = useState(false);

  const abrirWhatsapp = () => {
    const mensagem = `Olá! Gostaria de solicitar um orçamento.`;

    window.open(
      `https://wa.me/${TELEFONE}?text=${encodeURIComponent(mensagem)}`,
      "_blank",
    );
  };

  return (
    <>
      {aberto && (
        <div className="fixed bottom-24 right-6 w-[340px] rounded-3xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in duration-300">
          {/* Header */}

          <div className="bg-[#25D366] px-5 py-4 flex justify-between">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <FaWhatsapp className="text-[#25D36] text-2xl" />
              </div>

              <div>
                <h2 className="font-semibold text-white">LM Bags & Brindes</h2>

                <p className="text-xs text-green-100">🟢 Online</p>

                <p className="text-[11px] text-green-50">
                  Respondemos em poucos minutos
                </p>
              </div>
            </div>

            <button
              onClick={() => setAberto(false)}
              className="text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Corpo */}

          <div
            className="p-4"
            style={{
              backgroundImage: "url('/whatsapp-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="bg-[#dcf8c7] rounded-2xl p-4 shadow-sm max-w-[90%]">
              <p className="text-sm">👋 Olá!</p>

              <br />

              <p className="text-sm">
                Bem-vindo à <strong>LM Bags & Brindes.</strong>
              </p>

              <br />

              <p className="text-sm">Como podemos ajudar você hoje?</p>

              <div className="flex justify-end mt-3">
                <span className="text-[11px] text-blue-500">agora ✓✓</span>
              </div>
            </div>

            <button
              onClick={abrirWhatsapp}
              className="mt-5 w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-full py-3 transition"
            >
              Iniciar conversa
            </button>
          </div>
        </div>
      )}

      {/* Botão Flutuante */}

      <button
        onClick={() => setAberto(!aberto)}
        className="
        fixed
        bottom-6
        right-6
        w-16
        h-16
        rounded-full
        bg-[#25D366]
        flex
        items-center
        justify-center
        shadow-xl
        hover:scale-110
        transition
        duration-300
        animate-pulse
        z-50
        "
      >
        <FaWhatsapp className="text-white text-4xl" />
      </button>

      {/* Badge */}

      {!aberto && (
        <div className="fixed bottom-16 right-5 w-5 h-5 rounded-full bg-red-500 border-2 border-white z-50"></div>
      )}
    </>
  );
}
