import { useState, useEffect } from 'react';
import { Award, Lock, CheckCircle } from 'lucide-react';
import { getUserData, getBadges, type Badge } from '../utils/storage';

export function Badges() {
  const userData = getUserData();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    setBadges(getBadges());
  }, []);

  useEffect(() => {
    const refreshData = () => {
      setBadges(getBadges());
    };
    
    window.addEventListener('journey-logged', refreshData);
    return () => window.removeEventListener('journey-logged', refreshData);
  }, []);

  const earnedBadges = badges.filter(b => b.earned);
  const lockedBadges = badges.filter(b => !b.earned);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Award size={28} />
          <div>
            <h2 className="text-white text-lg">Your Badges</h2>
            <p className="opacity-90 text-xs">Collect achievements for your eco-journey</p>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 flex justify-between items-center">
          <div>
            <p className="text-white/80 text-xs">Badges Earned</p>
            <p className="text-white text-sm">{earnedBadges.length} / {badges.length}</p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-lg">{Math.round((earnedBadges.length / badges.length) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900 text-sm">Earned Badges 🎉</h3>
          <span className="text-red-600 text-sm">{earnedBadges.length}</span>
        </div>
        
        {earnedBadges.length === 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <p className="text-gray-500 mb-1 text-sm">No badges earned yet</p>
            <p className="text-gray-400 text-xs">Start logging journeys to unlock achievements!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="w-12 h-12 mx-auto mb-2 text-3xl flex items-center justify-center bg-gradient-to-br from-red-100 to-blue-100 rounded-full">
                  {badge.icon}
                </div>
                <p className="text-gray-900 text-center text-xs mb-1 truncate">{badge.name}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-red-600">
                  <CheckCircle size={10} />
                  <span className="text-xs">Earned</span>
                </div>
                {badge.earnedDate && (
                  <p className="text-gray-400 text-xs text-center mt-0.5">
                    {new Date(badge.earnedDate).toLocaleDateString()}
                  </p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Locked Badges */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-900 text-sm">Locked Badges 🔒</h3>
          <span className="text-gray-400 text-sm">{lockedBadges.length}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {lockedBadges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow text-left relative overflow-hidden"
            >
              <div className="absolute top-2 right-2">
                <Lock className="text-gray-400" size={14} />
              </div>
              <div className="w-12 h-12 mx-auto mb-2 text-3xl flex items-center justify-center bg-gray-100 rounded-full opacity-40 grayscale">
                {badge.icon}
              </div>
              <p className="text-gray-500 text-center text-xs mb-1 truncate">{badge.name}</p>
              <p className="text-gray-400 text-xs text-center">
                {badge.progress} / {badge.requirement}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1.5">
                <div 
                  className="bg-gradient-to-r from-red-400 to-blue-500 h-1 rounded-full transition-all"
                  style={{ width: `${Math.min((badge.progress / badge.requirement) * 100, 100)}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedBadge(null)}
        >
          <div 
            className="bg-white rounded-xl p-5 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-3 text-5xl flex items-center justify-center bg-gradient-to-br ${
                selectedBadge.earned ? 'from-red-100 to-blue-100' : 'from-gray-100 to-gray-200'
              } rounded-full ${selectedBadge.earned ? '' : 'opacity-40 grayscale'}`}>
                {selectedBadge.icon}
              </div>
              
              <h3 className="text-gray-900 mb-1.5 text-base">{selectedBadge.name}</h3>
              <p className="text-gray-600 text-xs mb-3">{selectedBadge.description}</p>
              
              {selectedBadge.earned ? (
                <div className="bg-red-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-center gap-1.5 text-red-600 mb-1">
                    <CheckCircle size={16} />
                    <span className="text-sm">Earned!</span>
                  </div>
                  {selectedBadge.earnedDate && (
                    <p className="text-red-700 text-xs">
                      {new Date(selectedBadge.earnedDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  )}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-gray-700 text-xs mb-1.5">Progress</p>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-gray-600 text-xs">{selectedBadge.progress} / {selectedBadge.requirement}</span>
                    <span className="text-gray-600 text-xs">
                      {Math.round((selectedBadge.progress / selectedBadge.requirement) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-blue-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.min((selectedBadge.progress / selectedBadge.requirement) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-500 text-xs mt-2">
                    {selectedBadge.requirement - selectedBadge.progress} more to go!
                  </p>
                </div>
              )}
              
              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Motivation Card */}
      <div className="bg-gradient-to-br from-red-100 to-blue-100 rounded-lg p-4">
        <h3 className="text-gray-900 mb-1.5 text-sm">🌟 Keep Going!</h3>
        <p className="text-gray-700 text-xs leading-relaxed">
          {earnedBadges.length === 0 
            ? "Your first badge is just one journey away! Start tracking to unlock achievements."
            : earnedBadges.length < badges.length / 2
            ? `You're doing great! ${badges.length - earnedBadges.length} more badges to collect.`
            : earnedBadges.length < badges.length
            ? `Almost there! Only ${badges.length - earnedBadges.length} badges left to collect them all!`
            : "Wow! You've collected all badges! You're a sustainability champion! 🏆"
          }
        </p>
      </div>
    </div>
  );
}