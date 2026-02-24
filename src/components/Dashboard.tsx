import { useEffect, useState } from 'react';
import { Leaf, Flame, TrendingUp, Calendar, Zap } from 'lucide-react';
import { getUserData, Journey } from '../utils/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const [userData, setUserData] = useState(getUserData());
  const [weeklyData, setWeeklyData] = useState<any[]>([]);

  useEffect(() => {
    const refreshData = () => {
      setUserData(getUserData());
    };
    
    window.addEventListener('journey-logged', refreshData);
    return () => window.removeEventListener('journey-logged', refreshData);
  }, []);

  useEffect(() => {
    // Calculate weekly journey data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => {
      const dayJourneys = userData.journeys.filter((j: Journey) => {
        const journeyDate = new Date(j.date);
        const dayOfWeek = journeyDate.toLocaleDateString('en-US', { weekday: 'short' });
        return dayOfWeek === day;
      });
      
      return {
        name: day,
        points: dayJourneys.reduce((sum: number, j: Journey) => sum + j.points, 0),
      };
    });
    
    setWeeklyData(data);
  }, [userData]);

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-500 to-blue-600 rounded-xl p-4 text-white">
        <h2 className="text-white mb-1 text-lg">Welcome back, {userData.name}! 🎉</h2>
        <p className="opacity-90 mb-3 text-sm">Keep up your sustainable journey streak</p>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex-1">
            <div className="flex items-center gap-1.5">
              <Flame className="text-orange-300" size={16} />
              <span className="text-white text-sm">{userData.streak} day</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 flex-1">
            <div className="flex items-center gap-1.5">
              <Zap className="text-yellow-300" size={16} />
              <span className="text-white text-sm">{userData.points} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Leaf className="text-red-600" size={16} />
            </div>
            <div>
              <p className="text-gray-600 text-xs">CO₂ Saved</p>
              <p className="text-gray-900 text-sm">{userData.totalEmissionsSaved.toFixed(1)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="text-blue-600" size={16} />
            </div>
            <div>
              <p className="text-gray-600 text-xs">Journeys</p>
              <p className="text-gray-900 text-sm">{userData.journeys.length} trips</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-red-600" size={16} />
            </div>
            <div>
              <p className="text-gray-600 text-xs">This Week</p>
              <p className="text-gray-900 text-sm">{userData.journeys.filter((j: Journey) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(j.date) > weekAgo;
              }).length} trips</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">🏆</span>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Rank</p>
              <p className="text-gray-900 text-sm">#{userData.rank}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-gray-900 mb-3 text-sm">Weekly Points</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <YAxis stroke="#9ca3af" style={{ fontSize: '11px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="points" fill="#dc2626" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Journeys */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-gray-900 mb-3 text-sm">Recent Journeys</h3>
        {userData.journeys.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-1 text-sm">No journeys yet</p>
            <p className="text-gray-400 text-xs">Start tracking your sustainable travels!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {userData.journeys.slice(-5).reverse().map((journey: Journey) => (
              <div key={journey.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{journey.icon}</span>
                  <div>
                    <p className="text-gray-900 text-sm">{journey.mode}</p>
                    <p className="text-gray-500 text-xs">{journey.distance} km • {new Date(journey.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-red-600 text-sm">+{journey.points} pts</p>
                  <p className="text-gray-500 text-xs">-{journey.emissionsSaved.toFixed(1)} kg</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Impact Message */}
      <div className="bg-gradient-to-br from-red-100 to-blue-100 rounded-lg p-4">
        <h3 className="text-gray-900 mb-1.5 text-sm">🌍 Your Impact</h3>
        <p className="text-gray-700 text-xs leading-relaxed">
          You've saved {userData.totalEmissionsSaved.toFixed(1)} kg of CO₂! 
          That's equivalent to planting {Math.floor(userData.totalEmissionsSaved / 20)} trees. 
          Keep up the amazing work! 🌳
        </p>
      </div>
    </div>
  );
}