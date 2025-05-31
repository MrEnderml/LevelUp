export const icons = {
    singularity: {
      viewBox: '0 0 64 64',
      body: `
        <circle cx="32" cy="32" r="30" stroke="#8884FF" stroke-width="2" />
        <circle cx="32" cy="32" r="10" fill="black" stroke="#FFFFFF" stroke-width="1" />
        <path d="M16 16 C28 8, 36 8, 48 16" stroke="#FF00F7" stroke-width="1.5" fill="none" />
        <path d="M16 48 C28 56, 36 56, 48 48" stroke="#00F7FF" stroke-width="1.5" fill="none" />
        <line x1="10" y1="32" x2="54" y2="32" stroke="#FFFFFF22" stroke-dasharray="4" />
        <line x1="32" y1="10" x2="32" y2="54" stroke="#FFFFFF22" stroke-dasharray="4" />
      `
    },
    infinity: {
        viewBox: '0 0 160 160',
        body: `
          
          <path 
            d="M30 80 C60 20, 100 20, 130 80 C100 140, 60 140, 30 80"
            fill="none"
            stroke="#FF00FF"
            stroke-width="8"
            stroke-linecap="round"
            stroke-linejoin="round" />
      
          
          <path 
            d="M40 80 C70 50, 90 50, 120 80 C90 110, 70 110, 40 80"
            fill="none"
            stroke="#00FFFF"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round" />
        `
      },
    sword: {
        viewBox: '0 0 64 64',
        body: `
          <path d="M32 4 L36 12 L32 20 L28 12 Z"
            fill="#facc15"
            stroke="#fff"
            stroke-width="1" />
          <rect x="30" y="20" width="4" height="28" fill="#facc15" stroke="#fff" stroke-width="1" />
          <path d="M24 50 H40 L32 60 Z"
            fill="#facc15"
            stroke="#fff"
            stroke-width="1" />
          <circle cx="32" cy="32" r="30" stroke="#fcd34d44" stroke-width="2" fill="none" />
        `
    },
    corruption: {
        viewBox: '0 0 100 100',
        body: `
          <path d="M50 10 C30 30, 20 50, 50 90 C80 50, 70 30, 50 10 Z"
            fill="#1a001a"
            stroke="#ff00ff"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round" />
          <path d="M40 50 Q45 40, 50 55 Q55 70, 60 50"
            stroke="#ff55ff"
            stroke-width="2"
            fill="none" />
          <circle cx="50" cy="55" r="7" fill="#ff00ff" />
          <path d="M35 45 Q40 35, 45 47" stroke="#cc00cc" stroke-width="2" fill="none" />
          <path d="M55 47 Q60 35, 65 45" stroke="#cc00cc" stroke-width="2" fill="none" />
        `
    },
    galaxy1: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="3" fill="#FFD700" />
        <path d="M10 32 Q32 10, 54 32 Q32 54, 10 32 Z" stroke="#66CCFF" stroke-width="1.5" fill="none"/>
        <circle cx="16" cy="16" r="1.5" fill="#FFF"/>
        <circle cx="48" cy="48" r="1.5" fill="#FFF"/>
      `
    },
    galaxy2: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="4" fill="#FF69B4" />
        <path d="M20 20 C25 30, 39 30, 44 20" stroke="#FFAAFF" stroke-width="1.5" fill="none"/>
        <path d="M20 44 C25 34, 39 34, 44 44" stroke="#88FFFF" stroke-width="1.5" fill="none"/>
        <circle cx="10" cy="32" r="1" fill="#FFF"/>
        <circle cx="54" cy="32" r="1" fill="#FFF"/>
      `
    },
    galaxy3: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="2.5" fill="#00FFFF" />
        <path d="M16 32 Q32 8, 48 32 Q32 56, 16 32 Z" stroke="#FFA3F0" stroke-width="1.5" fill="none"/>
        <circle cx="24" cy="24" r="1" fill="#FFF"/>
        <circle cx="40" cy="40" r="1" fill="#FFF"/>
      `
    },
    galaxy4: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="3.5" fill="#00FF7F" />
        <path d="M32 10 C20 20, 20 44, 32 54 C44 44, 44 20, 32 10" stroke="#A3FFDA" stroke-width="1.5" fill="none"/>
        <circle cx="32" cy="16" r="1" fill="#FFF"/>
        <circle cx="32" cy="48" r="1" fill="#FFF"/>
      `
    },
    galaxy5: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="3" fill="#FFDD55" />
        <path d="M12 12 L52 52" stroke="#FF00FF" stroke-width="1.5" />
        <path d="M52 12 L12 52" stroke="#00FFFF" stroke-width="1.5" />
        <circle cx="16" cy="32" r="1" fill="#FFF"/>
        <circle cx="48" cy="32" r="1" fill="#FFF"/>
      `
    },
    galaxy6: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="2" fill="#FFA500" />
        <path d="M32 32 C24 24, 24 40, 32 32 C40 40, 40 24, 32 32" stroke="#FFB6C1" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="20" r="1.5" fill="#FFF"/>
        <circle cx="44" cy="44" r="1.5" fill="#FFF"/>
      `
    },
    galaxy7: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="4" fill="#FF4500" />
        <path d="M16 48 C28 20, 36 20, 48 48" stroke="#FFA3F0" stroke-width="1.5" fill="none"/>
        <circle cx="20" cy="40" r="1" fill="#FFF"/>
        <circle cx="44" cy="40" r="1" fill="#FFF"/>
      `
    },
    galaxy8: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#13151b" rx="32"/>
        <circle cx="32" cy="32" r="3" fill="#ADFF2F" />
        <path d="M16 32 Q32 16, 48 32 Q32 48, 16 32 Z" stroke="#E6E6FA" stroke-width="1.5" fill="none"/>
        <circle cx="24" cy="48" r="1" fill="#FFF"/>
        <circle cx="40" cy="16" r="1" fill="#FFF"/>
      `
    },
  };

  export function getSvgIconHTML(name, size = '1em') {
    const icon = icons[name];
    if (!icon) return '';
    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="${icon.viewBox}"
        width="${size}"
        height="${size}"
        fill="none"
      >
        ${icon.body}
      </svg>
    `;
  }