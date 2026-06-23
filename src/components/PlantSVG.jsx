import React from 'react';

/**
 * PlantSVG component renders crisp inline SVG vectors representing
 * the plant at various growth stages and varieties.
 * 
 * @param {string} plantType - 'daisy' | 'tulip' | 'lavender' | 'fern' | 'sunflower' | 'lotus' | 'orchid' | 'rose'
 * @param {number} growthStage - 0 (Seed) | 1 (Sprout) | 2 (Sapling) | 3 (Bloom)
 * @param {string} color - Hex/HSL color string for petals
 * @param {boolean} isAnimated - Toggle wind/sway effect
 */
export default function PlantSVG({ plantType = 'daisy', growthStage = 0, color = '', isAnimated = true }) {
  // Common stem color
  const stemColor = '#5A7E6B';
  const leafColor = '#759B85';
  const soilColor = '#8A7558';
  
  // Animation classes
  const swayClass = isAnimated 
    ? (['fern', 'lavender', 'tulip'].includes(plantType) ? 'sway-medium' : 'sway-slow')
    : '';

  // 1. STAGE 0: SEED
  if (growthStage === 0) {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full animate-seed-drop" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ground Line */}
        <path d="M10,110 Q50,112 90,110" stroke="#CDBC9C" strokeWidth="3" strokeLinecap="round" />
        {/* Soil Mound */}
        <ellipse cx="50" cy="110" rx="18" ry="5" fill={soilColor} opacity="0.8" />
        {/* Glow */}
        <circle cx="50" cy="107" r="7" fill={color || 'var(--color-accent)'} opacity="0.3" filter="blur(2px)" />
        {/* Seed */}
        <path 
          d="M50,105 C48,105 46,108 50,111 C54,108 52,105 50,105 Z" 
          fill={color || 'var(--color-accent)'} 
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.5"
        />
        {/* Tiny sparkle */}
        <circle cx="50" cy="107" r="1.5" fill="#FFF" opacity="0.9" />
      </svg>
    );
  }

  // 2. STAGE 1: SPROUT
  if (growthStage === 1) {
    return (
      <svg viewBox="0 0 100 120" className="w-full h-full animate-sprout" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ground Line */}
        <path d="M10,110 Q50,112 90,110" stroke="#CDBC9C" strokeWidth="3" strokeLinecap="round" />
        {/* Soil Mound */}
        <ellipse cx="50" cy="110" rx="18" ry="5" fill={soilColor} opacity="0.8" />
        {/* Sprout Stem */}
        <path d="M50,110 Q49,98 50,90" stroke={stemColor} strokeWidth="3" strokeLinecap="round" />
        {/* Leaf Left */}
        <path d="M50,91 Q41,84 42,91 Q47,93 50,91 Z" fill={leafColor} />
        {/* Leaf Right */}
        <path d="M50,91 Q59,84 58,91 Q53,93 50,91 Z" fill={leafColor} />
        {/* Little dew drop */}
        <circle cx="50" cy="89" r="1" fill="#AED8E6" opacity="0.8" />
      </svg>
    );
  }

  // 3. STAGE 2: SAPLING (GROWING)
  if (growthStage === 2) {
    return (
      <svg viewBox="0 0 100 120" className={`w-full h-full animate-sprout ${swayClass}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ground Line */}
        <path d="M10,110 Q50,112 90,110" stroke="#CDBC9C" strokeWidth="3" strokeLinecap="round" />
        {/* Soil Mound */}
        <ellipse cx="50" cy="110" rx="20" ry="6" fill={soilColor} opacity="0.8" />
        {/* Curved stem */}
        <path d="M50,110 Q47,82 50,62" stroke={stemColor} strokeWidth="3.5" strokeLinecap="round" />
        {/* Lower Leaf Left */}
        <path d="M49,86 Q37,79 38,85 Q44,88 49,86 Z" fill={leafColor} />
        {/* Upper Leaf Right */}
        <path d="M50,74 Q62,67 61,73 Q55,77 50,74 Z" fill={leafColor} />
        {/* Calyx green backing */}
        <path d="M46,64 Q50,69 54,64 L50,70 Z" fill={stemColor} />
        {/* Sprouting Bud */}
        <ellipse cx="50" cy="61" rx="5.5" ry="8" fill={color || 'var(--color-accent)'} />
        <path d="M50,53 Q53,59 50,65 Q47,59 50,53 Z" fill="rgba(255,255,255,0.2)" />
      </svg>
    );
  }

  // 4. STAGE 3: FULL BLOOM
  return (
    <svg viewBox="0 0 100 120" className={`w-full h-full animate-bloom ${swayClass}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Ground Line */}
      <path d="M10,110 Q50,112 90,110" stroke="#CDBC9C" strokeWidth="3" strokeLinecap="round" />
      {/* Soil Mound */}
      <ellipse cx="50" cy="110" rx="22" ry="6" fill={soilColor} opacity="0.8" />

      {/* Render Plant by Type */}
      {plantType === 'daisy' && (
        <>
          {/* Stem */}
          <path d="M50,110 Q48,70 50,42" stroke={stemColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Leaves */}
          <path d="M49,82 Q35,76 39,83 Q45,84 49,82 Z" fill={leafColor} />
          <path d="M50,68 Q64,61 60,68 Q54,69 50,68 Z" fill={leafColor} />
          {/* Flower Head Group */}
          <g>
            {/* Petals (8 rotational ellipses) */}
            {Array.from({ length: 8 }).map((_, i) => (
              <ellipse 
                key={i} 
                cx="50" 
                cy="28" 
                rx="6.5" 
                ry="15" 
                fill={color || 'var(--blossom-daisy)'} 
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="0.5"
                transform={`rotate(${i * 45} 50 42)`} 
              />
            ))}
            {/* Flower Center Disc */}
            <circle cx="50" cy="42" r="7.5" fill="#ECAE3A" stroke="#C88E23" strokeWidth="0.5" />
            <circle cx="48" cy="40" r="2" fill="#FFF" opacity="0.3" />
          </g>
        </>
      )}

      {plantType === 'tulip' && (
        <>
          {/* Stem */}
          <path d="M50,110 Q53,74 50,45" stroke={stemColor} strokeWidth="4" strokeLinecap="round" />
          {/* Large tulip leaves */}
          <path d="M50,105 Q32,80 41,63 Q47,78 50,105 Z" fill={leafColor} opacity="0.9" />
          <path d="M50,96 Q68,69 59,53 Q53,70 50,96 Z" fill={leafColor} opacity="0.95" />
          {/* Flower Head */}
          <g>
            {/* Back petals */}
            <path d="M50,45 C41,45 38,18 50,18 C62,18 59,45 50,45 Z" fill={color || 'var(--blossom-tulip)'} opacity="0.8" />
            {/* Left petal */}
            <path d="M50,45 C36,45 32,23 44,22 C48,28 50,38 50,45 Z" fill={color || 'var(--blossom-tulip)'} />
            {/* Right petal */}
            <path d="M50,45 C64,45 68,23 56,22 C52,28 50,38 50,45 Z" fill={color || 'var(--blossom-tulip)'} />
            {/* Center overlap petal */}
            <path d="M50,45 C45,45 42,26 50,23 C58,26 55,45 50,45 Z" fill={color || 'var(--blossom-tulip)'} filter="brightness(1.05)" />
          </g>
        </>
      )}

      {plantType === 'lavender' && (
        <>
          {/* Stem */}
          <path d="M50,110 L50,32" stroke={stemColor} strokeWidth="3" strokeLinecap="round" />
          {/* Slender base leaves */}
          <path d="M50,100 Q36,92 40,84 Q46,90 50,100 Z" fill={leafColor} />
          <path d="M50,95 Q64,88 60,80 Q54,86 50,95 Z" fill={leafColor} />
          <path d="M50,85 Q35,80 42,72 Q47,76 50,85 Z" fill={leafColor} />
          <path d="M50,80 Q65,75 58,67 Q53,71 50,80 Z" fill={leafColor} />

          {/* Stacks of lavender buds */}
          <g>
            {[0, 1, 2, 3, 4, 5].map((level) => {
              const y = 72 - level * 8.5;
              const sizeScale = 1 - level * 0.08;
              return (
                <g key={level} transform={`translate(0, 0) scale(${sizeScale})`} style={{ transformOrigin: `50px ${y}px` }}>
                  {/* Left bud */}
                  <path d={`M50,${y} C41,${y-1} 39,${y-7} 50,${y-9}`} fill={color || 'var(--blossom-lavender)'} />
                  {/* Right bud */}
                  <path d={`M50,${y} C59,${y-1} 61,${y-7} 50,${y-9}`} fill={color || 'var(--blossom-lavender)'} />
                  {/* Center tiny bud */}
                  <circle cx="50" cy={y - 4} r="2.5" fill={color || 'var(--blossom-lavender)'} filter="brightness(1.1)" />
                </g>
              );
            })}
            {/* Top crown bud */}
            <ellipse cx="50" cy="23" rx="3.5" ry="6" fill={color || 'var(--blossom-lavender)'} />
          </g>
        </>
      )}

      {plantType === 'fern' && (
        <>
          {/* Main central stalk */}
          <path d="M50,110 Q42,60 52,22" stroke={stemColor} strokeWidth="4" strokeLinecap="round" />
          
          {/* Fractal-style leaflets */}
          <g>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              // Calc y positions along the curved stalk
              const y = 98 - i * 11;
              const scale = 1 - i * 0.12;
              const rotLeft = -25 - i * 2;
              const rotRight = 25 + i * 2;
              return (
                <g key={i}>
                  {/* Left Leaflet */}
                  <path 
                    d={`M50,${y} Q30,${y - 12} 24,${y - 2} Q38,${y + 4} 50,${y}`} 
                    fill={color || 'var(--blossom-fern)'} 
                    transform={`rotate(${rotLeft} 50 ${y}) scale(${scale})`}
                    opacity={0.85 + i * 0.02}
                  />
                  {/* Right Leaflet */}
                  <path 
                    d={`M50,${y} Q70,${y - 12} 76,${y - 2} Q62,${y + 4} 50,${y}`} 
                    fill={color || 'var(--blossom-fern)'} 
                    transform={`rotate(${rotRight} 50 ${y}) scale(${scale})`}
                    opacity={0.85 + i * 0.02}
                  />
                </g>
              );
            })}
            {/* Tip frond */}
            <path d="M52,22 Q53,12 51,10 Q49,15 50,22 Z" fill={color || 'var(--blossom-fern)'} />
          </g>
        </>
      )}

      {plantType === 'sunflower' && (
        <>
          {/* Stem */}
          <path d="M50,110 Q52,72 48,45" stroke={stemColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Large broad textured leaves */}
          <path d="M50,90 Q28,84 35,70 Q45,76 50,90 Z" fill={leafColor} />
          <path d="M49,74 Q68,69 61,56 Q53,60 49,74 Z" fill={leafColor} />
          {/* Flower head tilted slightly left */}
          <g transform="translate(0, 0)">
            {/* Golden Petals (12 radiating path blades) */}
            {Array.from({ length: 12 }).map((_, i) => (
              <path 
                key={i} 
                d="M48,45 C44,34 48,18 48,18 C48,18 52,34 48,45 Z" 
                fill={color || 'var(--blossom-sunflower)'} 
                stroke="rgba(0,0,0,0.05)"
                strokeWidth="0.5"
                transform={`rotate(${i * 30} 48 45)`} 
              />
            ))}
            {/* Seeds Center Disc */}
            <circle cx="48" cy="45" r="12" fill="#4B3319" stroke="#33210E" strokeWidth="0.75" />
            <circle cx="48" cy="45" r="9" fill="#3D2913" stroke="rgba(255,255,255,0.06)" strokeDasharray="2, 2" strokeWidth="1" />
            {/* Speckle details */}
            <circle cx="45" cy="43" r="1" fill="#ECAE3A" opacity="0.4" />
            <circle cx="51" cy="47" r="1.2" fill="#ECAE3A" opacity="0.4" />
          </g>
        </>
      )}

      {plantType === 'lotus' && (
        <>
          {/* Thick water/mud stem */}
          <path d="M50,110 L50,86" stroke={stemColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Flat lily pad leaf */}
          <ellipse cx="50" cy="88" rx="34" ry="7" fill="#3E5C4E" stroke="#2B4237" strokeWidth="1" />
          {/* Slice out of lily pad to make it authentic */}
          <path d="M50,88 L20,83 M50,88 L34,94 Z" stroke="#2B4237" strokeWidth="1" opacity="0.6" />

          {/* Lotus Bloom sitting directly on top */}
          <g>
            {/* Layer 1: Wide back petals */}
            <path d="M50,88 C24,84 14,64 38,62 C44,70 48,80 50,88 Z" fill={color || 'var(--blossom-lotus)'} opacity="0.75" />
            <path d="M50,88 C76,84 86,64 62,62 C56,70 52,80 50,88 Z" fill={color || 'var(--blossom-lotus)'} opacity="0.75" />
            {/* Layer 2: Side petals */}
            <path d="M50,88 C32,84 26,53 44,52 C47,68 49,80 50,88 Z" fill={color || 'var(--blossom-lotus)'} />
            <path d="M50,88 C68,84 74,53 56,52 C53,68 51,80 50,88 Z" fill={color || 'var(--blossom-lotus)'} />
            {/* Layer 3: Central upright cup */}
            <path d="M50,88 C38,82 40,43 50,43 C60,43 62,82 50,88 Z" fill={color || 'var(--blossom-lotus)'} filter="brightness(1.08)" />
            {/* Center golden carpels */}
            <ellipse cx="50" cy="74" rx="4" ry="2.5" fill="#FED854" />
          </g>
        </>
      )}

      {plantType === 'orchid' && (
        <>
          {/* Curving branch stem */}
          <path d="M50,110 Q44,72 50,50" stroke={stemColor} strokeWidth="3.5" strokeLinecap="round" />
          {/* Symmetrical thick, wide leaves */}
          <path d="M50,110 Q22,107 26,92 Q39,94 50,110 Z" fill={leafColor} opacity="0.9" />
          <path d="M50,110 Q78,107 74,92 Q61,94 50,110 Z" fill={leafColor} opacity="0.9" />

          {/* Exotic Orchid Bloom */}
          <g>
            {/* Three back sepals */}
            <ellipse cx="50" cy="34" rx="7.5" ry="17" fill={color || 'var(--blossom-orchid)'} opacity="0.8" />
            <ellipse cx="37" cy="56" rx="7.5" ry="17" fill={color || 'var(--blossom-orchid)'} transform="rotate(-55 37 56)" opacity="0.8" />
            <ellipse cx="63" cy="56" rx="7.5" ry="17" fill={color || 'var(--blossom-orchid)'} transform="rotate(55 63 56)" opacity="0.8" />

            {/* Two wide spreading wing petals */}
            <ellipse cx="34" cy="44" rx="16" ry="11" fill={color || 'var(--blossom-orchid)'} transform="rotate(-15 34 44)" />
            <ellipse cx="66" cy="44" rx="16" ry="11" fill={color || 'var(--blossom-orchid)'} transform="rotate(15 66 44)" />

            {/* Glowing yellow lip */}
            <path d="M50,48 C41,48 40,65 50,68 C60,65 59,48 50,48 Z" fill="#FED166" stroke="#E69534" strokeWidth="0.5" />
            <circle cx="50" cy="58" r="2.5" fill="#E69534" />

            {/* Column (the small white column in center) */}
            <ellipse cx="50" cy="43" rx="3.5" ry="5.5" fill="#FFF" />
          </g>
        </>
      )}

      {plantType === 'rose' && (
        <>
          {/* Sturdy stem */}
          <path d="M50,110 Q53,74 50,47" stroke={stemColor} strokeWidth="4.5" strokeLinecap="round" />
          {/* Thorny leaves */}
          <g>
            {/* Left leaf branch */}
            <path d="M50,86 L32,80 Q28,74 33,69 Q41,75 50,86 Z" fill={leafColor} />
            <path d="M38,76 L32,77" stroke={stemColor} strokeWidth="1.5" /> {/* Thorn */}
            {/* Right leaf branch */}
            <path d="M50,68 L68,61 Q72,55 67,50 Q59,57 50,68 Z" fill={leafColor} />
            <path d="M60,58 L66,56" stroke={stemColor} strokeWidth="1.5" /> {/* Thorn */}
            {/* Stem tiny thorns */}
            <path d="M50,96 L46,95" stroke={stemColor} strokeWidth="1.5" />
            <path d="M51,78 L55,77" stroke={stemColor} strokeWidth="1.5" />
          </g>

          {/* Lush layered rose bud */}
          <g>
            {/* Green calyx cup */}
            <path d="M42,48 C42,56 58,56 58,48 L50,56 Z" fill={stemColor} />

            {/* Rose Petals Base */}
            <circle cx="50" cy="44" r="17" fill={color || 'var(--blossom-rose)'} />
            
            {/* Overlap petal shadows (draw in darker opacity) */}
            <path d="M50,27 C34,27 31,43 41,56 C47,51 50,40 50,27 Z" fill={color || 'var(--blossom-rose)'} filter="brightness(0.9)" />
            <path d="M50,27 C66,27 69,43 59,56 C53,51 50,40 50,27 Z" fill={color || 'var(--blossom-rose)'} filter="brightness(0.92)" />

            {/* Front Petal shroud */}
            <path d="M34,44 C34,58 66,58 66,44 C66,44 58,50 50,50 C42,50 34,44 34,44 Z" fill={color || 'var(--blossom-rose)'} filter="brightness(1.05)" />

            {/* Heart of the rose swirl */}
            <ellipse cx="50" cy="41" rx="8" ry="9.5" fill={color || 'var(--blossom-rose)'} filter="brightness(0.85)" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5" />
            <path d="M46,39 C49,35 52,35 54,39 C54,43 48,46 47,40 C46,36 52,36 51,39" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" fill="none" />
          </g>
        </>
      )}
    </svg>
  );
}
