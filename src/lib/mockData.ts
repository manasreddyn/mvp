// RailSync Pro - Mock Data Generators
// Realistic Indian Railways data

// Helper to generate random number in range
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number, decimals = 2) => 
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

// Indian Railway Zones
export const railwayZones = [
  { code: 'NR', name: 'Northern Railway', hq: 'New Delhi' },
  { code: 'WR', name: 'Western Railway', hq: 'Mumbai' },
  { code: 'SR', name: 'Southern Railway', hq: 'Chennai' },
  { code: 'ER', name: 'Eastern Railway', hq: 'Kolkata' },
  { code: 'CR', name: 'Central Railway', hq: 'Mumbai' },
  { code: 'SER', name: 'South Eastern Railway', hq: 'Kolkata' },
  { code: 'SCR', name: 'South Central Railway', hq: 'Secunderabad' },
  { code: 'NFR', name: 'Northeast Frontier Railway', hq: 'Guwahati' },
];

// Major Stations
export const majorStations = [
  { code: 'NDLS', name: 'New Delhi', zone: 'NR' },
  { code: 'BCT', name: 'Mumbai Central', zone: 'WR' },
  { code: 'CSTM', name: 'Mumbai CST', zone: 'CR' },
  { code: 'HWH', name: 'Howrah Junction', zone: 'ER' },
  { code: 'MAS', name: 'Chennai Central', zone: 'SR' },
  { code: 'SBC', name: 'Bengaluru City', zone: 'SWR' },
  { code: 'JP', name: 'Jaipur Junction', zone: 'NWR' },
  { code: 'LKO', name: 'Lucknow Charbagh', zone: 'NR' },
  { code: 'ADI', name: 'Ahmedabad Junction', zone: 'WR' },
  { code: 'SC', name: 'Secunderabad', zone: 'SCR' },
  { code: 'PNBE', name: 'Patna Junction', zone: 'ECR' },
  { code: 'GHY', name: 'Guwahati', zone: 'NFR' },
];

// Train types
export const trainTypes = ['Rajdhani', 'Shatabdi', 'Duronto', 'Superfast', 'Express', 'Mail', 'Local'];

// Generate Power Consumption Data
export const generatePowerData = (hours = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: timestamp.toISOString(),
      hour: timestamp.getHours(),
      express: rand(800, 1200),
      freight: rand(1200, 1800),
      local: rand(400, 700),
      total: rand(2400, 3700),
    });
  }
  return data;
};

// Generate IoT Telemetry Data
export const generateIoTDevices = (count = 50) => {
  const deviceTypes = ['track_sensor', 'signal', 'point_machine', 'environmental'];
  const statuses = ['healthy', 'warning', 'critical', 'offline'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `DEV-${String(i + 1).padStart(5, '0')}`,
    type: deviceTypes[rand(0, deviceTypes.length - 1)],
    location: majorStations[rand(0, majorStations.length - 1)],
    temperature: randFloat(25, 65),
    vibration: randFloat(0.5, 8.0),
    humidity: rand(30, 85),
    batteryLevel: rand(15, 100),
    signalQuality: rand(50, 100),
    status: statuses[rand(0, 3)],
    lastContact: new Date(Date.now() - rand(0, 3600000)).toISOString(),
  }));
};

// Generate Ticketing Traffic Data
export const generateTicketingData = (days = 7) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    data.push({
      date: date.toISOString().split('T')[0],
      totalBookings: rand(150000, 250000),
      confirmed: rand(120000, 200000),
      waitlisted: rand(15000, 35000),
      cancelled: rand(5000, 15000),
      revenue: rand(45000000, 85000000),
      avgPrice: rand(450, 850),
    });
  }
  return data;
};

// Generate Footfall Data
export const generateFootfallData = (hours = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = timestamp.getHours();
    // Peak hours pattern
    const multiplier = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20) ? 1.5 : 1;
    
    data.push({
      time: timestamp.toISOString(),
      hour,
      entry: Math.floor(rand(800, 2000) * multiplier),
      exit: Math.floor(rand(750, 1900) * multiplier),
      total: Math.floor(rand(1500, 3800) * multiplier),
    });
  }
  return data;
};

// Generate Asset Data
export const generateAssets = (count = 30) => {
  const assetTypes = ['locomotive', 'coach', 'track', 'building', 'equipment'];
  const statuses = ['operational', 'maintenance', 'repair', 'retired'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `AST-${String(i + 1).padStart(5, '0')}`,
    type: assetTypes[rand(0, assetTypes.length - 1)],
    name: `Asset ${i + 1}`,
    location: majorStations[rand(0, majorStations.length - 1)].name,
    purchaseValue: rand(5000000, 250000000),
    currentValue: rand(2000000, 200000000),
    utilizationRate: rand(45, 98),
    status: statuses[rand(0, 3)],
    lastMaintenance: new Date(Date.now() - rand(0, 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextMaintenance: new Date(Date.now() + rand(1, 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
};

// Generate Logistics Requests
export const generateLogisticsRequests = (count = 20) => {
  const cargoTypes = ['general', 'chemicals', 'automotive', 'fmcg', 'electronics', 'oil_gas'];
  const statuses = ['pending', 'matched', 'in_transit', 'delivered'];
  
  return Array.from({ length: count }, (_, i) => {
    const origin = majorStations[rand(0, majorStations.length - 1)];
    let destination = majorStations[rand(0, majorStations.length - 1)];
    while (destination.code === origin.code) {
      destination = majorStations[rand(0, majorStations.length - 1)];
    }
    
    return {
      id: `LR-2026-${String(i + 1).padStart(4, '0')}`,
      shipper: `Company ${String.fromCharCode(65 + rand(0, 25))} Industries`,
      cargoType: cargoTypes[rand(0, cargoTypes.length - 1)],
      weight: rand(10, 500),
      origin,
      destination,
      distance: rand(200, 2500),
      estimatedCost: rand(50000, 500000),
      status: statuses[rand(0, 3)],
      createdAt: new Date(Date.now() - rand(0, 7) * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

// Generate Auction/Tender Data
export const generateTenders = (count = 15) => {
  const categories = ['energy', 'technology', 'equipment', 'infrastructure'];
  const statuses = ['open', 'evaluation', 'awarded', 'closed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `TND-2026-${String(i + 1).padStart(4, '0')}`,
    title: [
      'Solar Panel Installation for Stations',
      'IoT Sensor Deployment - Phase II',
      'Rolling Stock Modernization',
      'Track Renewal Project',
      'Signaling System Upgrade',
      'Power Supply Equipment',
      'CCTV Installation',
      'Platform Extension Works',
    ][rand(0, 7)],
    category: categories[rand(0, categories.length - 1)],
    estimatedValue: rand(10000000, 500000000),
    bidsReceived: rand(3, 25),
    status: statuses[rand(0, 3)],
    deadline: new Date(Date.now() + rand(-10, 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    publishedDate: new Date(Date.now() - rand(5, 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
};

// Generate Platform Efficiency Data
export const generatePlatformData = () => {
  return majorStations.slice(0, 8).map((station) => ({
    station,
    platforms: rand(8, 16),
    utilizationRate: rand(65, 95),
    trainsScheduled: rand(80, 200),
    trainsDelayed: rand(5, 25),
    onTimePerformance: rand(75, 98),
    avgDwellTime: randFloat(5, 15),
    peakLoad: rand(4000, 12000),
    revenue: rand(500000, 2500000),
  }));
};

// Generate Dynamic Pricing Data
export const generatePricingData = (routes = 10) => {
  return Array.from({ length: routes }, (_, i) => {
    const origin = majorStations[i % majorStations.length];
    const destination = majorStations[(i + 4) % majorStations.length];
    
    return {
      route: `${origin.code}-${destination.code}`,
      routeName: `${origin.name} to ${destination.name}`,
      basePrice: rand(500, 2500),
      currentPrice: rand(550, 3000),
      demandIndex: randFloat(0.5, 1.5),
      occupancy: rand(45, 98),
      priceChange: randFloat(-15, 25),
      competitorPrice: rand(450, 2800),
      suggestedPrice: rand(550, 3200),
    };
  });
};

// Dashboard Summary Stats
export const getDashboardStats = () => ({
  totalRevenue: {
    value: 245.8,
    unit: 'Cr',
    change: 12.5,
    trend: 'up',
  },
  activeTrains: {
    value: 1847,
    change: 23,
    trend: 'up',
  },
  dailyPassengers: {
    value: 2.4,
    unit: 'M',
    change: 8.2,
    trend: 'up',
  },
  onTimePerformance: {
    value: 94.2,
    unit: '%',
    change: -1.3,
    trend: 'down',
  },
  activeDevices: {
    value: 12847,
    change: 156,
    trend: 'up',
  },
  freightVolume: {
    value: 4.2,
    unit: 'MT',
    change: 5.7,
    trend: 'up',
  },
  activeTenders: {
    value: 48,
    change: 7,
    trend: 'up',
  },
  powerConsumption: {
    value: 847,
    unit: 'MWh',
    change: -3.2,
    trend: 'down',
  },
});

// Recent Alerts
export const getRecentAlerts = () => [
  { id: 1, type: 'warning', message: 'High crowd density at Platform 3, NDLS', time: '2 mins ago', station: 'NDLS' },
  { id: 2, type: 'critical', message: 'Track sensor TRK-00145 offline', time: '5 mins ago', station: 'BCT' },
  { id: 3, type: 'info', message: 'Train 12952 departed on time', time: '8 mins ago', station: 'NDLS' },
  { id: 4, type: 'success', message: 'Power consumption normalized in Zone NR', time: '12 mins ago', station: 'NR' },
  { id: 5, type: 'warning', message: 'Tender TND-2026-0012 deadline in 24 hours', time: '15 mins ago', station: null },
];

// Format currency in Indian format
export const formatINR = (value: number, inCrores = false) => {
  if (inCrores) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Format large numbers
export const formatNumber = (value: number) => {
  if (value >= 10000000) {
    return `${(value / 10000000).toFixed(2)} Cr`;
  }
  if (value >= 100000) {
    return `${(value / 100000).toFixed(2)} L`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
