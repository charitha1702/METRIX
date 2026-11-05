
export default function CityIllustration() {
    return (
      <div className="w-full max-w-[560px] mx-auto">
        <svg
          viewBox="0 0 620 430"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          fill="none"
        >
          {/* Soft background */}
          <circle cx="320" cy="205" r="175" fill="#eef0e8" />
          <circle cx="440" cy="125" r="48" fill="#e8e5ef" />
  
          {/* Ground */}
          <path
            d="M55 325 Q180 290 300 318 Q450 340 565 300"
            stroke="#a4b5a5"
            strokeWidth="2"
          />
  
          {/* Distant buildings */}
          <g stroke="#8c9c91" strokeWidth="2" strokeLinejoin="round">
            <path d="M115 205 L115 145 L155 145 L155 205" fill="#f5f3eb" />
            <path d="M125 145 L135 130 L145 145" fill="#e5e9df" />
            <path d="M175 210 L175 165 L215 165 L215 210" fill="#f3f0e8" />
            <path d="M175 165 L195 150 L215 165" fill="#e4e9e0" />
            <path d="M405 210 L405 155 L450 155 L450 210" fill="#f5f1e9" />
            <path d="M405 155 L427 138 L450 155" fill="#e4e9e0" />
          </g>
  
          {/* Main buildings */}
          <g stroke="#536d68" strokeWidth="2.2" strokeLinejoin="round">
            {/* Left building */}
            <path d="M205 290 L205 195 L285 195 L285 290" fill="#f5f1e8" />
            <path d="M195 195 L245 160 L295 195" fill="#dce7dd" />
            <path d="M220 215 H238 V239 H220 Z" fill="#e5e9e1" />
            <path d="M252 215 H270 V239 H252 Z" fill="#e5e9e1" />
            <path d="M237 254 H254 V290 H237 Z" fill="#e5e9e1" />
  
            {/* Central building */}
            <path d="M290 290 L290 165 L375 165 L375 290" fill="#f7f4ed" />
            <path d="M280 165 L332 128 L385 165" fill="#dfe8df" />
            <path d="M307 184 H326 V207 H307 Z" fill="#e6e9e1" />
            <path d="M340 184 H359 V207 H340 Z" fill="#e6e9e1" />
            <path d="M307 222 H326 V245 H307 Z" fill="#e6e9e1" />
            <path d="M340 222 H359 V245 H340 Z" fill="#e6e9e1" />
            <path d="M324 258 H342 V290 H324 Z" fill="#e6e9e1" />
  
            {/* Right building */}
            <path d="M390 290 L390 205 L465 205 L465 290" fill="#f5f1e8" />
            <path d="M380 205 L427 175 L475 205" fill="#e5e9df" />
            <path d="M405 222 H423 V245 H405 Z" fill="#e6e9e1" />
            <path d="M435 222 H453 V245 H435 Z" fill="#e6e9e1" />
            <path d="M420 260 H438 V290 H420 Z" fill="#e6e9e1" />
          </g>
  
          {/* Trees */}
          <g stroke="#718c79" strokeWidth="2" strokeLinecap="round">
            <path d="M145 300 V260" />
            <path d="M145 260 C115 260 118 230 140 233 C135 211 167 210 164 235 C187 230 185 261 145 260Z" fill="#dce8dd" />
            <path d="M490 300 V260" />
            <path d="M490 260 C462 260 465 230 487 233 C483 211 515 210 511 235 C535 230 531 261 490 260Z" fill="#dce8dd" />
          </g>
  
          {/* Curved road */}
          <path
            d="M45 370 Q180 320 300 350 Q445 390 575 345"
            stroke="#d6d1c5"
            strokeWidth="34"
            strokeLinecap="round"
          />
          <path
            d="M45 370 Q180 320 300 350 Q445 390 575 345"
            stroke="#faf8f2"
            strokeWidth="2"
            strokeDasharray="9 10"
          />
  
          {/* Small landscape details */}
          <g fill="#a5b5a4">
            <circle cx="95" cy="305" r="3" />
            <circle cx="180" cy="315" r="3" />
            <circle cx="530" cy="300" r="3" />
          </g>
  
          {/* Pencil-style detail strokes */}
          <g stroke="#9aa99c" strokeWidth="1" opacity="0.65">
            <path d="M215 189 L245 169 L278 190" />
            <path d="M300 159 L332 137 L365 159" />
            <path d="M400 199 L427 181 L458 199" />
          </g>
        </svg>
      </div>
    );
  }
  