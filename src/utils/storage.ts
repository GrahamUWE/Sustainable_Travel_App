export type Journey = {
  id: string;
  mode: string;
  icon: string;
  distance: number;
  emissionsSaved: number;
  points: number;
  date: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  earned: boolean;
  earnedDate?: string;
};

export type UserData = {
  name: string;
  points: number;
  rank: number;
  streak: number;
  journeys: Journey[];
  totalEmissionsSaved: number;
  lastJourneyDate?: string;
};

// Initialize default user data
const defaultUserData: UserData = {
  name: 'You',
  points: 0,
  rank: 15,
  streak: 0,
  journeys: [],
  totalEmissionsSaved: 0,
};

// Badge definitions
const badgeDefinitions = [
  {
    id: 'first-journey',
    name: 'First Steps',
    description: 'Complete your first sustainable journey',
    icon: '🎯',
    requirement: 1,
    type: 'journeys'
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Complete 10 sustainable journeys',
    icon: '🌱',
    requirement: 10,
    type: 'journeys'
  },
  {
    id: 'century',
    name: 'Century Club',
    description: 'Complete 100 journeys',
    icon: '💯',
    requirement: 100,
    type: 'journeys'
  },
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Earn 500 points',
    icon: '⭐',
    requirement: 500,
    type: 'points'
  },
  {
    id: 'point-master',
    name: 'Point Master',
    description: 'Earn 2000 points',
    icon: '🌟',
    requirement: 2000,
    type: 'points'
  },
  {
    id: 'co2-saver',
    name: 'CO₂ Saver',
    description: 'Save 50kg of CO₂ emissions',
    icon: '🌍',
    requirement: 50,
    type: 'emissions'
  },
  {
    id: 'climate-hero',
    name: 'Climate Hero',
    description: 'Save 200kg of CO₂ emissions',
    icon: '🦸',
    requirement: 200,
    type: 'emissions'
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: 7,
    type: 'streak'
  },
  {
    id: 'month-streak',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    icon: '🏆',
    requirement: 30,
    type: 'streak'
  },
  {
    id: 'cyclist',
    name: 'Cyclist',
    description: 'Complete 20 cycling journeys',
    icon: '🚴',
    requirement: 20,
    type: 'mode-cycling'
  },
  {
    id: 'walker',
    name: 'Walker',
    description: 'Complete 30 walking journeys',
    icon: '🚶',
    requirement: 30,
    type: 'mode-walking'
  },
  {
    id: 'public-transport',
    name: 'Public Transit Pro',
    description: 'Use public transport 25 times',
    icon: '🚌',
    requirement: 25,
    type: 'mode-bus'
  },
];

export function getUserData(): UserData {
  if (typeof window === 'undefined') return defaultUserData;
  
  const stored = localStorage.getItem('uwe-ecocommute-user');
  if (!stored) {
    localStorage.setItem('uwe-ecocommute-user', JSON.stringify(defaultUserData));
    return defaultUserData;
  }
  
  return JSON.parse(stored);
}

export function addJourney(journey: Omit<Journey, 'id'>) {
  const userData = getUserData();
  
  const newJourney: Journey = {
    ...journey,
    id: Date.now().toString(),
  };
  
  userData.journeys.push(newJourney);
  userData.points += journey.points;
  userData.totalEmissionsSaved += journey.emissionsSaved;
  
  // Update streak
  const today = new Date().toDateString();
  const lastJourney = userData.lastJourneyDate ? new Date(userData.lastJourneyDate).toDateString() : null;
  
  if (lastJourney === today) {
    // Same day, don't change streak
  } else if (lastJourney) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastJourney === yesterday.toDateString()) {
      userData.streak += 1;
    } else {
      userData.streak = 1;
    }
  } else {
    userData.streak = 1;
  }
  
  userData.lastJourneyDate = new Date().toISOString();
  
  localStorage.setItem('uwe-ecocommute-user', JSON.stringify(userData));
}

export function getBadges(): Badge[] {
  const userData = getUserData();
  
  return badgeDefinitions.map(def => {
    let progress = 0;
    let earned = false;
    let earnedDate: string | undefined;
    
    switch (def.type) {
      case 'journeys':
        progress = userData.journeys.length;
        break;
      case 'points':
        progress = userData.points;
        break;
      case 'emissions':
        progress = Math.floor(userData.totalEmissionsSaved);
        break;
      case 'streak':
        progress = userData.streak;
        break;
      case 'mode-cycling':
        progress = userData.journeys.filter(j => j.mode === 'Cycling').length;
        break;
      case 'mode-walking':
        progress = userData.journeys.filter(j => j.mode === 'Walking').length;
        break;
      case 'mode-bus':
        progress = userData.journeys.filter(j => j.mode === 'Bus').length;
        break;
    }
    
    if (progress >= def.requirement) {
      earned = true;
      // Find when this badge was earned (when progress first exceeded requirement)
      const relevantJourneys = userData.journeys.slice(0, def.requirement);
      if (relevantJourneys.length > 0) {
        earnedDate = relevantJourneys[relevantJourneys.length - 1].date;
      }
    }
    
    return {
      ...def,
      progress,
      earned,
      earnedDate,
    };
  });
}

export function getLeaderboardData(filter: 'all' | 'week' | 'month' = 'all') {
  const userData = getUserData();
  
  // Generate mock leaderboard data with current user
  const mockUsers = [
    { name: 'Emma Thompson', basePoints: 2450, baseJourneys: 45, baseEmissions: 156 },
    { name: 'James Chen', basePoints: 2180, baseJourneys: 38, baseEmissions: 142 },
    { name: 'Sophie Williams', basePoints: 1920, baseJourneys: 35, baseEmissions: 128 },
    { name: 'Oliver Brown', basePoints: 1750, baseJourneys: 32, baseEmissions: 115 },
    { name: 'Amelia Davis', basePoints: 1580, baseJourneys: 29, baseEmissions: 98 },
    { name: 'Noah Miller', basePoints: 1420, baseJourneys: 26, baseEmissions: 87 },
    { name: 'Isabella Wilson', basePoints: 1280, baseJourneys: 24, baseEmissions: 76 },
    { name: 'Lucas Taylor', basePoints: 1150, baseJourneys: 21, baseEmissions: 68 },
    { name: 'Mia Anderson', basePoints: 1020, baseJourneys: 19, baseEmissions: 61 },
    { name: 'Ethan Martinez', basePoints: 890, baseJourneys: 16, baseEmissions: 54 },
    { name: 'Ava Garcia', basePoints: 780, baseJourneys: 14, baseEmissions: 47 },
    { name: 'Mason Lee', basePoints: 670, baseJourneys: 12, baseEmissions: 42 },
    { name: 'Charlotte Wang', basePoints: 560, baseJourneys: 10, baseEmissions: 36 },
    { name: 'Liam Johnson', basePoints: 450, baseJourneys: 9, baseEmissions: 31 },
  ];
  
  // Filter user's journeys based on time period
  let filteredJourneys = userData.journeys;
  if (filter === 'week') {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    filteredJourneys = userData.journeys.filter(j => new Date(j.date) > weekAgo);
  } else if (filter === 'month') {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    filteredJourneys = userData.journeys.filter(j => new Date(j.date) > monthAgo);
  }
  
  const userPoints = filteredJourneys.reduce((sum, j) => sum + j.points, 0);
  const userEmissions = filteredJourneys.reduce((sum, j) => sum + j.emissionsSaved, 0);
  
  // Adjust mock data based on filter
  const multiplier = filter === 'week' ? 0.3 : filter === 'month' ? 0.6 : 1;
  
  // Create leaderboard entries
  const entries = [
    ...mockUsers.map(user => ({
      name: user.name,
      points: Math.round(user.basePoints * multiplier),
      journeys: Math.round(user.baseJourneys * multiplier),
      emissionsSaved: user.baseEmissions * multiplier,
      isCurrentUser: false,
    })),
    {
      name: userData.name,
      points: userPoints,
      journeys: filteredJourneys.length,
      emissionsSaved: userEmissions,
      isCurrentUser: true,
    }
  ];
  
  // Sort by points
  entries.sort((a, b) => b.points - a.points);
  
  // Add ranks and update user rank
  const leaderboard = entries.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
  
  // Update user's rank in storage
  const currentUserEntry = leaderboard.find(e => e.isCurrentUser);
  if (currentUserEntry && filter === 'all') {
    userData.rank = currentUserEntry.rank;
    localStorage.setItem('uwe-ecocommute-user', JSON.stringify(userData));
  }
  
  return leaderboard;
}
