import { MascotMood } from "@/components/ui/MascotHoney";

/**
 * Returns an encoded SVG data URL representing the Honey mascot avatar
 * with circular background, ear details, tiger stripes, and mood expression.
 */
export function getMascotAvatarDataUrl(mood: MascotMood = "wave"): string {
  let eyesAndExpression = "";

  if (mood === "wave" || mood === "study") {
    // Round sparkling eyes
    eyesAndExpression = `
      <circle cx="80" cy="94" r="7" fill="#1F2937" />
      <circle cx="78" cy="92" r="2.5" fill="#FFFFFF" />
      <circle cx="120" cy="94" r="7" fill="#1F2937" />
      <circle cx="118" cy="92" r="2.5" fill="#FFFFFF" />
      ${
        mood === "study"
          ? `<circle cx="80" cy="94" r="13" fill="none" stroke="#3B82F6" stroke-width="2.5" />
             <circle cx="120" cy="94" r="13" fill="none" stroke="#3B82F6" stroke-width="2.5" />
             <path d="M93 94H107" stroke="#3B82F6" stroke-width="2.5" />`
          : ""
      }
    `;
  } else if (mood === "celebrate") {
    // Happy squinting arch eyes
    eyesAndExpression = `
      <path d="M73 95C73 89 87 89 87 95" stroke="#1F2937" stroke-width="4" stroke-linecap="round" fill="none" />
      <path d="M113 95C113 89 127 89 127 95" stroke="#1F2937" stroke-width="4" stroke-linecap="round" fill="none" />
      <ellipse cx="100" cy="116" rx="8" ry="6" fill="#E8604C" />
    `;
  } else if (mood === "thinking") {
    // Thinking curious look
    eyesAndExpression = `
      <circle cx="80" cy="94" r="7" fill="#1F2937" />
      <circle cx="82" cy="90" r="2.5" fill="#FFFFFF" />
      <circle cx="120" cy="94" r="7" fill="#1F2937" />
      <circle cx="122" cy="90" r="2.5" fill="#FFFFFF" />
      <circle cx="128" cy="74" r="5" fill="#F59E0B" />
    `;
  } else {
    // Lost / curious wide eyes
    eyesAndExpression = `
      <circle cx="80" cy="94" r="9" fill="#1F2937" />
      <circle cx="78" cy="91" r="3.5" fill="#FFFFFF" />
      <circle cx="120" cy="94" r="9" fill="#1F2937" />
      <circle cx="118" cy="91" r="3.5" fill="#FFFFFF" />
      <circle cx="100" cy="116" r="4" fill="#1F2937" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FEF3C7"/>
        <stop offset="1" stop-color="#FDE68A"/>
      </linearGradient>
      <linearGradient id="furGrad" x1="50" y1="30" x2="150" y2="170" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FBBF24"/>
        <stop offset="1" stop-color="#F59E0B"/>
      </linearGradient>
      <linearGradient id="bellyGrad" x1="100" y1="120" x2="100" y2="180" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFBEB"/>
        <stop offset="1" stop-color="#FEF3C7"/>
      </linearGradient>
    </defs>
    <!-- Background circle -->
    <circle cx="100" cy="100" r="96" fill="url(#bgGrad)" stroke="#F59E0B" stroke-width="4"/>
    
    <!-- Ears -->
    <circle cx="58" cy="62" r="24" fill="url(#furGrad)"/>
    <circle cx="58" cy="62" r="14" fill="#FDE68A"/>
    <ellipse cx="50" cy="54" rx="4" ry="7" transform="rotate(-30 50 54)" fill="#B45309"/>
    
    <circle cx="142" cy="62" r="24" fill="url(#furGrad)"/>
    <circle cx="142" cy="62" r="14" fill="#FDE68A"/>
    <ellipse cx="150" cy="54" rx="4" ry="7" transform="rotate(30 150 54)" fill="#B45309"/>
    
    <!-- Body -->
    <ellipse cx="100" cy="155" rx="55" ry="42" fill="url(#furGrad)"/>
    <ellipse cx="100" cy="158" rx="36" ry="28" fill="url(#bellyGrad)"/>
    
    <!-- Head -->
    <circle cx="100" cy="98" r="54" fill="url(#furGrad)"/>
    
    <!-- Cheeks -->
    <ellipse cx="76" cy="116" rx="22" ry="18" fill="#FFFBEB"/>
    <ellipse cx="124" cy="116" rx="22" ry="18" fill="#FFFBEB"/>
    
    <!-- Forehead Stripes (King 王) -->
    <path d="M92 64H108" stroke="#92400E" stroke-width="4" stroke-linecap="round"/>
    <path d="M88 72H112" stroke="#92400E" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M100 64V80" stroke="#92400E" stroke-width="4.5" stroke-linecap="round"/>
    
    <!-- Cheek Stripes -->
    <path d="M48 94C56 94 62 96 66 98" stroke="#92400E" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M48 106C56 106 62 108 66 110" stroke="#92400E" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M152 94C144 94 138 96 134 98" stroke="#92400E" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M152 106C144 106 138 108 134 110" stroke="#92400E" stroke-width="3.5" stroke-linecap="round"/>
    
    <!-- Blush -->
    <circle cx="68" cy="114" r="8" fill="#F87171" opacity="0.4"/>
    <circle cx="132" cy="114" r="8" fill="#F87171" opacity="0.4"/>
    
    <!-- Nose -->
    <path d="M95 106C97 104 103 104 105 106L102 111C101 112 99 112 98 111L95 106Z" fill="#E8604C"/>
    
    <!-- Mouth -->
    <path d="M93 113C97 116 100 116 100 113C100 116 103 116 107 113" stroke="#1F2937" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    
    ${eyesAndExpression}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
