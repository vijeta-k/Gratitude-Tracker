import React from 'react';

/**
 * StreakBadge component displays key garden statistics:
 * current streak, historical longest streak, and total garden size.
 */
export default function StreakBadge({ currentStreak = 0, longestStreak = 0, totalPlants = 0 }) {
  return (
    <div className="glass-card stats-container">
      {/* Current Streak */}
      <div className="stat-box">
        <div className="stat-val streak animate-pulse">
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-accent)' }}>
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
          </svg>
          {currentStreak}
        </div>
        <span className="stat-lbl">Current Streak</span>
      </div>

      {/* Divide line */}
      <div className="w-[1px] bg-emerald-800/10 self-stretch my-1"></div>

      {/* Longest Streak */}
      <div className="stat-box">
        <div className="stat-val" style={{ color: 'var(--color-gold)' }}>
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
            <path d="M12 2a4 4 0 0 0-4 4v8a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z" />
          </svg>
          {longestStreak}
        </div>
        <span className="stat-lbl">Longest Streak</span>
      </div>

      {/* Divide line */}
      <div className="w-[1px] bg-emerald-800/10 self-stretch my-1"></div>

      {/* Total Garden size */}
      <div className="stat-box">
        <div className="stat-val" style={{ color: 'var(--color-primary)' }}>
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-7.5c-.5 3.5-2 5.9-4 7.5S5 13 5 15a7 7 0 0 0 7 7z" />
          </svg>
          {totalPlants}
        </div>
        <span className="stat-lbl">Garden Size</span>
      </div>
    </div>
  );
}
