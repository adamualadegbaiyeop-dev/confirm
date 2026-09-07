/**
 * Confirmador de Dados Magalu — versão ultra-compacta para embed no Typebot
 * Exibe APENAS o bloco de dados do titular (nome, CPF, data de nascimento)
 * Sem cartão, sem botão, sem header — puro conteúdo para iframe
 * Recebe variáveis via query params: nome, cpf, dataNascimento
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Calendar, CreditCard } from "lucide-react";

const MAGALU_LOGO = "/Logo-Magalu.webp";

function formatCPF(cpf: string): string {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return cpf;
  return digits.slice(0, 3) + "." + digits.slice(3, 6) + "." + digits.slice(6, 9) + "-" + digits.slice(9);
}

function formatDate(date: string): string {
  // Caso 1: Typebot envia "04/11/2005" mas as barras viram divisão → resultado decimal
  // Ex: 04/11/2005 = 0.0001813647698934482
  // Não tem como reverter um decimal, então esse caso precisa ser tratado na URL
  // Mas podemos detectar e exibir o valor raw se vier como "dd/mm/yyyy" corretamente

  // Caso 2: Já vem no formato dd/mm/yyyy (se as barras foram preservadas)
  if (date.includes("/")) {
    const parts = date.split("/");
    if (parts.length === 3) {
      // Se já está em dd/mm/yyyy, retorna como está
      if (parts[2].length === 4) return date;
      // Se está em yyyy/mm/dd, inverte
      if (parts[0].length === 4) return parts[2] + "/" + parts[1] + "/" + parts[0];
    }
    return date;
  }

  // Caso 3: Formato ISO yyyy-mm-dd
  if (date.includes("-")) {
    const parts = date.split("-");
    if (parts.length === 3 && parts[0].length === 4) {
      return parts[2] + "/" + parts[1] + "/" + parts[0];
    }
    return date;
  }

  // Caso 4: Apenas dígitos (ddmmyyyy ou yyyymmdd)
  const cleaned = date.replace(/\D/g, "");
  if (cleaned.length === 8) {
    if (parseInt(cleaned.slice(0, 4)) > 1900) {
      return cleaned.slice(6, 8) + "/" + cleaned.slice(4, 6) + "/" + cleaned.slice(0, 4);
    }
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4) + "/" + cleaned.slice(4, 8);
  }

  // Caso 5: Número decimal (resultado de divisão pelo Typebot)
  // Ex: 0.0001813647698934482 → impossível reverter com precisão
  // Retorna o valor original — o problema está no envio
  return date;
}

export default function Home() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNome(params.get("nome") || params.get("name") || "");
    setCpf(params.get("cpf") || "");
    setDataNascimento(params.get("dataNascimento") || params.get("nascimento") || params.get("data") || "");

    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "object") {
        if (event.data.nome) setNome(event.data.nome);
        if (event.data.cpf) setCpf(event.data.cpf);
        if (event.data.dataNascimento) setDataNascimento(event.data.dataNascimento);
      }
    };
    window.addEventListener("message", handleMessage);
    setTimeout(() => setLoaded(true), 50);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const formattedCPF = cpf ? formatCPF(cpf) : "000.000.000-00";
  const formattedDate = dataNascimento ? formatDate(dataNascimento) : "00/00/0000";
  const displayName = nome || "NOME DO CLIENTE";

  return (
    <div className="w-full flex justify-center p-1" style={{ background: "transparent" }}>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={loaded ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.35 }}
        className="w-full max-w-[360px] rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0a2f8f 0%, #0B3BDD 60%, #1a4fe8 100%)",
          boxShadow: "0 4px 20px -2px rgba(11,59,221,0.4)",
        }}
      >
        {/* Header com logo */}
        <div className="flex items-center gap-2.5 px-4 pt-3 pb-2">
          <img
            src={MAGALU_LOGO}
            alt="Magalu"
            className="h-6 brightness-0 invert opacity-90"
            draggable={false}
          />
          <div className="h-4 w-px bg-white/20" />
          <span
            className="text-[10px] text-blue-200/70 uppercase tracking-widest font-semibold"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Dados do titular
          </span>
        </div>

        {/* Nome */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 px-4 py-2.5 border-t border-white/10"
        >
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-blue-200/80" />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-[9px] text-blue-300/60 uppercase tracking-wider font-medium block leading-none mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Nome completo
            </span>
            <span
              className="text-white text-[13px] font-semibold block truncate leading-tight"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {displayName.toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* CPF */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3 px-4 py-2.5 border-t border-white/10"
        >
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-3.5 h-3.5 text-blue-200/80" />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-[9px] text-blue-300/60 uppercase tracking-wider font-medium block leading-none mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              CPF
            </span>
            <span
              className="text-white text-[13px] font-semibold block leading-tight"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {formattedCPF}
            </span>
          </div>
        </motion.div>

        {/* Data de Nascimento */}
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={loaded ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 px-4 py-2.5 border-t border-white/10"
        >
          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-blue-200/80" />
          </div>
          <div className="flex-1 min-w-0">
            <span
              className="text-[9px] text-blue-300/60 uppercase tracking-wider font-medium block leading-none mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Data de nascimento
            </span>
            <span
              className="text-white text-[13px] font-semibold block leading-tight"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {formattedDate}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
