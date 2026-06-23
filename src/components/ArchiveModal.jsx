import React, { useState, useEffect } from 'react';
import PlantSVG from './PlantSVG';
import { getLocalDateString } from '../utils/storage';

/**
 * ArchiveModal component provides an overlay to inspect a plant's
 * entry details and list all historical entries.
 * 
 * @param {object} selectedPlantEntry - The plant object selected to view
 * @param {Array} entries - All journal entries to display in list view
 * @param {function} onClose - Close modal callback
 * @param {function} onSelectEntry - Select a different entry to inspect
 */
export default function ArchiveModal({ 
  selectedPlantEntry, 
  entries = [], 
  onClose,
  onSelectEntry
}) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'history'

  // If selected entry changes, make sure we switch to details tab
  useEffect(() => {
    if (selectedPlantEntry) {
      setActiveTab('details');
    }
  }, [selectedPlantEntry]);

  if (!selectedPlantEntry) return null;

  // Format Date for display
  const formatDate = (dateStr) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const date = new Date(dateStr + 'T00:00:00'); // Prevent timezone offset shift
      return date.toLocaleDateString(undefined, options);
    } catch (e) {
      return dateStr;
    }
  };

  // Determine stage of plant inside detail viewer (fully bloomed or sprout based on time travel)
  const getGrowthStage = (entryDateStr) => {
    try {
      const todayStr = getLocalDateString();
      const today = new Date(todayStr);
      const entryDate = new Date(entryDateStr);
      
      const diffTime = today - entryDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 0) return 0;
      if (diffDays === 1) return 1;
      if (diffDays === 2) return 2;
      return 3;
    } catch (e) {
      return 3;
    }
  };

  const stage = getGrowthStage(selectedPlantEntry.date);

  // Close when clicking overlay backdrop
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="glass-card modal-content">
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Navigation Tabs */}
        <div className="modal-tabs">
          <button 
            className={`modal-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Plant Details
          </button>
          <button 
            className={`modal-tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Garden History ({entries.length})
          </button>
        </div>

        {/* Tab Content: Details */}
        {activeTab === 'details' && (
          <div className="plant-detail-view">
            {/* SVG Visual */}
            <div className="detail-plant-display">
              <div className="w-[120px] h-[140px] flex items-end">
                <PlantSVG 
                  plantType={selectedPlantEntry.plantType} 
                  growthStage={stage} 
                  color={selectedPlantEntry.color}
                  isAnimated={true}
                />
              </div>
              {/* Pot overlay */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-5 bg-[#C5B391] border border-[#B09E7B] rounded-b-lg"></div>
            </div>

            {/* Date */}
            <div className="detail-date">
              {formatDate(selectedPlantEntry.date)}
            </div>

            {/* Gratitude text */}
            <div className="detail-quote-box">
              {selectedPlantEntry.text}
            </div>

            {/* Metadata Footer */}
            <div className="detail-meta">
              <div className="detail-meta-item">
                Variety: <strong className="capitalize">{selectedPlantEntry.plantType}</strong>
              </div>
              <div className="detail-meta-item">
                Location: <strong>Plot #{selectedPlantEntry.position + 1}</strong>
              </div>
              <div className="detail-meta-item">
                Stage: <strong>
                  {stage === 0 ? 'Seed' : stage === 1 ? 'Sprout' : stage === 2 ? 'Sapling' : 'Fully Bloomed'}
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: History List */}
        {activeTab === 'history' && (
          <div className="history-list">
            {entries.length === 0 ? (
              <div className="text-center py-8 text-gray-500 italic">
                No plants in the garden yet. Plant your first seed today!
              </div>
            ) : (
              entries.map((entry) => {
                const itemStage = getGrowthStage(entry.date);
                const isSelected = selectedPlantEntry.id === entry.id;

                return (
                  <div 
                    key={entry.id} 
                    className={`history-item ${isSelected ? 'border-emerald-500 bg-emerald-50/20' : ''}`}
                    onClick={() => {
                      onSelectEntry(entry);
                      setActiveTab('details');
                    }}
                  >
                    {/* Small preview of the plant */}
                    <div className="history-item-plant">
                      <div className="w-[36px] h-[40px] flex items-end">
                        <PlantSVG 
                          plantType={entry.plantType} 
                          growthStage={itemStage} 
                          color={entry.color}
                          isAnimated={false}
                        />
                      </div>
                    </div>

                    {/* Entry description */}
                    <div className="history-item-body">
                      <div className="history-item-header">
                        <span className="history-item-date">{formatDate(entry.date)}</span>
                        <span className="text-[0.65rem] capitalize px-2 py-0.5 rounded bg-gray-100 font-semibold text-gray-500">
                          {entry.plantType}
                        </span>
                      </div>
                      <p className="history-item-text">{entry.text}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
