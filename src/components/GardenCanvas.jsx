import React from 'react';
import PlantSVG from './PlantSVG';
import { getLocalDateString } from '../utils/storage';

/**
 * GardenCanvas component renders the grid of soil plots,
 * handles plant age calculation, and manages plot clicks.
 * 
 * @param {Array} entries - List of gratitude entries
 * @param {number} selectedPlot - Currently chosen empty plot index
 * @param {function} onPlotSelect - Callback when selecting a plot to plant
 * @param {function} onPlantClick - Callback when clicking a mature plant (Archive)
 * @param {boolean} hasPlantedToday - Is the user blocked from planting today?
 */
export default function GardenCanvas({ 
  entries = [], 
  selectedPlot = null, 
  onPlotSelect, 
  onPlantClick,
  hasPlantedToday = false
}) {
  const totalPlots = 12;

  // Create a map of index -> plant entry
  const plantMap = {};
  entries.forEach(entry => {
    if (entry.position !== undefined && entry.position !== null) {
      plantMap[entry.position] = entry;
    }
  });

  // Calculate growth stage based on current date vs entry date
  const getGrowthStage = (entryDateStr) => {
    try {
      const todayStr = getLocalDateString();
      const today = new Date(todayStr);
      const entryDate = new Date(entryDateStr);
      
      const diffTime = today - entryDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) return 0; // Created today = Seed
      if (diffDays === 1) return 1; // 1 day old = Sprout
      if (diffDays === 2) return 2; // 2 days old = Sapling
      return 3;                     // 3+ days old = Full Bloom
    } catch (e) {
      return 3; // Fallback to full bloom
    }
  };

  const handlePlotClick = (index) => {
    const occupant = plantMap[index];
    if (occupant) {
      // Occupied plot -> open history modal
      onPlantClick(occupant);
    } else if (!hasPlantedToday) {
      // Empty plot & can plant -> select for planting
      onPlotSelect(index);
    }
  };

  return (
    <div className="glass-card garden-canvas-card flex-grow">
      <div className="garden-header">
        <h2 className="garden-title">Your Garden</h2>
        <div className="garden-legend flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" style={{ backgroundColor: '#D6A232' }}></span> Seed (Day 0)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" style={{ backgroundColor: '#84B094' }}></span> Sprout (Day 1-2)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" style={{ backgroundColor: '#FFAEA7' }}></span> Bloom (Day 3+)
          </span>
        </div>
      </div>

      <div className="soil-bed">
        {/* Decorative Grass Edge */}
        <div className="grass-overlay-top"></div>

        {Array.from({ length: totalPlots }).map((_, index) => {
          const plant = plantMap[index];
          const isSelected = selectedPlot === index;
          const isEmpty = !plant;
          const stage = plant ? getGrowthStage(plant.date) : 0;

          // Compute style classes
          let plotClass = "soil-plot";
          if (isEmpty) {
            plotClass += " empty";
            if (!hasPlantedToday) {
              plotClass += " selectable";
            }
            if (isSelected) {
              plotClass += " selected";
            }
          }

          return (
            <div 
              key={index} 
              className={plotClass}
              onClick={() => handlePlotClick(index)}
              style={isSelected ? { borderColor: 'var(--color-accent)', boxShadow: '0 0 0 6px rgba(232, 158, 136, 0.25)' } : {}}
            >
              {/* Plot Index for screenreaders / developer tracking */}
              <span className="plot-index-number">Plot {index + 1}</span>

              {/* Renders Plant if there is one */}
              {plant && (
                <div className="plant-wrapper">
                  <PlantSVG 
                    plantType={plant.plantType} 
                    growthStage={stage} 
                    color={plant.color}
                    isAnimated={stage > 0} // seeds don't sway
                  />
                </div>
              )}

              {/* Renders a little indicator if it's the selected planting plot */}
              {isSelected && isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 animate-bounce" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,2 L12,14 M7,9 L12,14 L17,9" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
