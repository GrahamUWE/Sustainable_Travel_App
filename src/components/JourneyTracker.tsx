import { useState } from 'react';
import { Bike, Bus, Footprints, Zap, Save, Sparkles } from 'lucide-react';
import { addJourney, getUserData } from '../utils/storage';
import { ImageWithFallback } from './figma/ImageWithFallback';

type TransportMode = {
  id: string;
  name: string;
  icon: string;
  emissionFactor: number;
  pointsMultiplier: number;
  color: string;
  description: string;
};

const transportModes: TransportMode[] = [
  {
    id: 'walking',
    name: 'Walking',
    icon: '🚶',
    emissionFactor: 0,
    pointsMultiplier: 15,
    color: 'from-green-400 to-green-600',
    description: 'Zero emissions, great for health!'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: '🚴',
    emissionFactor: 0,
    pointsMultiplier: 20,
    color: 'from-green-400 to-green-600',
    description: 'Fast, fun, and eco-friendly'
  },
  {
    id: 'e-scooter',
    name: 'E-Scooter',
    icon: '🛴',
    emissionFactor: 0.05,
    pointsMultiplier: 18,
    color: 'from-blue-400 to-blue-600',
    description: 'Electric and efficient'
  },
  {
    id: 'electric-car',
    name: 'Electric Car',
    icon: '⚡',
    emissionFactor: 0.053,
    pointsMultiplier: 10,
    color: 'from-blue-400 to-blue-600',
    description: 'Zero tailpipe emissions'
  },
  {
    id: 'train',
    name: 'Train',
    icon: '🚆',
    emissionFactor: 0.041,
    pointsMultiplier: 13,
    color: 'from-blue-400 to-blue-600',
    description: 'Efficient long-distance travel'
  },
  {
    id: 'plug-in-hybrid',
    name: 'Plug-in Hybrid',
    icon: '🔌',
    emissionFactor: 0.07,
    pointsMultiplier: 8,
    color: 'from-yellow-400 to-orange-500',
    description: 'Lower emissions than standard cars'
  },
  {
    id: 'bus',
    name: 'Bus',
    icon: '🚌',
    emissionFactor: 0.089,
    pointsMultiplier: 12,
    color: 'from-blue-300 to-blue-600',
    description: 'Shared transport = lower impact'
  },
  {
    id: 'motorbike',
    name: 'Motorbike',
    icon: '🏍️',
    emissionFactor: 0.113,
    pointsMultiplier: 5,
    color: 'from-orange-400 to-orange-600',
    description: 'Moderate emissions'
  },
  {
    id: 'diesel-car',
    name: 'Diesel Car',
    icon: '🚗',
    emissionFactor: 0.171,
    pointsMultiplier: 2,
    color: 'from-red-400 to-red-600',
    description: 'Higher emissions - consider alternatives'
  },
  {
    id: 'petrol-car',
    name: 'Petrol Car',
    icon: '🚙',
    emissionFactor: 0.192,
    pointsMultiplier: 0,
    color: 'from-red-500 to-red-700',
    description: 'Highest emissions - choose greener options'
  }
];

export function JourneyTracker() {
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [distance, setDistance] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastJourney, setLastJourney] = useState<any>(null);

  const calculateRewards = (mode: TransportMode, dist: number) => {
    // Car emissions baseline: 0.192 kg CO₂ per km
    const carEmissions = dist * 0.192;
    const modeEmissions = dist * mode.emissionFactor;
    const emissionsSaved = carEmissions - modeEmissions;
    
    // Points calculation
    const points = Math.round(dist * mode.pointsMultiplier);
    
    return { emissionsSaved, points };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMode || !distance) return;
    
    const dist = parseFloat(distance);
    if (isNaN(dist) || dist <= 0) return;
    
    const { emissionsSaved, points } = calculateRewards(selectedMode, dist);
    
    const journey = {
      mode: selectedMode.name,
      icon: selectedMode.icon,
      distance: dist,
      emissionsSaved,
      points,
      date: new Date().toISOString()
    };
    
    addJourney(journey);
    setLastJourney(journey);
    setShowSuccess(true);
    
    // Dispatch event to refresh other components
    window.dispatchEvent(new Event('journey-logged'));
    
    // Reset form
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedMode(null);
      setDistance('');
    }, 3000);
  };

  if (showSuccess && lastJourney) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="bg-white rounded-xl p-6 shadow-xl w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 animate-bounce">
            <Sparkles className="text-white" size={32} />
          </div>
          <h2 className="text-gray-900 mb-1.5 text-lg">Journey Logged! 🎉</h2>
          <p className="text-gray-600 mb-4 text-sm">Awesome job on choosing sustainable transport!</p>
          
          <div className="space-y-2 mb-4">
            <div className="bg-red-50 rounded-lg p-3">
              <p className="text-red-700 text-xs mb-0.5">Points Earned</p>
              <p className="text-red-600 text-base">+{lastJourney.points} points</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-blue-700 text-xs mb-0.5">CO₂ Saved</p>
              <p className="text-blue-600 text-base">{lastJourney.emissionsSaved.toFixed(2)} kg</p>
            </div>
          </div>
          
          <div className="text-gray-500 text-xs">
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-gray-900 text-base">Track Your Journey</h2>
            <p className="text-gray-600 text-xs">Log your sustainable commute to earn rewards</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transport Mode Selection */}
        <div className="space-y-2">
          <label className="text-gray-900 text-sm" id="transport-mode-label">Choose Transport Mode</label>
          <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-labelledby="transport-mode-label">
            {transportModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={`relative overflow-hidden rounded-lg p-3 text-left transition-all ${
                  selectedMode?.id === mode.id
                    ? 'ring-3 ring-red-500 ring-offset-1'
                    : 'bg-white hover:shadow-md'
                } shadow-sm`}
                role="radio"
                aria-checked={selectedMode?.id === mode.id}
                aria-label={`${mode.name}, ${mode.pointsMultiplier} points per kilometer, ${mode.emissionFactor === 0 ? 'zero emissions' : mode.emissionFactor + ' kilograms CO2 per kilometer'}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${mode.color} opacity-${selectedMode?.id === mode.id ? '10' : '0'} transition-opacity`}></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">{mode.icon}</span>
                  <div className="flex-1">
                    <p className="text-gray-900 text-sm">{mode.name}</p>
                    <p className="text-gray-600 text-xs">{mode.description}</p>
                    <p className="text-red-600 text-xs mt-0.5">
                      {mode.pointsMultiplier} pts/km • {mode.emissionFactor === 0 ? 'Zero' : `${mode.emissionFactor} kg/km`}
                    </p>
                  </div>
                  {selectedMode?.id === mode.id && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center" aria-hidden="true">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Distance Input */}
        <div className="space-y-2">
          <label htmlFor="distance-input" className="text-gray-900 text-sm">Distance (km)</label>
          <div className="relative">
            <input
              id="distance-input"
              type="number"
              step="0.1"
              min="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance in kilometers"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
              aria-describedby="distance-presets"
            />
          </div>
          <div className="flex gap-1.5" id="distance-presets" role="group" aria-label="Quick distance presets">
            {[0.5, 1, 2, 5, 10].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => setDistance(dist.toString())}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 text-xs transition-colors flex-1"
                aria-label={`Set distance to ${dist} kilometers`}
              >
                {dist} km
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Calculation Preview */}
        {selectedMode && distance && parseFloat(distance) > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-blue-50 rounded-lg p-4 space-y-3" role="region" aria-label="Impact preview">
            <h3 className="text-gray-900 flex items-center gap-1.5 text-sm">
              <Sparkles className="text-red-600" size={16} aria-hidden="true" />
              Your Impact Preview
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-600 text-xs mb-0.5">Points You'll Earn</p>
                <p className="text-red-600 text-sm" aria-label={`${Math.round(parseFloat(distance) * selectedMode.pointsMultiplier)} points`}>
                  {Math.round(parseFloat(distance) * selectedMode.pointsMultiplier)} points
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-600 text-xs mb-0.5">CO₂ Saved vs Car</p>
                <p className="text-blue-600 text-sm" aria-label={`${(parseFloat(distance) * 0.192 - parseFloat(distance) * selectedMode.emissionFactor).toFixed(2)} kilograms`}>
                  {(parseFloat(distance) * 0.192 - parseFloat(distance) * selectedMode.emissionFactor).toFixed(2)} kg
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-gray-600 text-xs mb-2">Environmental Comparison</p>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">🚗 Car emissions</span>
                    <span className="text-red-600">{(parseFloat(distance) * 0.192).toFixed(2)} kg</span>
                  </div>
                  <div className="w-full bg-red-100 rounded-full h-1.5" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100} aria-label="Car emissions baseline">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700">{selectedMode.icon} {selectedMode.name}</span>
                    <span className="text-blue-600">{(parseFloat(distance) * selectedMode.emissionFactor).toFixed(2)} kg</span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-1.5" role="progressbar" aria-valuenow={(selectedMode.emissionFactor / 0.192) * 100} aria-valuemin={0} aria-valuemax={100} aria-label={`${selectedMode.name} emissions`}>
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full" 
                      style={{ width: `${(selectedMode.emissionFactor / 0.192) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedMode || !distance || parseFloat(distance) <= 0}
          className="w-full bg-gradient-to-r from-red-500 to-blue-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg text-sm"
          aria-label="Log journey and earn rewards"
        >
          <Save size={18} aria-hidden="true" />
          Log Journey & Earn Rewards
        </button>
      </form>

      {/* Helpful Tips */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-gray-900 mb-2 text-sm">💡 Quick Tips</h3>
        <ul className="space-y-1.5 text-gray-600 text-xs">
          <li className="flex items-start gap-1.5">
            <span className="text-red-500 mt-0.5">•</span>
            <span>Walking and cycling earn the most points and have zero emissions!</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-red-500 mt-0.5">•</span>
            <span>Public transport journeys count too - every sustainable choice matters</span>
          </li>
          <li className="flex items-start gap-1.5">
            <span className="text-red-500 mt-0.5">•</span>
            <span>Log journeys daily to maintain your streak and climb the leaderboard</span>
          </li>
        </ul>
      </div>
    </div>
  );
}