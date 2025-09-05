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
    quasarCore: {
      viewBox: '0 0 64 64',
      body: `
        <circle cx="32" cy="32" r="31" fill="#0c0c1a" stroke="#1e1e2f" stroke-width="2" />

        <circle cx="32" cy="32" r="6" fill="#00e5ff" stroke="#ffffffaa" stroke-width="1.5" />

        <circle cx="32" cy="32" r="16" stroke="#00ffffaa" stroke-width="2.5" fill="none" stroke-dasharray="5,5" />
        <circle cx="32" cy="32" r="24" stroke="#3b82f688" stroke-width="2" fill="none" stroke-dasharray="2,6" />

        <path d="M32 2 L32 14" stroke="#38bdf8" stroke-width="1.3" />
        <path d="M32 50 L32 62" stroke="#38bdf8" stroke-width="1.3" />
        <path d="M2 32 L14 32" stroke="#38bdf8" stroke-width="1.3" />
        <path d="M50 32 L62 32" stroke="#38bdf8" stroke-width="1.3" />

        <circle cx="32" cy="32" r="30" stroke="#60a5fa33" stroke-width="2" fill="none" />
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
        </style>
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
    galaxy9: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#1B1F27" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#FFD700" />
        <g class="rotate-orbit">
          <path d="M10 32 Q32 10, 54 32 Q32 54, 10 32 Z" stroke="#66CCFF" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="46" cy="22" r="1" fill="#FFF"/>
        <circle cx="53" cy="17" r="1" fill="#FFF"/>
        <circle cx="22" cy="40" r="1" fill="#EEE"/>
        <circle cx="26" cy="31" r="1" fill="#D8BFD8"/>
      `
    },
    galaxy10: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#FF69B4" />
        <g class="rotate-orbit">
          <path d="M20 20 C25 30, 39 30, 44 20" stroke="#FFA3F0" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="33" cy="13" r="1" fill="#FFF"/>
        <circle cx="43" cy="37" r="1" fill="#FFF"/>
        <circle cx="14" cy="38" r="1" fill="#EEE"/>
        <circle cx="15" cy="28" r="1" fill="#EEE"/>
      `
    },
    galaxy11: {
      viewBox: '0 0 64 64',
      body: `
        </style>
        <rect width="64" height="64" fill="#0D0F15" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#00FFFF" />
        <g class="rotate-orbit">
          <path d="M20 32 Q32 12, 44 32 Q32 52, 20 32 Z" stroke="#66CCFF" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="39" cy="45" r="1" fill="#D8BFD8"/>
        <circle cx="34" cy="22" r="1" fill="#EEE"/>
        <circle cx="37" cy="17" r="1" fill="#EEE"/>
        <circle cx="35" cy="44" r="1" fill="#FFF"/>
      `
    },
    galaxy12: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#0D0F15" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#00FF7F" />
        <g class="rotate-orbit">
          <path d="M16 32 Q32 8, 48 32 Q32 56, 16 32 Z" stroke="#A3FFDA" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="28" cy="10" r="1" fill="#D8BFD8"/>
        <circle cx="27" cy="41" r="1" fill="#FFF"/>
        <circle cx="28" cy="31" r="1" fill="#FFF"/>
        <circle cx="23" cy="52" r="1" fill="#FFF"/>
      `
    },
    galaxy13: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#0D0F15" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#DDA0DD" />
        <g class="rotate-orbit">
          <path d="M10 32 Q32 10, 54 32 Q32 54, 10 32 Z" stroke="#BA55D3" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="51" cy="28" r="1" fill="#D8BFD8"/>
        <circle cx="20" cy="48" r="1" fill="#D8BFD8"/>
      `
    },
    galaxy14: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#FFD700" />
        <g class="rotate-orbit">
          <path d="M20 20 C25 30, 39 30, 44 20" stroke="#FFAAFF" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="31" cy="39" r="1" fill="#D8BFD8"/>
        <circle cx="31" cy="35" r="1" fill="#FFF"/>
        <circle cx="17" cy="47" r="1" fill="#D8BFD8"/>
        <circle cx="26" cy="10" r="1" fill="#FFF"/>
      `
    },
    galaxy15: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#0D0F15" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#00FFFF" />
        <g class="rotate-orbit">
          <path d="M16 32 Q32 8, 48 32 Q32 56, 16 32 Z" stroke="#BA55D3" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="40" cy="47" r="1" fill="#D8BFD8"/>
        <circle cx="37" cy="11" r="1" fill="#EEE"/>
        <circle cx="13" cy="14" r="1" fill="#EEE"/>
        <circle cx="52" cy="39" r="1" fill="#FFF"/>
      `
    },
    galaxy16: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#1B1F27" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#DDA0DD" />
        <g class="rotate-orbit">
          <path d="M10 32 Q32 10, 54 32 Q32 54, 10 32 Z" stroke="#FFA3F0" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="29" cy="23" r="1" fill="#FFF"/>
        <circle cx="48" cy="48" r="1" fill="#D8BFD8"/>
        <circle cx="30" cy="18" r="1" fill="#FFF"/>
        <circle cx="52" cy="12" r="1" fill="#FFF"/>
      `
    },
    galaxy17: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#0D0F15" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#00FF7F" />
        <g class="rotate-orbit">
          <path d="M20 20 C25 30, 39 30, 44 20" stroke="#FFAAFF" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="15" cy="32" r="1" fill="#EEE"/>
        <circle cx="20" cy="52" r="1" fill="#FFF"/>
        <circle cx="42" cy="23" r="1" fill="#D8BFD8"/>
        <circle cx="44" cy="12" r="1" fill="#EEE"/>
      `
    },
    galaxy19: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#1B1F27" rx="32"/>
        <circle class="pulse-center" cx="32" cy="32" r="3" fill="#FF69B4" />
        <g class="rotate-orbit">
          <path d="M16 32 Q32 8, 48 32 Q32 56, 16 32 Z" stroke="#FFA3F0" stroke-width="1.5" fill="none"/>
        </g>
        <circle cx="25" cy="46" r="1" fill="#FFF"/>
        <circle cx="44" cy="42" r="1" fill="#EEE"/>
        <circle cx="22" cy="17" r="1" fill="#FFF"/>
        <circle cx="38" cy="24" r="1" fill="#D8BFD8"/>
      `
    },
    galaxy18: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="32"/>
        <circle cx="32" cy="32" r="3" fill="#00FF7F" />
        <path d="M20 32 Q32 12, 44 32 Q32 52, 20 32 Z" stroke="#A3FFDA" stroke-width="1.5" fill="none"/>
        <circle cx="39" cy="16" r="1" fill="#EEE"/>
        <circle cx="20" cy="33" r="1" fill="#FFF"/>
        <circle cx="34" cy="52" r="1" fill="#EEE"/>
        <circle cx="46" cy="15" r="1" fill="#EEE"/>
      `
    },
    galaxyEternity: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#1a1325" rx="32"/>
        <circle cx="32" cy="32" r="3" fill="#DDA0DD" />
        <path d="M20 32 Q32 12, 44 32 Q32 52, 20 32 Z
                 M44 32 Q32 52, 20 32 Q32 12, 44 32 Z" 
              stroke="#BA55D3" stroke-width="1.5" fill="none"/>
        <circle cx="24" cy="46" r="1" fill="#EEE"/>
        <circle cx="40" cy="18" r="1" fill="#EEE"/>
        <circle cx="30" cy="10" r="0.8" fill="#D8BFD8"/>
        <circle cx="36" cy="54" r="0.8" fill="#D8BFD8"/>
      `
    },
    juggernaut: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g fill="#FF6347">
          <path d="M16 32 L32 16 L48 32 L32 48 Z" stroke="#fff" stroke-width="1.5" fill="#FF6347"/>
          <circle cx="32" cy="32" r="6" fill="#fff"/>
        </g>
      `
    },
    berserk: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g fill="#DC143C">
          <path d="M20 20 L44 44 M44 20 L20 44" stroke="#DC143C" stroke-width="5" stroke-linecap="round"/>
        </g>
      `
    },
    first_strike: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g fill="#FFD700">
          <path d="M32 10 L38 26 H54 L42 36 L46 52 L32 42 L18 52 L22 36 L10 26 H26 Z" stroke="#fff" stroke-width="1" fill="#FFD700"/>
        </g>
      `
    },
    traveller: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g fill="#1E90FF">
          <circle cx="32" cy="32" r="12" stroke="#1E90FF" stroke-width="2" fill="none"/>
          <path d="M32 20 L32 44 M20 32 L44 32" stroke="#1E90FF" stroke-width="2"/>
        </g>
      `
    },
    flexible: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g fill="#32CD32">
          <path d="M20 32 Q32 12, 44 32 Q32 52, 20 32 Z" fill="none" stroke="#32CD32" stroke-width="3"/>
        </g>
      `
    },
    the_flash: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g fill="#FF4500">
          <path d="M24 10 L40 24 L32 24 L40 40 L24 28 L32 28 Z" fill="#FF4500" stroke="#fff" stroke-width="1"/>
        </g>
      `
    },
    bh_ignore_dodge: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g stroke="#FF69B4" stroke-width="3" fill="none">
          <circle cx="32" cy="32" r="12"/>
          <line x1="20" y1="32" x2="44" y2="32"/>
          <line x1="32" y1="20" x2="32" y2="44"/>
          <line x1="20" y1="20" x2="44" y2="44" stroke="#FF4500"/>
        </g>
      `
    },
    bh_stun_immune: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g stroke="#32CD32" stroke-width="3" stroke-linecap="round" fill="none">
          <polyline points="24,20 36,32 28,32 40,44"/>
          <line x1="20" y1="20" x2="44" y2="44" stroke="#FF4500"/>
        </g>
      `
    },
    bh_slow: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g stroke="#1E90FF" stroke-width="4" stroke-linecap="round" fill="none">
          <line x1="32" y1="16" x2="32" y2="48"/>
          <polygon points="24,40 32,48 40,40" fill="#1E90FF"/>
        </g>
      `
    },
    bh_stack_chance: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g stroke="#FFD700" stroke-width="3" stroke-linecap="round" fill="none">
          <path d="M32 44 L32 20"/>
          <path d="M24 28 L32 20 L40 28"/>
        </g>
      `
    },
    bh_singularity_stacks: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g stroke="#a3ffe0" fill="none" stroke-width="2">
          <circle cx="32" cy="32" r="6"/>
          <circle cx="32" cy="32" r="12"/>
          <circle cx="32" cy="32" r="18"/>
        </g>
      `
    },
    bh_speed: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#111" rx="16"/>
        <g stroke="#FFD700" stroke-width="3" stroke-linecap="round" fill="none">
          <!-- Основная стрелка -->
          <line x1="16" y1="32" x2="48" y2="32"/>
          <polyline points="36,24 48,32 36,40"/>
          <!-- Эффект движения -->
          <line x1="12" y1="28" x2="16" y2="32" stroke="#FFD700" stroke-width="2"/>
          <line x1="12" y1="36" x2="16" y2="32" stroke="#FFD700" stroke-width="2"/>
        </g>
      `
    },
    rage: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#200" rx="16"/>
        <g stroke="#ff4d4d" stroke-width="2" fill="none">
          <path d="M22 40 
                  Q18 28 28 20 
                  Q32 12 40 20 
                  Q50 28 42 40 
                  Z" 
                fill="#400" stroke="#ff8080"/>
          <path d="M28 34 Q32 40 36 34" 
                stroke="#ff4d4d" stroke-width="3"/>

          <line x1="27" y1="28" x2="29" y2="27" stroke="#ff9999" stroke-width="2"/>
          <line x1="37" y1="27" x2="39" y2="28" stroke="#ff9999" stroke-width="2"/>
          
          <circle cx="32" cy="32" r="14" stroke="#ff6666" stroke-dasharray="3,3"/>
        </g>
      `
    },
    extraHit: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#001020" rx="16"/>
        <g stroke="#ffd700" stroke-width="2" fill="none">
          
          <path d="M20 44 L44 20" stroke="#ffaa00" stroke-width="3"/>
          <path d="M44 44 L20 20" stroke="#ffaa00" stroke-width="3"/>
          
          
          <line x1="20" y1="44" x2="16" y2="48" stroke="#ffcc33" stroke-width="2"/>
          <line x1="44" y1="20" x2="48" y2="16" stroke="#ffcc33" stroke-width="2"/>
          <line x1="44" y1="44" x2="48" y2="48" stroke="#ffcc33" stroke-width="2"/>
          <line x1="20" y1="20" x2="16" y2="16" stroke="#ffcc33" stroke-width="2"/>
    
          
          <circle cx="32" cy="32" r="14" stroke="#ffdd55" stroke-dasharray="3,3"/>
          <circle cx="32" cy="32" r="20" stroke="#ffaa00" stroke-dasharray="5,5"/>
        </g>
      `
    },
    redCharge: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#200" rx="16"/>
        <circle cx="32" cy="32" r="14" fill="#400" stroke="#ff4d4d" stroke-width="3"/>
        <path d="M28 24 L32 18 L36 24 L32 30 Z" fill="#ff6666" stroke="#ff9999" stroke-width="2"/>
      `
    },
    greenCharge: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#020" rx="16"/>
        <circle cx="32" cy="32" r="14" fill="#040" stroke="#4dff4d" stroke-width="3"/>
        <path d="M28 24 L32 18 L36 24 L32 30 Z" fill="#66ff66" stroke="#99ff99" stroke-width="2"/>
      `
    },
    
    blueCharge: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#002" rx="16"/>
        <circle cx="32" cy="32" r="14" fill="#004" stroke="#4d4dff" stroke-width="3"/>
        <path d="M28 24 L32 18 L36 24 L32 30 Z" fill="#6666ff" stroke="#9999ff" stroke-width="2"/>
      `
    },
    bleedingVeil: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#200000" rx="16"/>
        <g stroke="#990000" stroke-width="2" fill="none">
          
          <path d="M32 20 Q28 28 32 36 Q36 28 32 20 Z" fill="#660000" stroke="#ff4444"/>
          <path d="M24 32 Q22 38 28 40" stroke="#ff6666" stroke-width="2"/>
          <path d="M40 32 Q42 38 36 40" stroke="#ff6666" stroke-width="2"/>
    
          <circle cx="32" cy="32" r="14" stroke="#ff5555" stroke-dasharray="4,2"/>
          <circle cx="32" cy="32" r="20" stroke="#ff2222" stroke-dasharray="6,3"/>
        </g>
      `
    },
    survivalLife: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#002000" rx="16"/>
        <g stroke="#00ff00" stroke-width="2" fill="none">
    
          <path d="M32 44 
                   Q28 40 24 32 
                   Q32 20 40 32 
                   Q36 40 32 44 Z" 
                fill="#004400" stroke="#66ff66"/>
          <line x1="32" y1="32" x2="32" y2="20" stroke="#88ff88" stroke-width="2"/>
          
          <circle cx="32" cy="32" r="16" stroke="#33ff33" stroke-dasharray="3,3"/>
          <circle cx="32" cy="32" r="22" stroke="#00ff00" stroke-dasharray="5,5"/>
        </g>
      `
    },
    survivalLife2: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#001500" rx="16"/>
        <g stroke="#00ff00" stroke-width="2" fill="none">
    
          <path d="M32 18 
                   Q40 28 32 46 
                   Q24 28 32 18 Z" 
                fill="#003300" stroke="#66ff66"/>

          <line x1="32" y1="20" x2="32" y2="44" stroke="#88ff88" stroke-width="2"/>
          <line x1="20" y1="32" x2="44" y2="32" stroke="#88ff88" stroke-width="2"/>
    
          <circle cx="32" cy="32" r="12" stroke="#33ff33" stroke-dasharray="2,2"/>
    
          <circle cx="32" cy="32" r="24" stroke="#00ff00" stroke-dasharray="6,4"/>
        </g>
      `
    },
    
    irradiation: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" fill="#101010" rx="16"/>
        <g stroke="#88ff00" stroke-width="2" fill="none">
    
          
          <circle cx="32" cy="32" r="8" fill="#225500" stroke="#aaff00"/>
    
          
          <path d="M32 12 
                   L36 22 
                   A10 10 0 0 0 28 22 Z" 
                fill="#446600" stroke="#ccff00"/>
    
          <path d="M44 32 
                   L34 36 
                   A10 10 0 0 0 34 28 Z" 
                fill="#446600" stroke="#ccff00"/>
    
          <path d="M20 32 
                   L30 36 
                   A10 10 0 0 0 30 28 Z" 
                fill="#446600" stroke="#ccff00"/>
    
          
          <circle cx="32" cy="32" r="18" stroke="#77ff00" stroke-dasharray="4,3"/>
          <circle cx="32" cy="32" r="26" stroke="#55aa00" stroke-dasharray="6,4"/>
    
        </g>
      `
    },
    crystalOrb: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" rx="16"/>
        <g stroke="#ff4444" stroke-width="2" fill="none">
          
          <!-- Центральный шар -->
          <circle cx="32" cy="32" r="8" fill="#880000" stroke="#ff5555"/>
          
          <!-- Лучи света / эффекты -->
          <path d="M32 12 
                   L36 22 
                   A10 10 0 0 0 28 22 Z" 
                fill="#aa2222" stroke="#ff6666"/>
          
          <path d="M44 32 
                   L34 36 
                   A10 10 0 0 0 34 28 Z" 
                fill="#aa2222" stroke="#ff6666"/>
          
          <path d="M20 32 
                   L30 36 
                   A10 10 0 0 0 30 28 Z" 
                fill="#aa2222" stroke="#ff6666"/>
          
          <!-- Орбиты / энергетические кольца -->
          <circle cx="32" cy="32" r="18" stroke="#ff7777" stroke-dasharray="4,3"/>
          <circle cx="32" cy="32" r="26" stroke="#ff5555" stroke-dasharray="6,4"/>
          
        </g>
      `
    },
    crystalOrb2: {
      viewBox: '0 0 64 64',
      body: `
        <circle cx="32" cy="32" r="14" fill="url(#orbGradient)" stroke="#6b21a8" stroke-width="3"/>
        <circle cx="32" cy="32" r="6" fill="white" opacity="0.6"/>
        <path d="M22 48 Q32 54 42 48" stroke="#6b21a8" stroke-width="3" fill="none"/>
        <defs>
          <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#a855f7"/>
            <stop offset="100%" stop-color="#4c1d95"/>
          </radialGradient>
        </defs>
      `
    },
    crossedSwords: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" rx="16"/>
        <path d="M20 44 L44 20" stroke="#ff4444" stroke-width="4" stroke-linecap="round"/>
        <path d="M44 44 L20 20" stroke="#ff2222" stroke-width="4" stroke-linecap="round"/>
        <circle cx="32" cy="32" r="6" fill="#660000" stroke="#ff5555" stroke-width="2"/>
      `
    },
    downArrow: {
      viewBox: '0 0 64 64',
      body: `
        <rect width="64" height="64" rx="16"/>
        <path d="M32 16 L32 44" stroke="#ff3333" stroke-width="4" stroke-linecap="round"/>
        <path d="M20 34 L32 48 L44 34" fill="#cc0000" stroke="#ff6666" stroke-width="2"/>
        <circle cx="32" cy="16" r="4" fill="#ff5555"/>
      `
    },
    expBalance: {
      viewBox: "0 0 64 64",
      body: `
        <defs>
          <radialGradient id="expGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#4facfe" stop-opacity="1"/>
            <stop offset="100%" stop-color="#00f2fe" stop-opacity="0.2"/>
          </radialGradient>
        </defs>
        
        <!-- Сфера опыта -->
        <circle cx="45" cy="20" r="10" fill="url(#expGlow)" stroke="#00e1ff" stroke-width="2"/>
        <text x="45" y="25" font-size="10" text-anchor="middle" fill="#fff" font-weight="bold">XP</text>
        
        <!-- Нисходящая стрелка -->
        <path d="M20 15 L10 25 L20 25 L20 45 L30 45 L30 25 L40 25 Z"
          fill="#e63946" stroke="#9b2226" stroke-width="2"/>
        
        <!-- Баланс -->
        <rect x="28" y="50" width="8" height="8" fill="#ffd166" stroke="#ef476f" stroke-width="1.5" rx="2"/>
      `
    },
    infIp: {
      viewBox: "0 0 64 64",
      body: `
        <defs>
          <radialGradient id="infAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#8a00d4" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.1"/>
          </radialGradient>
          <radialGradient id="ipCrystal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffea00" stop-opacity="1"/>
            <stop offset="100%" stop-color="#ffd166" stop-opacity="0.2"/>
          </radialGradient>
        </defs>
    
        <!-- Аура инф пенальти -->
        <circle cx="22" cy="32" r="14" fill="url(#infAura)"/>
    
        <!-- Череп -->
        <path d="M18 28 Q22 24 26 28 Q26 34 22 34 Q18 34 18 28 Z" fill="#2b2d42"/>
        <circle cx="20" cy="29" r="2" fill="#edf2f4"/>
        <circle cx="24" cy="29" r="2" fill="#edf2f4"/>
        <rect x="21" y="32" width="2" height="2" fill="#edf2f4"/>
    
        <!-- Кристалл IP -->
        <path d="M44 22 L50 32 L44 42 L38 32 Z"
          fill="url(#ipCrystal)" stroke="#ffba08" stroke-width="2"/>
        <text x="44" y="34" font-size="9" text-anchor="middle" fill="#6a040f" font-weight="bold">IP</text>
      `
    },
    ipMult: {
      viewBox: "0 0 64 64",
      body: `
        <defs>
          <radialGradient id="ipGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fff176"/>
            <stop offset="100%" stop-color="#f57f17"/>
          </radialGradient>
        </defs>
    
        <!-- Кристалл -->
        <path d="M32 8 L52 32 L32 56 L12 32 Z"
          fill="url(#ipGlow)" stroke="#ffab00" stroke-width="2"/>
    
      `
    },
    lvlReduction: {
      viewBox: "0 0 64 64",
      body: `
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#90caf9"/>
            <stop offset="100%" stop-color="#1565c0"/>
          </linearGradient>
        </defs>
    
        
        <path d="M32 8 L48 18 V34 C48 46 40 54 32 58 C24 54 16 46 16 34 V18 Z"
          fill="url(#shieldGrad)" stroke="#0d47a1" stroke-width="2"/>
    
        
        <path d="M32 20 L38 30 H26 Z" fill="#fff"/>
        <text x="32" y="52" font-size="10" text-anchor="middle" fill="#0d47a1" font-weight="bold">-LVL</text>
      `
    },
    apsDmg: {
      viewBox: "0 0 64 64",
      body: `
        <defs>
          <linearGradient id="apsBolt" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ffeb3b"/>
            <stop offset="100%" stop-color="#ff9800"/>
          </linearGradient>
        </defs>
    
        <!-- Молния -->
        <path d="M28 6 L42 24 L34 24 L40 44 L22 26 L30 26 Z"
          fill="url(#apsBolt)" stroke="#222" stroke-width="2"/>
    
        <!-- Стрелка преобразования -->
        <path d="M12 50 Q32 60 52 50" fill="none" stroke="#ff6d00" stroke-width="3" marker-end="url(#arrowHead)"/>
        <defs>
          <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L6,3 z" fill="#ff6d00"/>
          </marker>
        </defs>
      `
    },
    maxLevel: {
      viewBox: "0 0 64 64",
      body: `
        <defs>
          <linearGradient id="lvlUp" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#2196f3"/>
            <stop offset="100%" stop-color="#00e5ff"/>
          </linearGradient>
        </defs>
    
        <!-- Ступени -->
        <rect x="14" y="40" width="8" height="12" fill="url(#lvlUp)"/>
        <rect x="26" y="32" width="8" height="20" fill="url(#lvlUp)"/>
        <rect x="38" y="22" width="8" height="30" fill="url(#lvlUp)"/>
        <rect x="50" y="10" width="8" height="42" fill="url(#lvlUp)"/>
    
        <!-- Стрелка вверх -->
        <path d="M32 6 L40 16 H24 Z" fill="#00bcd4"/>
        <text x="32" y="58" font-size="10" text-anchor="middle" fill="#1976d2" font-weight="bold">LVL</text>
      `
    },
    crossedSkull: {
      viewBox: "0 0 64 64",
      body: `
        <circle cx="32" cy="32" r="30" stroke="#fff" stroke-width="2"/>
        <path d="M22 26 Q32 18 42 26 Q40 36 32 38 Q24 36 22 26Z" fill="#eee"/>
        <circle cx="26" cy="30" r="3" fill="#000"/>
        <circle cx="38" cy="30" r="3" fill="#000"/>
        <path d="M26 44 H38" stroke="#000" stroke-width="2"/>
        <line x1="18" y1="18" x2="46" y2="46" stroke="red" stroke-width="4"/> <!-- перечёркивание -->
      `
    },
    dangerSkull: {
      viewBox: "0 0 64 64",
      body: `
        <rect width="64" height="64" rx="16"/>
        <g fill="#ff1a1a" stroke="#7f0000" stroke-width="2">
          
          <path d="M20 24 Q32 10 44 24 Q48 36 44 46 Q32 58 20 46 Q16 36 20 24 Z" fill="#ff4d4d"/>
          
          <circle cx="24" cy="32" r="4" fill="#000"/>
          <circle cx="40" cy="32" r="4" fill="#000"/>
          
          <path d="M32 36 L28 44 L36 44 Z" fill="#000"/>
          
          <line x1="28" y1="46" x2="30" y2="46" stroke="#000" stroke-width="1"/>
          <line x1="32" y1="46" x2="34" y2="46" stroke="#000" stroke-width="1"/>
        </g>
        
        <circle cx="32" cy="32" r="18" fill="none" stroke="#ff6666" stroke-width="2" stroke-dasharray="3,3"/>
      `
    },
    bloodOath: {
      viewBox: '0 0 64 64',
      body: `
       
        <circle cx="32" cy="32" r="20" fill="#8b0000" stroke="#4b0000" stroke-width="3"/>
        
        <line x1="22" y1="22" x2="42" y2="42" stroke="#ff3333" stroke-width="3"/>
        <line x1="42" y1="22" x2="22" y2="42" stroke="#ff3333" stroke-width="3"/>
       
        <path d="M32 12 C28 20, 36 20, 32 28 C28 20, 36 20, 32 12 Z" fill="#cc0000"/>
      `
    },
    witheredAegis: {
      viewBox: "0 0 64 64",
      body: `
        <circle cx="32" cy="32" r="28" fill="#222" stroke="#555" stroke-width="3"/>
        <path d="M32 10 L52 20 L46 54 L18 54 L12 20 Z"
          fill="#444" stroke="#aaa" stroke-width="2"/>
        <path d="M32 22 L32 42 M22 32 L42 32"
          stroke="#2ecc71" stroke-width="3" stroke-linecap="round"/>
      `
    },
    blindJustice: {
      viewBox: "0 0 64 64",
      body: `
        <circle cx="32" cy="32" r="28" fill="#111" stroke="#666" stroke-width="3"/>
        <path d="M16 28 L48 28 M16 36 L48 36"
          stroke="#fff" stroke-width="3"/>
        <circle cx="24" cy="32" r="6" fill="#ff0" stroke="#000" stroke-width="2"/>
        <circle cx="40" cy="32" r="6" fill="#ff0" stroke="#000" stroke-width="2"/>
      `
    },
    shackledSpeed: {
      viewBox: "0 0 64 64",
      body: `
        <circle cx="32" cy="32" r="28" fill="#111" stroke="#888" stroke-width="3"/>
        <path d="M32 14 A18 18 0 1 1 31.9 14" 
          fill="none" stroke="#0af" stroke-width="3"/>
        <path d="M32 32 L44 20" stroke="#0af" stroke-width="3" stroke-linecap="round"/>
        <rect x="28" y="28" width="8" height="8" fill="#555" stroke="#aaa" stroke-width="2"/>
        <line x1="26" y1="44" x2="38" y2="44" stroke="#aaa" stroke-width="2"/>
      `
    },
    famineToll: {
      viewBox: "0 0 64 64",
      body: `
        <circle cx="32" cy="32" r="28" fill="#222" stroke="#444" stroke-width="3"/>
        <path d="M22 22 H42 V42 H22 Z"
          fill="#333" stroke="#777" stroke-width="2"/>
        <line x1="22" y1="32" x2="42" y2="32" stroke="#ffcc00" stroke-width="3"/>
        <line x1="32" y1="22" x2="32" y2="42" stroke="#ffcc00" stroke-width="3"/>
        <circle cx="32" cy="32" r="5" fill="#000" stroke="#ff0" stroke-width="2"/>
      `
    },
    perditionPoverty: {
      viewBox: '0 0 64 64',
      body: `
       
        <circle cx="32" cy="32" r="20" fill="#d4af37" stroke="#8c6f1d" stroke-width="3"/>
        
        <path d="M22 22 L28 32 L24 42" stroke="#5a4310" stroke-width="2" fill="none"/>
        <path d="M40 20 L34 30 L42 40" stroke="#5a4310" stroke-width="2" fill="none"/>
       
        <circle cx="48" cy="50" r="3" fill="#8c6f1d"/>
        <circle cx="16" cy="48" r="2" fill="#8c6f1d"/>
      `
    },
    perditionReflexes: {
      viewBox: "0 0 64 64",
      body: `
        <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet">
          <circle cx="32" cy="32" r="30" fill="#081218" stroke="#0f2a2a" stroke-width="2"/>
          <!-- Shield -->
          <path d="M32 8 L18 16 V34 C18 46, 26 54, 32 56 C38 54, 46 46, 46 34 V16 Z"
                fill="#12343a" stroke="#1fbfa6" stroke-width="2" stroke-linejoin="round"/>
          <!-- Heart -->
          <path d="M32 24
                   C29 20, 24 20, 24 24
                   C24 28, 32 34, 32 34
                   C32 34, 40 28, 40 24
                   C40 20, 35 20, 32 24 Z"
                fill="#e84d61" stroke="#ff9aa2" stroke-width="1.5" stroke-linejoin="round"/>
          <!-- Spark (avoid) -->
          <path d="M46 14 L42 18 L46 22 L42 20 L38 24"
                fill="none" stroke="#a6f0d6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
    },
    perditionResilience: {
      viewBox: "0 0 64 64",
      body: `
        <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet">
          <circle cx="32" cy="32" r="30" fill="#0b0b12" stroke="#2a1f1f" stroke-width="2"/>
          <!-- Plate / shield front -->
          <rect x="16" y="12" width="32" height="40" rx="6" ry="6"
                fill="#2d3b3f" stroke="#7fb6b1" stroke-width="2"/>
          <!-- Down arrow (reduced) -->
          <path d="M32 20 V36" stroke="#ffd27d" stroke-width="2" stroke-linecap="round"/>
          <path d="M28 32 L32 36 L36 32" fill="#ffd27d" stroke="#ffd27d" stroke-width="1.2" stroke-linejoin="round"/>
          <!-- Small cracked explosion behind, toned down -->
          <path d="M46 18 L42 22 M46 46 L42 42 M18 18 L22 22 M18 46 L22 42"
                stroke="#ff9a66" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      `
    },
    perditionOnslaught: {
      viewBox: "0 0 64 64",
      body: `
        <svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet">
          <circle cx="32" cy="32" r="30" fill="#071020" stroke="#172a2f" stroke-width="2"/>
          <!-- Small stopwatch -->
          <circle cx="32" cy="32" r="16" fill="#0f2a36" stroke="#3ee0d6" stroke-width="2"/>
          <rect x="30" y="12" width="4" height="6" rx="1" ry="1" fill="#3ee0d6" />
          <!-- 0.1 hint: dot and line -->
          <text x="32" y="38" font-size="8" text-anchor="middle" fill="#caffff" font-family="Arial">0.1s</text>
          <!-- Fast arrow / lightning -->
          <path d="M42 28 L36 36 L40 36 L34 46" fill="none" stroke="#ffd27d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `
    },
    transcendency: {
      viewBox: "0 0 64 64",
      body: `
        svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="#FFD700" stroke-width="2"/>
          <path d="M12 2 L12 22 M2 12 L22 12" stroke="#FFD700" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="4" fill="#FF55FF"/>
        </svg>
      `
    },
    darkEnergy: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
         
          <circle cx="32" cy="32" r="30" fill="black" stroke="purple" stroke-width="2" opacity="0.6"/>
          <circle cx="32" cy="32" r="20" fill="none" stroke="violet" stroke-width="2" stroke-dasharray="6 4" opacity="0.7"/>

          
          <path d="M32 8 Q40 16 32 24 Q24 32 32 40 Q40 48 32 56" 
                stroke="violet" stroke-width="2" fill="none" opacity="0.8"/>
          <path d="M32 8 Q24 16 32 24 Q40 32 32 40 Q24 48 32 56" 
                stroke="purple" stroke-width="2" fill="none" opacity="0.8"/>

          
          <circle cx="32" cy="32" r="10" fill="url(#grad)" />

          
          <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="violet" stop-opacity="1"/>
              <stop offset="100%" stop-color="black" stop-opacity="0.8"/>
            </radialGradient>
          </defs>
        </svg>

      `
    },
    darkDangerEnemy: {
      viewBox: "0 0 64 64",
      body: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
        <defs>
          <radialGradient id="aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#222" stop-opacity="1"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <circle cx="32" cy="32" r="30" fill="url(#aura)"/>

        <path d="M32 8 
                C25 16, 20 26, 22 40
                C23 48, 28 54, 32 58
                C36 54, 41 48, 42 40
                C44 26, 39 16, 32 8Z"
              fill="#0a0a0a" stroke="#5e0f8b" stroke-width="1.5"/>

        <ellipse cx="26" cy="30" rx="3" ry="5" fill="#e6e6e6"/>
        <ellipse cx="38" cy="30" rx="3" ry="5" fill="#e6e6e6"/>
      </svg>

      `
    },
    nextDim: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Gravity Rift">
          <defs>
            <style>
              .g-core { fill: var(--rift-core, #0b0b0f); }
              .g-glow { fill: url(#gradGlow); opacity: 0.85; }
              .g-crack { stroke: var(--rift-crack, #9a6cff); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; fill: none; }
              .g-debris { fill: var(--rift-debris, #bda3ff); opacity: 0.95; }
              .g-distort { stroke: var(--rift-distort, #5d1fa8); stroke-width: 1.0; fill: none; opacity: 0.7; }
            </style>

            <radialGradient id="gradGlow" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stop-color="#3a117a" stop-opacity="0.85"/>
              <stop offset="60%" stop-color="#120016" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </radialGradient>

            <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          
          <circle class="g-glow" cx="32" cy="30" r="22" filter="url(#softBlur)"/>

          
          <path class="g-core" d="M30 20 C28 26 28 38 30 44 C32 50 34 50 34 44 C36 38 36 26 34 20 C32 14 30 14 30 20 Z"/>

         
          <path class="g-crack" d="M30.5 22 L24 18" />
          <path class="g-crack" d="M33.5 22 L40 18" />
          <path class="g-crack" d="M30 40 L22 46" />
          <path class="g-crack" d="M34 40 L44 50" />
          <path class="g-crack" d="M31 28 L16 30" />
          <path class="g-crack" d="M35 28 L48 30" />

         
          <path class="g-distort" d="M12 14 C18 20, 22 26, 28 28" />
          <path class="g-distort" d="M52 14 C46 20, 42 26, 36 28" />
          <path class="g-distort" d="M10 42 C18 36, 24 34, 30 32" />
          <path class="g-distort" d="M54 42 C46 36, 40 34, 34 32" />

        
          <g>
            <circle class="g-debris" cx="18" cy="20" r="0.9" />
            <circle class="g-debris" cx="14" cy="30" r="1.0" />
            <circle class="g-debris" cx="50" cy="22" r="0.9" />
            <circle class="g-debris" cx="52" cy="36" r="0.9" />
            <circle class="g-debris" cx="24" cy="52" r="0.8" />
            <circle class="g-debris" cx="40" cy="52" r="0.9" />
          </g>

        
          <ellipse cx="32" cy="30" rx="6.5" ry="8" fill="#2a0540" opacity="0.55"/>
        </svg>

      `
    },
    nextDim2: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="red" stroke-width="2">
          <!-- Воронка гравитации -->
          <ellipse cx="32" cy="20" rx="18" ry="6" fill="url(#grad1)" stroke="red"/>
          <path d="M14 20 Q32 35 50 20" fill="none" stroke="red"/>

          <!-- Разлом вниз -->
          <path d="M32 20 L28 28 L34 36 L30 44 L36 52" fill="none" stroke="red"/>

          <!-- Каменные обломки -->
          <circle cx="20" cy="30" r="2" fill="gray" stroke="black"/>
          <circle cx="44" cy="28" r="2" fill="gray" stroke="black"/>
          <circle cx="26" cy="40" r="3" fill="darkgray" stroke="black"/>
          <circle cx="38" cy="46" r="2.5" fill="darkgray" stroke="black"/>

          <!-- Градиент для воронки -->
          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="black"/>
              <stop offset="100%" stop-color="darkslategray"/>
            </radialGradient>
          </defs>
        </svg>

      `
    },
    corruptionDim: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="Corruption">
         
          <style>
            :root{
              --cor-core: #07060a;     
              --cor-acid:rgb(252, 43, 245);      
              --cor-glow:rgb(248, 75, 248);     
              --cor-crack:rgb(235, 91, 33);     
            }
          </style>

          <defs>
            
            <radialGradient id="gGlow" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stop-color="var(--cor-glow)" stop-opacity="0.65"/>
              <stop offset="60%" stop-color="var(--cor-acid)" stop-opacity="0.18"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </radialGradient>

            <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2"/>
            </filter>

          
            <filter id="innerShadow">
              <feOffset dx="0" dy="1" result="off"/>
              <feGaussianBlur in="off" stdDeviation="1.5" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="-1" k3="1"/>
            </filter>
          </defs>

        
          <circle cx="32" cy="30" r="22" fill="url(#gGlow)" filter="url(#blur)" />

         
          <ellipse cx="32" cy="32" rx="12.5" ry="13.5" fill="var(--cor-core)" stroke="rgba(0,0,0,0.6)" stroke-width="1.2" filter="url(#innerShadow)"/>

         
          <g stroke="var(--cor-crack)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none">
            <path d="M32 19 L29 25 L25 28" />
            <path d="M32 19 L35 24 L39 28" />
            <path d="M24 30 L28 34 L30 38" />
            <path d="M40 30 L36 36 L34 40" />
            <path d="M28 44 L32 38 L36 44" />
          </g>

         
          <g fill="var(--cor-acid)" stroke="rgba(0,0,0,0.12)" stroke-width="0.4">
            <path d="M18 36 C20 34, 22 34, 24 36 C23 39, 21 42, 18 44 C17 42,17 38,18 36 Z"/>
            <path d="M46 36 C44 34, 42 34, 40 36 C41 39,43 42,46 44 C47 42,47 38,46 36 Z"/>
            <!-- центральный капающий поток -->
            <path d="M32 44 C33 42,33 40,31 38 C30 36,30 38,30 40 C30 42,31 44,32 46 C33 44,33 44,32 44 Z"/>
          </g>

          
          <g fill="var(--cor-glow)" opacity="0.9">
            <ellipse cx="37" cy="26" rx="1.6" ry="2.2" />
            <ellipse cx="27" cy="28" rx="1.1" ry="1.6" />
            <circle cx="34" cy="34" r="0.9" />
          </g>

          <g fill="none" stroke="rgba(0,0,0,0.7)" stroke-width="0.9">
            <ellipse cx="32" cy="32" rx="12.5" ry="13.5" />
          </g>
        </svg>

      `
    },
    cursePower: {
      viewBox: "0 0 64 64",
      body: `
        <!-- SVG: Curse Buff (amulet with upward rune) -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Curse buff icon">
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stop-color="#8b5cf6" />
                <stop offset="60%" stop-color="#a78bfa" />
                <stop offset="100%" stop-color="#f472b6" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="g2" cx="30%" cy="30%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#000000" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- background circle with subtle stroke -->
            <circle cx="64" cy="64" r="56" fill="#0b0220" stroke="#2a0b3a" stroke-width="4" />

            <!-- purple aura glow -->
            <g filter="url(#glow)">
              <circle cx="64" cy="64" r="46" fill="url(#g1)" fill-opacity="0.12" />
              <g transform="translate(0, -4)">
                <!-- amulet body -->
                <ellipse cx="64" cy="66" rx="28" ry="36" fill="#1b0730" stroke="url(#g1)" stroke-width="2" />

                <!-- inner gem / rune plate -->
                <path d="M64 44 C78 44, 86 56, 74 72 C64 86, 54 80, 50 72 C42 58, 50 44, 64 44 Z"
                      fill="url(#g1)" fill-opacity="0.95" stroke="#2b0930" stroke-width="1" />

                <!-- central rune (upward curse enhancer) -->
                <g transform="translate(64,64)">
                  <path d="M-8 10 L0 -14 L8 10 L4 10 L0 0 L-4 10 Z" fill="#0b0810" stroke="#ffe6ff" stroke-width="1" stroke-opacity="0.35" />
                  <!-- chevron upward to show 'strengthen' -->
                  <path d="M-12 -4 L0 -22 L12 -4" fill="none" stroke="#fff3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                </g>

                <!-- small runic sparks -->
                <g transform="translate(64,64)">
                  <circle cx="24" cy="-18" r="2.2" fill="#ffd5ff" fill-opacity="0.95" />
                  <circle cx="-20" cy="-14" r="1.6" fill="#ffd5ff" fill-opacity="0.85" />
                  <circle cx="14" cy="16" r="1.2" fill="#ffd5ff" fill-opacity="0.8" />
                </g>

                <!-- hanging loop -->
                <path d="M64 26 C66 20, 62 18, 60 26" stroke="#2a0b3a" stroke-width="3" fill="none" stroke-linecap="round" />
              </g>
            </g>

            <!-- overlay shine -->
            <ellipse cx="56" cy="52" rx="22" ry="10" fill="url(#g2)" opacity="0.6" />

            <!-- subtle border accent -->
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2" />

          </svg>


      `
    },
    dBuffs: {
      viewBox: "0 0 64 64",
      body: `
        <!-- SVG: Buff Icon (shield with sparkles) -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Buff icon">
            <defs>
              <linearGradient id="buffGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#3b82f6" />
                <stop offset="100%" stop-color="#60a5fa" />
              </linearGradient>
              <filter id="buffGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- shield background -->
            <path d="M64 16 L96 40 L88 104 L64 112 L40 104 L32 40 Z" fill="url(#buffGrad)" stroke="#1e40af" stroke-width="3" filter="url(#buffGlow)" />

            <!-- sparkles / effect -->
            <g>
              <circle cx="64" cy="48" r="4" fill="#fef08a" />
              <circle cx="76" cy="68" r="3" fill="#fef08a" />
              <circle cx="52" cy="64" r="2.5" fill="#fef08a" />
              <circle cx="68" cy="88" r="3" fill="#fef08a" />
            </g>

            <!-- inner emblem / plus sign for buff -->
            <g transform="translate(64,64)">
              <rect x="-6" y="-14" width="12" height="28" fill="#fff" />
              <rect x="-14" y="-6" width="28" height="12" fill="#fff" />
            </g>
          </svg>
      `
    },
    infTree: {
      viewBox: "0 0 64 64",
      body:`
        <!-- SVG: Infinite Tree (canopy shaped like ∞, mirrored roots) -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Infinite Tree icon">
            <defs>
              <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#f59e0b"/>
                <stop offset="60%" stop-color="#facc15"/>
                <stop offset="100%" stop-color="#fde68a"/>
              </linearGradient>
              <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#7c3aed"/>
                <stop offset="100%" stop-color="#3b0764"/>
              </linearGradient>
              <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- starry background ring -->
            <circle cx="64" cy="64" r="58" fill="#0b0220" stroke="#1f1140" stroke-width="3"/>

            <!-- canopy: infinity sign -->
            <g filter="url(#softGlow)" transform="translate(0,-6)">
              <path d="M96 54c-8.5 0-15.8 6.2-24.3 14.7l-1.7 1.7c-1.2 1.2-3.1 1.2-4.3 0l-1.7-1.7C54.5 60.2 47.2 54 38.7 54 29 54 21 62 21 71.7S29 89.4 38.7 89.4c8.5 0 15.8-6.2 24.3-14.7l1.7-1.7c1.2-1.2 3.1-1.2 4.3 0l1.7 1.7c8.5 8.5 15.8 14.7 24.3 14.7 9.7 0 17.7-8 17.7-17.7S105.7 54 96 54Z"
                  fill="none" stroke="url(#leafGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            </g>

            <!-- trunk -->
            <path d="M64 70c-1 6-2 10-2 16 0 4 0 8 1 12" fill="none" stroke="url(#woodGrad)" stroke-width="6" stroke-linecap="round"/>

            <!-- roots: mirrored infinity hint -->
            <g transform="translate(0,18)">
              <path d="M96 84c-6 0-11-3.2-18-9.2M32 84c6 0 11-3.2 18-9.2" fill="none" stroke="#6d28d9" stroke-opacity="0.9" stroke-width="3" stroke-linecap="round"/>
              <path d="M64 96c-6-6-12-8-18-8M64 96c6-6 12-8 18-8" fill="none" stroke="#6d28d9" stroke-opacity="0.7" stroke-width="3" stroke-linecap="round"/>
              <path d="M64 98c-3 4-6 6-10 7M64 98c3 4 6 6 10 7" fill="none" stroke="#6d28d9" stroke-opacity="0.5" stroke-width="2.5" stroke-linecap="round"/>
            </g>

            <!-- small sparkles -->
            <g>
              <circle cx="28" cy="40" r="1.6" fill="#fff" opacity="0.6"/>
              <circle cx="102" cy="46" r="1.8" fill="#fff" opacity="0.6"/>
              <circle cx="88" cy="32" r="1.4" fill="#fff" opacity="0.45"/>
            </g>

            <!-- subtle highlight on canopy -->
            <path d="M34 62c8-6 16-2 24 6" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="3" stroke-linecap="round"/>
          </svg>

      `
    },
    apsPenalty: {
      viewBox: "0 0 64 64",
      body: `
        <!-- SVG: Speed Icon (lightning + motion lines) -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Speed icon">
            <defs>
              <linearGradient id="speedGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ffcc00"/>
                <stop offset="100%" stop-color="#ff6b00"/>
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b"/>
                <feMerge>
                  <feMergeNode in="b"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <!-- circular background -->
            <circle cx="64" cy="64" r="56" fill="#071022" stroke="#1a2a44" stroke-width="3" />

            <!-- motion lines -->
            <g transform="translate(10,0)" stroke="#ffd89b" stroke-width="3" stroke-linecap="round" opacity="0.9">
              <path d="M8 44 H44" />
              <path d="M8 60 H52" opacity="0.8" />
              <path d="M8 76 H60" opacity="0.6" />
            </g>

            <!-- lightning bolt -->
            <g transform="translate(20,6)" filter="url(#glow)">
              <path d="M52 20 L32 58 L48 58 L28 100 L76 52 L56 52 L72 20 Z" fill="url(#speedGrad)" stroke="#fff2c8" stroke-width="1.5" stroke-linejoin="round"/>
            </g>

            <!-- small accent spark -->
            <polygon points="96,36 100,46 92,42 104,42 96,36" fill="#ffd89b" opacity="0.9" />

          </svg>

      `
    },
    forge: {
      viewBox: "0 0 64 64",
      body: `
        <!-- SVG: Forge / Blacksmith Icon (flat, high-contrast, optimized for 64x64) -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Forge icon">
            <defs>
              <linearGradient id="gMetal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#e6edf3"/>
                <stop offset="100%" stop-color="#9aa4ad"/>
              </linearGradient>
            </defs>

            <!-- solid circular background for strong silhouette -->
            <circle cx="64" cy="64" r="56" fill="#0f1724" />

            <!-- anvil (clean silhouette) -->
            <g transform="translate(0,6)">
              <path d="M22 72 H36 L44 60 H84 L92 72 H106 L98 82 H30 Z" fill="url(#gMetal)" stroke="#121821" stroke-width="2" stroke-linejoin="round"/>
              <!-- anvil horn simplified -->
              <path d="M44 60 C48 54, 60 54, 64 60" fill="#c7ccd1" stroke="#121821" stroke-width="1.2" stroke-linecap="round"/>
              <!-- base -->
              <rect x="32" y="82" width="64" height="6" rx="2" fill="#0b1220" />
            </g>

            <!-- hammer (bold, readable at small sizes) -->
            <g transform="rotate(-25 64 64)">
              <rect x="70" y="28" width="8" height="34" rx="1" fill="#2b2f36" />
              <rect x="60" y="24" width="28" height="10" rx="2" fill="#1b1f25" />
              <rect x="62" y="22" width="24" height="4" rx="1" fill="#c7ccd1" />
            </g>

            <!-- sparks (minimal, crisp) -->
            <g>
              <circle cx="56" cy="70" r="2.4" fill="#ffd166" />
              <circle cx="72" cy="68" r="1.8" fill="#ffd166" />
              <path d="M84 76 L86 72" stroke="#ffd166" stroke-width="1.4" stroke-linecap="round"/>
            </g>

            <!-- subtle rim to help readability on dark backgrounds -->
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2" />
          </svg>

      `
    },
    doom: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none">
       
        <circle cx="32" cy="32" r="28" fill="black" stroke="red" stroke-width="2"/>
        
       
        <path d="M32 10 L34 22 L28 30 L36 38 L30 50" stroke="red" stroke-width="2" fill="none"/>
        <path d="M22 20 L28 26 L24 36 L26 46" stroke="darkred" stroke-width="2" fill="none"/>
        <path d="M42 18 L40 28 L46 34 L42 44" stroke="crimson" stroke-width="2" fill="none"/>
        
        
        <circle cx="32" cy="32" r="30" stroke="darkred" stroke-width="1" stroke-dasharray="4 4" fill="none"/>
      </svg>

      `
    },
    antiRadiation: {
      viewBox: "0 0 64 64",
      body: `
        <!-- SVG: Anti-Radiation Alternative (leaf + neutralized trefoil), optimized for 64x64, no shield -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Anti-radiation alternative icon">
            <defs>
              <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#34d399"/>
                <stop offset="100%" stop-color="#059669"/>
              </linearGradient>
              <linearGradient id="coreG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#fef3c7"/>
                <stop offset="100%" stop-color="#f97316"/>
              </linearGradient>
            </defs>

            <!-- dark circle backdrop for contrast -->
            <circle cx="64" cy="64" r="56" fill="#08121a" stroke="#0d2a2a" stroke-width="3" />

            <!-- neutralized trefoil (muted color) -->
            <g transform="translate(64,62)" fill="#223232" opacity="0.95">
              <path d="M0 -6 L9 -2 A18 18 0 0 1 0 14 A18 18 0 0 1 -9 -2 Z" />
              <path d="M0 -6 L6 10 A18 18 0 0 1 -10 2 A18 18 0 0 1 0 -6 Z" transform="rotate(120)" />
              <path d="M0 -6 L6 10 A18 18 0 0 1 -10 2 A18 18 0 0 1 0 -6 Z" transform="rotate(240)" />
              <circle cx="0" cy="0" r="4" />
            </g>

            <!-- leaf overlay (green neutralizer) -->
            <g transform="translate(64,72) rotate(-20)">
              <path d="M0 -28 C18 -24, 34 -8, 34 8 C18 2, 2 18, -12 22 C-10 6, -6 -12, 0 -28 Z" fill="url(#leafG)" stroke="#045e46" stroke-width="1.2"/>
              <!-- leaf vein -->
              <path d="M0 -20 C6 -12, 12 -2, 14 6" fill="none" stroke="#0f513f" stroke-width="1.2" stroke-linecap="round"/>
            </g>

            <!-- neutralizing sparkles / particles -->
            <g>
              <circle cx="42" cy="44" r="1.6" fill="#a7f3d0" opacity="0.95" />
              <circle cx="86" cy="48" r="1.8" fill="#a7f3d0" opacity="0.9" />
              <path d="M74 36 L76 42" stroke="#a7f3d0" stroke-width="1.2" stroke-linecap="round"/>
            </g>

            <!-- diagonal soft slash to indicate 'anti' (subtle, not a prohibitory sign) -->
            <path d="M40 96 L88 40" stroke="#ffffff" stroke-opacity="0.12" stroke-width="6" stroke-linecap="round"/>

            <!-- rim highlight -->
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
          </svg>

      `
    },
    maxLevelReduction: {
      viewBox: "0 0 64 64",
      body: `
        <!-- SVG: Debuff Tick Icon (clock + minus, indicates a debuff applied every second) -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Debuff-Tick icon">
            <defs>
              <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#0b1020"/>
                <stop offset="100%" stop-color="#121827"/>
              </linearGradient>
              <linearGradient id="tickGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#ff7a7a"/>
                <stop offset="100%" stop-color="#ff3b3b"/>
              </linearGradient>
            </defs>

            <!-- dark circular background -->
            <circle cx="64" cy="64" r="56" fill="url(#bgGrad)" stroke="#0f1724" stroke-width="3" />

            <!-- clock face -->
            <circle cx="64" cy="58" r="26" fill="#0b1220" stroke="#2b2f3a" stroke-width="3" />
            <!-- hour markers (subtle) -->
            <g stroke="#3a3f4a" stroke-width="2" stroke-linecap="round">
              <path d="M64 34 L64 38" />
              <path d="M64 78 L64 82" />
              <path d="M90 58 L86 58" />
              <path d="M42 58 L38 58" />
            </g>

            <!-- second hand (pointing down-right) -->
            <g transform="translate(64,58)">
              <line x1="0" y1="0" x2="14" y2="18" stroke="url(#tickGrad)" stroke-width="3" stroke-linecap="round" />
              <circle cx="0" cy="0" r="3" fill="#ffd6d6" />
            </g>

            <!-- small minus badge to indicate debuff -->
            <g transform="translate(88,88)">
              <circle cx="0" cy="0" r="14" fill="url(#tickGrad)" stroke="#661010" stroke-width="2" />
              <rect x="-7" y="-2" width="14" height="4" rx="1" fill="#fff7f7" />
            </g>

            <!-- radial ticks around clock to hint 'every second' -->
            <g stroke="#2e2f36" stroke-width="1.6">
              <path d="M64 24 L64 28" transform="rotate(0 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(30 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(60 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(90 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(120 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(150 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(180 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(210 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(240 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(270 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(300 64 58)" />
              <path d="M64 24 L64 28" transform="rotate(330 64 58)" />
            </g>

            <!-- subtle outer rim highlight -->
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="2" />
          </svg>

      `
    },
    celestials: {
      viewBox: "0 0 64 64",
      body: `
        <!-- SVG: Celestials Icon (halo + radiant star + subtle wings), optimized for 64x64 -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Celestials icon">
            <defs>
              <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#facc15"/>
                <stop offset="100%" stop-color="#f59e0b"/>
              </linearGradient>
              <linearGradient id="aura" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#60a5fa"/>
                <stop offset="100%" stop-color="#22d3ee"/>
              </linearGradient>
              <radialGradient id="glow" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stop-color="#ffffff" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
              </radialGradient>
            </defs>

            <!-- cosmic backdrop -->
            <circle cx="64" cy="64" r="56" fill="#070b18" stroke="#142038" stroke-width="3" />

            <!-- halo ring -->
            <ellipse cx="64" cy="44" rx="28" ry="10" fill="none" stroke="url(#gold)" stroke-width="4"/>

            <!-- radiant 8-point star -->
            <g transform="translate(64,66)">
              <!-- outer rays -->
              <path d="M0 -22 L4 -6 L22 0 L4 6 L0 22 L-4 6 L-22 0 L-4 -6 Z" fill="url(#gold)"/>
              <!-- inner diamond core -->
              <path d="M0 -10 L10 0 L0 10 L-10 0 Z" fill="#fff6c2"/>
            </g>

            <!-- subtle wings -->
            <g fill="url(#aura)" opacity="0.75">
              <path d="M24 64 C36 54, 48 50, 58 54 C50 62, 40 68, 26 70 C24 68, 23 66, 24 64 Z"/>
              <path d="M104 64 C92 54, 80 50, 70 54 C78 62, 88 68, 102 70 C104 68, 105 66, 104 64 Z"/>
            </g>

            <!-- soft inner glow under star -->
            <circle cx="64" cy="66" r="24" fill="url(#glow)"/>

            <!-- star sparks -->
            <g fill="#eaf2ff" opacity="0.9">
              <circle cx="34" cy="38" r="1.6"/>
              <circle cx="96" cy="40" r="1.6"/>
              <circle cx="84" cy="28" r="1.2"/>
            </g>

            <!-- rim highlight -->
            <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2"/>
          </svg>

      `
    },
    deRegen: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
 
        <rect width="64" height="64" fill="black"/>
        <!-- Символ регенерации -->
        <circle cx="32" cy="32" r="28" stroke="#a020f0" stroke-width="3" fill="none"/>
        <path d="M32 12a20 20 0 1 1-14.14 5.86" stroke="#a020f0" stroke-width="3" fill="none"/>
        <polygon points="14,16 24,16 19,6" fill="#a020f0"/>
      </svg>
      `
    },
    deDef: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
          <rect width="64" height="64" fill="black"/>
          <path d="M32 4 L60 14 L50 54 L14 54 L4 14 Z" 
                stroke="#a020f0" stroke-width="3" fill="none"/>
          <circle cx="32" cy="32" r="10" fill="black" stroke="#a020f0" stroke-width="3"/>
        </svg>
      `
    },
    deIgnoreDef: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
          <rect width="64" height="64" fill="black"/>
          <circle cx="32" cy="32" r="28" stroke="#a020f0" stroke-width="3" fill="none"/>
          <line x1="16" y1="16" x2="48" y2="48" stroke="#a020f0" stroke-width="3"/>
          <line x1="48" y1="16" x2="16" y2="48" stroke="#a020f0" stroke-width="3"/>
        </svg>
      `
    },
    spaceTimer: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
          <rect width="64" height="64" fill="black"/>
          <circle cx="32" cy="32" r="28" stroke="#e6f020" stroke-width="3" fill="none"/>
          <line x1="16" y1="16" x2="48" y2="48" stroke="#e6f020" stroke-width="3"/>
          <line x1="48" y1="16" x2="16" y2="48" stroke="#e6f020" stroke-width="3"/>
        </svg>
      `
    },
    advanceBH: {
      viewBox: "0 0 64 64",
      body: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="64" height="64" role="img" aria-label="Black Hole icon">
          <defs>
            <!-- core: very dark center -->
            <radialGradient id="bhCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#000000"/>
              <stop offset="40%" stop-color="#020204"/>
              <stop offset="100%" stop-color="#06060a"/>
            </radialGradient>

            <!-- accretion disk gradient -->
            <linearGradient id="diskGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#ffd580"/>
              <stop offset="40%" stop-color="#ff7a18"/>
              <stop offset="70%" stop-color="#c100ff"/>
              <stop offset="100%" stop-color="#5b00b8"/>
            </linearGradient>

            <!-- subtle glow around disk -->
            <radialGradient id="diskGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
              <stop offset="40%" stop-color="#ffd580" stop-opacity="0.06"/>
              <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
            </radialGradient>

            <!-- slight blur filter (keeps small and cheap) -->
            <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.6"/>
            </filter>
          </defs>

          <!-- dark backdrop for contrast (useful if page background is dark also; change/remove if needed) -->
          <rect width="100%" height="100%" fill="transparent"/>

          <!-- faint distant stars -->
          <g fill="#ffffff" fill-opacity="0.06">
            <circle cx="18" cy="20" r="1.2"/>
            <circle cx="106" cy="30" r="1.6"/>
            <circle cx="92" cy="14" r="1.0"/>
            <circle cx="34" cy="94" r="1.1"/>
            <circle cx="78" cy="104" r="1.3"/>
          </g>

          <!-- accretion disk glow layer (blurry) -->
          <ellipse cx="64" cy="64" rx="50" ry="24" fill="url(#diskGlow)" filter="url(#softBlur)"/>

          <!-- accretion disk (multi-layered for depth) -->
          <g transform="translate(0,-4)">
            <ellipse cx="64" cy="74" rx="52" ry="26" fill="url(#diskGrad)" opacity="0.98"/>
            <!-- inner darker ring -->
            <ellipse cx="64" cy="74" rx="36" ry="16" fill="#1b0a10" opacity="0.65"/>
            <!-- bright crescent highlight -->
            <path d="M36 66 C46 54, 82 54, 96 66 C82 62, 46 62, 36 66 Z" fill="#ffffff" fill-opacity="0.08"/>
          </g>

          <!-- spiral arms (suggesting motion) -->
          <g fill="none" stroke="#000000" stroke-opacity="0.25" stroke-width="1.2" stroke-linecap="round">
            <path d="M64 54 C76 56, 88 62, 100 76" />
            <path d="M64 58 C54 62, 44 70, 30 88" />
            <path d="M64 50 C70 44, 82 40, 98 38" />
          </g>

          <!-- event horizon (core) -->
          <circle cx="64" cy="64" r="18" fill="url(#bhCore)" stroke="#000000" stroke-width="1.5"/>

          <!-- subtle rim to define edge -->
          <circle cx="64" cy="64" r="34" fill="none" stroke="#000000" stroke-opacity="0.35" stroke-width="2"/>

          <!-- optional faint lens flare / jet hint -->
          <g fill="#ffffff" fill-opacity="0.04">
            <ellipse cx="64" cy="34" rx="6" ry="2"/>
            <ellipse cx="64" cy="92" rx="4" ry="1.4"/>
          </g>
        </svg>

      `
    }
            
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