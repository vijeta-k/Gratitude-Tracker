import React, { useState, useEffect } from 'react';
import { 
  getEntries, 
  addEntry, 
  calculateStreakStats, 
  getLocalDateString, 
  saveEntries, 
  clearAllData 
} from './utils/storage';
import StreakBadge from './components/StreakBadge';
import GardenCanvas from './components/GardenCanvas';
import DailyEntryForm from './components/DailyEntryForm';
import ArchiveModal from './components/ArchiveModal';

export default function App() {
  const [entries, setEntries] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [selectedPlantEntry, setSelectedPlantEntry] = useState(null);
  const [hasPlantedToday, setHasPlantedToday] = useState(false);
  const [stats, setStats] = useState({ currentStreak: 0, longestStreak: 0 });
  const [loading, setLoading] = useState(true);

  // Load entries and refresh state from Firestore
  const refreshGardenState = async (showLoadingSpinner = false) => {
    if (showLoadingSpinner) setLoading(true);
    try {
      const loadedEntries = await getEntries();
      setEntries(loadedEntries);

      const computedStats = calculateStreakStats(loadedEntries);
      setStats(computedStats);

      // Check if user has already planted today
      const todayStr = getLocalDateString();
      const plantedToday = loadedEntries.some(entry => entry.date === todayStr);
      setHasPlantedToday(plantedToday);

      // Auto-select first empty plot if user hasn't planted today
      if (!plantedToday) {
        const occupiedPlots = loadedEntries.map(e => e.position);
        const firstEmptyPlot = Array.from({ length: 12 })
          .map((_, i) => i)
          .find(i => !occupiedPlots.includes(i));
        
        setSelectedPlot(firstEmptyPlot !== undefined ? firstEmptyPlot : null);
      } else {
        setSelectedPlot(null);
      }
    } catch (error) {
      console.error("Error refreshing garden state:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshGardenState(true);
  }, []);

  // Handle sowing a seed in Firestore
  const handleSowSeed = async (text, plantType, color, position) => {
    setLoading(true);
    try {
      await addEntry(text, plantType, color, position);
      await refreshGardenState();
    } catch (err) {
      alert(err.message);
      setLoading(false);
    }
  };

  // --- Developer Controls / Time Travel ---

  // Shift all dates back by 1 day in Firestore
  const handleShiftDatesBack = async () => {
    setLoading(true);
    try {
      const updated = entries.map(entry => {
        const d = new Date(entry.date + 'T00:00:00');
        d.setDate(d.getDate() - 1);
        
        const offset = d.getTimezoneOffset();
        const adjustedDate = new Date(d.getTime() - offset * 60 * 1000);
        const newDateStr = adjustedDate.toISOString().split('T')[0];

        return {
          ...entry,
          date: newDateStr,
          timestamp: entry.timestamp - (24 * 60 * 60 * 1000)
        };
      });

      await saveEntries(updated);
      await refreshGardenState();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Generate a mock history of journaling across consecutive days in Firestore
  const handleGenerateMockHistory = async () => {
    setLoading(true);
    try {
      const mockEntries = [];
      const today = new Date();

      const plantTypes = ['daisy', 'tulip', 'lavender', 'fern', 'sunflower', 'lotus'];
      const colors = ['#FFF5A3', '#FFAEA7', '#D2C4FB', '#7FB093', '#FFD275', '#FFC4E1'];
      const thoughts = [
        "Grateful for a warm cup of coffee and quiet reading time this morning.",
        "Thankful for a long phone call with my childhood best friend.",
        "Grateful for completing a difficult task at work and feeling accomplished.",
        "Grateful for a refreshing evening walk and seeing the sunset.",
        "Appreciated a delicious dinner cook-off with my family.",
        "Thankful for a cozy bed, soft music, and a restful night of sleep."
      ];

      // Seed entries going back from 5 days ago to today
      for (let i = 5; i >= 0; i--) {
        const entryDate = new Date();
        entryDate.setDate(today.getDate() - i);
        
        const offset = entryDate.getTimezoneOffset();
        const adjustedDate = new Date(entryDate.getTime() - offset * 60 * 1000);
        const dateStr = adjustedDate.toISOString().split('T')[0];

        mockEntries.push({
          text: thoughts[5 - i],
          date: dateStr,
          timestamp: entryDate.getTime(),
          plantType: plantTypes[5 - i],
          color: colors[5 - i],
          position: 5 - i
        });
      }

      await saveEntries(mockEntries);
      await refreshGardenState();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Reset all Firestore data
  const handleResetGarden = async () => {
    if (window.confirm("Are you sure you want to clear your garden? All Cloud Firestore entries will be deleted.")) {
      setLoading(true);
      try {
        await clearAllData();
        await refreshGardenState();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Loading Overlay */}
      {loading && (
        <div className="modal-overlay" style={{ zIndex: 110 }}>
          <div className="glass-card flex flex-col items-center justify-center p-8 gap-4 text-center max-w-[280px]">
            <svg className="animate-spin h-10 w-10 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--color-primary)' }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-main)' }}>Tending the garden...</h3>
            <p className="text-xs text-gray-500">Connecting to Cloud Firestore</p>
          </div>
        </div>
      )}

      {/* Title Header */}
      <header className="app-header">
        <h1 className="app-title">Gratitude Garden</h1>
        <p className="app-subtitle">Nurture your mind, watch it bloom</p>
      </header>

      {/* Main Grid: Entry Form (Left) & Stats + Garden (Right) */}
      <main className="dashboard-grid">
        <section className="flex flex-col gap-6">
          {/* Daily Gratitude Journaling Card */}
          <DailyEntryForm 
            onSubmit={handleSowSeed}
            hasPlantedToday={hasPlantedToday}
            selectedPlot={selectedPlot}
            currentStreak={stats.currentStreak}
          />

          {/* Meditative Developer Controls Panel */}
          <div className="glass-card dev-panel">
            <h4 className="dev-panel-title">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Growth & Streak Simulator
            </h4>
            <p className="text-[0.7rem] text-gray-500 leading-relaxed">
              Use these tools to preview growth stages instantly or check out a fully matured mock garden.
            </p>
            <div className="dev-actions">
              <button 
                onClick={handleShiftDatesBack} 
                className="dev-btn"
                title="Ages all plants by 1 day, causing seeds to sprout and grow!"
              >
                ⏳ Shift Dates Back 1 Day
              </button>
              <button 
                onClick={handleGenerateMockHistory} 
                className="dev-btn"
                title="Seeds a 6-day streak with blooming flowers"
              >
                🌱 Generate Matured Garden
              </button>
              <button 
                onClick={handleResetGarden} 
                className="dev-btn danger"
                title="Clears all Cloud Firestore entries"
              >
                🗑️ Clear Garden Data
              </button>
            </div>
          </div>
        </section>

        {/* Right side: Stats and Garden layout */}
        <section className="flex flex-col">
          {/* Stats Bar */}
          <StreakBadge 
            currentStreak={stats.currentStreak}
            longestStreak={stats.longestStreak}
            totalPlants={entries.length}
          />

          {/* Interactive Garden soilbed */}
          <GardenCanvas 
            entries={entries}
            selectedPlot={selectedPlot}
            onPlotSelect={setSelectedPlot}
            onPlantClick={setSelectedPlantEntry}
            hasPlantedToday={hasPlantedToday}
          />
        </section>
      </main>

      {/* Archive Modal Popup */}
      {selectedPlantEntry && (
        <ArchiveModal 
          selectedPlantEntry={selectedPlantEntry}
          entries={entries}
          onClose={() => setSelectedPlantEntry(null)}
          onSelectEntry={setSelectedPlantEntry}
        />
      )}

      {/* Footer credits */}
      <footer className="app-footer">
        <p>Gratitude Garden — A peaceful space to cultivate daily mindfulness.</p>
      </footer>
    </div>
  );
}
