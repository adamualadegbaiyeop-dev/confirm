/**
 * MagaluCard — Cartão de crédito Magalu estilizado
 * Usa a imagem gerada como base visual
 * Sobrepõe o nome real do titular na posição onde aparece "NOME DO CLIENTE"
 * Gradiente inferior cobre o texto original da imagem
 * Nome se ajusta automaticamente para caber em uma linha
 */

const CARD_IMAGE = "/Logo-Magalu.webp";

interface MagaluCardProps {
  name: string;
}

export default function MagaluCard({ name }: MagaluCardProps) {
  // Ajustar tamanho da fonte baseado no comprimento do nome
  const nameLength = name.length;
  let fontSize = "clamp(11px, 3.5vw, 15px)";
  if (nameLength > 25) {
    fontSize = "clamp(9px, 2.8vw, 12px)";
  } else if (nameLength > 20) {
    fontSize = "clamp(10px, 3vw, 13px)";
  }

  return (
    <div className="w-full" style={{ perspective: "1200px" }}>
      <div
        className="card-shine relative w-full overflow-hidden rounded-xl"
        style={{
          aspectRatio: "1.586 / 1",
          transform: "rotateY(-1deg) rotateX(1deg)",
          transformStyle: "preserve-3d",
          boxShadow:
            "0 30px 60px -15px rgba(0,0,0,0.55), 0 0 35px rgba(14,135,254,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Card image */}
        <img
          src={CARD_IMAGE}
          alt="Identidade Magalu"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Bottom gradient to cover original "NOME DO CLIENTE" text */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "35%",
            background: "linear-gradient(to top, rgba(3,12,60,0.98) 0%, rgba(3,12,60,0.9) 35%, rgba(3,12,60,0.5) 65%, transparent 100%)",
          }}
        />

        {/* Name overlay - single line, auto-sizing */}
        <div
          className="absolute flex items-end"
          style={{
            bottom: "10%",
            left: "7%",
            right: "8%",
          }}
        >
          <span
            className="text-white font-bold uppercase whitespace-nowrap overflow-hidden text-ellipsis block w-full"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              textShadow: "0 1px 6px rgba(0,0,0,0.5)",
              letterSpacing: "0.08em",
              fontSize: fontSize,
              lineHeight: 1,
            }}
          >
            {name.toUpperCase()}
          </span>
        </div>

        {/* Subtle border highlight */}
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        />
      </div>
    </div>
  );
}
