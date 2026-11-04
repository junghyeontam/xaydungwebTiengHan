import React from "react";

export type MascotMood = "wave" | "study" | "celebrate" | "thinking" | "lost";

interface MascotHoneyProps {
  mood?: MascotMood;
  className?: string;
  size?: number;
}

export function MascotHoney({ mood = "wave", className = "", size = 120 }: MascotHoneyProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Chú hổ Honey đang ${mood}`}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="furGradient" x1="50" y1="30" x2="150" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FBBF24" /> {/* Amber 400 */}
            <stop offset="1" stopColor="#F59E0B" /> {/* Amber 500 */}
          </linearGradient>
          <linearGradient id="bellyGradient" x1="100" y1="120" x2="100" y2="180" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFBEB" />
            <stop offset="1" stopColor="#FEF3C7" />
          </linearGradient>
          <linearGradient id="blushGradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#F87171" stopOpacity="0.4" />
            <stop offset="1" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Tai trái */}
        <circle cx="58" cy="62" r="24" fill="url(#furGradient)" />
        <circle cx="58" cy="62" r="14" fill="#FDE68A" />
        <ellipse cx="50" cy="54" rx="4" ry="7" transform="rotate(-30 50 54)" fill="#B45309" />

        {/* Tai phải */}
        <circle cx="142" cy="62" r="24" fill="url(#furGradient)" />
        <circle cx="142" cy="62" r="14" fill="#FDE68A" />
        <ellipse cx="150" cy="54" rx="4" ry="7" transform="rotate(30 150 54)" fill="#B45309" />

        {/* Thân hổ con */}
        <ellipse cx="100" cy="145" rx="55" ry="48" fill="url(#furGradient)" />
        {/* Bụng trắng ngà */}
        <ellipse cx="100" cy="150" rx="36" ry="34" fill="url(#bellyGradient)" />

        {/* Đầu hổ con tròn trịa đáng yêu */}
        <circle cx="100" cy="98" r="54" fill="url(#furGradient)" />

        {/* Má trắng hai bên */}
        <ellipse cx="76" cy="116" rx="22" ry="18" fill="#FFFBEB" />
        <ellipse cx="124" cy="116" rx="22" ry="18" fill="#FFFBEB" />

        {/* Vệt vằn trên trán (chữ 王 - Vương tượng trưng hổ Hàn Quốc) */}
        <path d="M92 64H108" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
        <path d="M88 72H112" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M100 64V80" stroke="#92400E" strokeWidth="4.5" strokeLinecap="round" />
        {/* Vằn hai bên má */}
        <path d="M48 94C56 94 62 96 66 98" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M48 106C56 106 62 108 66 110" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M152 94C144 94 138 96 134 98" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M152 106C144 106 138 108 134 110" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />

        {/* Má hồng e ấp */}
        <circle cx="68" cy="114" r="9" fill="url(#blushGradient)" />
        <circle cx="132" cy="114" r="9" fill="url(#blushGradient)" />

        {/* Mũi san hô hình tam giác bo tròn */}
        <path
          d="M95 106C97 104 103 104 105 106L102 111C101 112 99 112 98 111L95 106Z"
          fill="#E8604C"
        />

        {/* Miệng cười xinh xắn */}
        <path
          d="M93 113C97 116 100 116 100 113C100 116 103 116 107 113"
          stroke="#1F2937"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Mắt theo từng biểu cảm */}
        {mood === "wave" && (
          <>
            {/* Mắt to tròn lấp lánh */}
            <circle cx="80" cy="94" r="7" fill="#1F2937" />
            <circle cx="78" cy="92" r="2.5" fill="#FFFFFF" />
            <circle cx="120" cy="94" r="7" fill="#1F2937" />
            <circle cx="118" cy="92" r="2.5" fill="#FFFFFF" />

            {/* Tay vẫy chào */}
            <g className="animate-bounce" style={{ animationDuration: "2s" }}>
              <ellipse cx="145" cy="120" rx="12" ry="10" transform="rotate(-30 145 120)" fill="url(#furGradient)" />
              <circle cx="152" cy="114" r="5" fill="#FDE68A" />
            </g>
            <ellipse cx="55" cy="138" rx="11" ry="9" fill="url(#furGradient)" />
          </>
        )}

        {mood === "celebrate" && (
          <>
            {/* Mắt híp cười tít vui sướng */}
            <path d="M72 96C77 90 85 90 90 96" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M110 96C115 90 123 90 128 96" stroke="#1F2937" strokeWidth="3.5" strokeLinecap="round" />
            {/* Miệng cười lớn */}
            <path d="M92 114C96 122 104 122 108 114" fill="#E8604C" stroke="#1F2937" strokeWidth="2" />
            {/* Hai tay giơ cao ăn mừng */}
            <ellipse cx="48" cy="110" rx="11" ry="9" transform="rotate(-40 48 110)" fill="url(#furGradient)" />
            <ellipse cx="152" cy="110" rx="11" ry="9" transform="rotate(40 152 110)" fill="url(#furGradient)" />
          </>
        )}

        {mood === "study" && (
          <>
            {/* Mắt tập trung đeo kính tròn trí thức */}
            <circle cx="78" cy="94" r="6" fill="#1F2937" />
            <circle cx="122" cy="94" r="6" fill="#1F2937" />
            {/* Kính ngộ nghĩnh */}
            <circle cx="78" cy="94" r="14" stroke="#12302F" strokeWidth="3" fill="none" />
            <circle cx="122" cy="94" r="14" stroke="#12302F" strokeWidth="3" fill="none" />
            <path d="M92 94H108" stroke="#12302F" strokeWidth="3" />
            {/* Cuốn sách tiếng Hàn trên tay */}
            <rect x="75" y="142" width="50" height="32" rx="4" fill="#3DBBA8" />
            <path d="M100 142V174" stroke="#FAF7F2" strokeWidth="2" />
            <text x="81" y="158" fill="#FFFFFF" fontSize="9" fontWeight="bold">한</text>
            <text x="108" y="158" fill="#FFFFFF" fontSize="9" fontWeight="bold">글</text>
          </>
        )}

        {mood === "thinking" && (
          <>
            <circle cx="80" cy="93" r="6" fill="#1F2937" />
            <circle cx="120" cy="91" r="6" fill="#1F2937" />
            {/* Tay chống cằm suy nghĩ */}
            <ellipse cx="112" cy="124" rx="11" ry="9" fill="url(#furGradient)" />
            <circle cx="112" cy="120" r="4" fill="#FDE68A" />
            {/* Bong bóng suy nghĩ */}
            <circle cx="150" cy="50" r="4" fill="#3DBBA8" opacity="0.6" />
            <circle cx="162" cy="40" r="7" fill="#3DBBA8" opacity="0.8" />
            <circle cx="178" cy="28" r="11" fill="#3DBBA8" />
            <text x="174" y="32" fill="#FFFFFF" fontSize="11" fontWeight="bold">?</text>
          </>
        )}

        {mood === "lost" && (
          <>
            {/* Mắt xoáy / ngơ ngác */}
            <path d="M74 94L86 94M80 88L80 100" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            <circle cx="120" cy="94" r="6" fill="#1F2937" />
            <path d="M94 116C97 113 103 113 106 116" stroke="#1F2937" strokeWidth="2.5" strokeLinecap="round" />
            {/* Nốt mồ hôi rơi */}
            <path d="M142 82C142 86 138 90 134 90C130 90 128 86 134 78C136 80 142 78 142 82Z" fill="#38BDF8" />
          </>
        )}

        {/* Dải khăn quàng Hanbok xanh ngọc xinh xắn */}
        <path
          d="M82 135C94 140 106 140 118 135L120 142C106 148 94 148 80 142Z"
          fill="#3DBBA8"
        />
        <circle cx="100" cy="140" r="4.5" fill="#F5B93A" />
      </svg>
    </div>
  );
}
