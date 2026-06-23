import React, { useState, useEffect } from 'react';
import { getLocalDateString } from '../utils/storage';

// Inspirited Prompts for Gratitude journaling
const PROMPTS = [
  "What made you smile today?",
  "Who was kind to you recently?",
  "What is a small detail in your environment you appreciate?",
  "What is a taste, sound, or smell that brought you comfort?",
  "What is a personal strength you felt proud of today?",
  "What is a lesson you learned from a challenge today?",
  "What simple pleasure did you enjoy today?",
  "What song, book, or piece of art warmed your heart today?"
];

// Plant categories and unlocking thresholds
const PLANT_TYPES = [
  { id: 'daisy', name: 'Daisy', minStreak: 0, icon: '🌼' },
  { id: 'tulip', name: 'Tulip', minStreak: 0, icon: '🌷' },
  { id: 'lavender', name: 'Lavender', minStreak: 0, icon: '🪻' },
  { id: 'fern', name: 'Fern', minStreak: 0, icon: '🌿' },
  { id: 'sunflower', name: 'Sunflower', minStreak: 3, icon: '🌻' },
  { id: 'lotus', name: 'Lotus', minStreak: 5, icon: '🪷' },
  { id: 'orchid', name: 'Orchid', minStreak: 8, icon: '🌸' },
  { id: 'rose', name: 'Rose', minStreak: 12, icon: '🌹' }
];

// Color palette
const COLORS = [
  { hex: '#FFAEA7', name: 'Coral' },
  { hex: '#D2C4FB', name: 'Lavender' },
  { hex: '#FFF5A3', name: 'Daisy Yellow' },
  { hex: '#FFD275', name: 'Amber' },
  { hex: '#FFC4E1', name: 'Rose Pink' },
  { hex: '#E5A3FF', name: 'Orchid Violet' }
];

export default function DailyEntryForm({ 
  onSubmit, 
  hasPlantedToday = false, 
  selectedPlot = null, 
  currentStreak = 0 
}) {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [selectedPlant, setSelectedPlant] = useState('daisy');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [countdown, setCountdown] = useState('');

  // Set initial prompt
  useEffect(() => {
    rotatePrompt();
  }, []);

  // Update countdown clock to midnight
  useEffect(() => {
    if (!hasPlantedToday) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Next midnight

      const diffMs = tomorrow - now;
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      const format = (num) => String(num).padStart(2, '0');
      setCountdown(`${format(hours)}:${format(minutes)}:${format(seconds)}`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [hasPlantedToday]);

  const rotatePrompt = () => {
    const randomIndex = Math.floor(Math.random() * PROMPTS.length);
    setPrompt(PROMPTS[randomIndex]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || selectedPlot === null || hasPlantedToday) return;
    
    onSubmit(text.trim(), selectedPlant, selectedColor, selectedPlot);
    setText('');
  };

  // If user already wrote their daily gratitude
  if (hasPlantedToday) {
    return (
      <div className="glass-card entry-form-container">
        <div className="locked-container">
          <div className="locked-icon-wrapper">
            <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <h3 className="locked-title">Seed Planted!</h3>
          <p className="locked-desc">
            Your gratitude seed has been sown for today. Check back tomorrow to see it grow and to plant another gratitude!
          </p>

          <div className="countdown-timer">
            <span className="countdown-label">Next Seed Available In</span>
            <span className="countdown-val">{countdown}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card entry-form-container">
      <div>
        <h3 className="entry-form-title">Daily Gratitude</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="entry-prompt">{prompt}</span>
          <button 
            type="button" 
            onClick={rotatePrompt}
            className="text-gray-400 hover:text-emerald-700 hover:rotate-180 transition-all duration-300 p-1"
            title="Next Prompt"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l.57.57" />
            </svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        {/* Gratitude Input */}
        <div className="textarea-wrapper">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 250))}
            placeholder="Write down one thing you are grateful for today..."
            className="gratitude-textarea"
            required
          />
          <span className="char-counter">{text.length}/250</span>
        </div>

        {/* Plant Selector */}
        <div>
          <h4 className="plant-selector-label">Choose Seed Variety</h4>
          <div className="plant-type-grid">
            {PLANT_TYPES.map((plant) => {
              const isLocked = currentStreak < plant.minStreak;
              const isSelected = selectedPlant === plant.id;

              return (
                <button
                  type="button"
                  key={plant.id}
                  disabled={isLocked}
                  onClick={() => setSelectedPlant(plant.id)}
                  className={`plant-select-btn ${isSelected ? 'selected' : ''} ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                  title={isLocked ? `Unlocked at streak level ${plant.minStreak}` : plant.name}
                >
                  <span className="text-xl mb-0.5">{plant.icon}</span>
                  <span className="plant-select-name">{plant.name}</span>
                  {isLocked && (
                    <span className="text-[0.55rem] font-bold text-amber-600 block mt-0.5">
                      Str {plant.minStreak}+
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Selector */}
        <div>
          <h4 className="plant-selector-label">Choose Flower Color</h4>
          <div className="color-selector">
            {COLORS.map((color) => {
              const isSelected = selectedColor === color.hex;
              return (
                <button
                  type="button"
                  key={color.hex}
                  onClick={() => setSelectedColor(color.hex)}
                  className={`color-option ${isSelected ? 'selected' : ''}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              );
            })}
          </div>
        </div>

        {/* Instructions / Validation Alert */}
        {selectedPlot === null ? (
          <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-xl text-amber-800 text-xs flex gap-2 items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
            </svg>
            <span>Please select an empty plot in your garden to sow this seed.</span>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-xl text-emerald-800 text-xs flex gap-2 items-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
            <span>Seed will be sown in Plot #{selectedPlot + 1}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!text.trim() || selectedPlot === null || hasPlantedToday}
          className="submit-btn"
        >
          <span>Sow Gratitude Seed</span>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </button>
      </form>
    </div>
  );
}
