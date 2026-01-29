
export const trackSafetyData = {
  sectionId: "DLI-NDLS-SEC-5",
  kilometerPost: 12.5,
  healthScore: 68,
  riskCategory: "moderate",
  gaugeDeviation: 3.2,
  crossLevel: 1.8,
  alignment: 2.5,
  crackDetected: true,
  crackLength: 45,
  failureProbability: 0.35,
  timeToFailure: 45,
  lastInspection: "2026-01-20T08:30:00Z",
  maintenancePriority: "high",
  alerts: [
      { id: 1, type: "Crack Detected", severity: "critical", location: "KM 12.5", time: "2 hours ago" },
      { id: 2, type: "Gauge Deviation", severity: "moderate", location: "KM 12.8", time: "5 hours ago" }
  ]
};

export const collisionPreventionData = {
  trainId: "12345-EXP",
  latitude: 28.6139,
  longitude: 77.2090,
  currentSpeed: 95,
  heading: 145,
  nearbyTrains: [
    {
      trainId: "67890-FRT",
      relativeDistance: 1200,
      relativeSpeed: -15,
      collisionRisk: 0.65,
      timeToCollision: 45
    }
  ],
  kavachStatus: "active",
  awsStatus: "inactive",
  tpwsStatus: "active",
  gpsQuality: 98,
  automaticBrakeApplied: false,
  collisionProbability: 0.12
};

export const cleanlinessData = {
  stationCode: "NDLS",
  area: "Platform 3",
  cleanlinessScore: 72,
  floorCleanliness: 68,
  toiletHygiene: 81,
  litterDetected: true,
  litterCount: 12,
  airQualityIndex: 95,
  co2Level: 850,
  pm2_5: 42,
  wasteBinFillLevel: 78,
  lastCleaned: "2026-01-29T06:30:00Z",
  passengerRating: 3.8,
  nextCleaningRequired: "2026-01-29T14:00:00Z",
  cameraFeeds: [
      { id: 1, location: "Platform 3 - North", status: "active", issues: ["litter"] },
      { id: 2, location: "Waiting Hall", status: "active", issues: [] }
  ]
};

export const legacySystemsData = {
  timeline: [
      { era: "1980s", title: "Manual Operations", description: "Reliance on manual signaling and track inspection." },
      { era: "1990s", title: "AWS Introduction", description: "Auxiliary Warning System deployed in Mumbai suburban network." },
      { era: "2000s", title: "ACD Development", description: "Anti-Collision Device developed by Konkan Railway." },
      { era: "2010s", title: "TPWS Trials", description: "Train Protection Warning System based on ETCS Level 1." },
      { era: "2020s", title: "Kavach Rollout", description: "Indigenous TCAS implementation for national coverage." }
  ],
  comparison: [
      { feature: "Technology", aws: "Track Magnets", tpws: "Transponders", acd: "GPS + Radio", kavach: "Multi-sensor Fusion" },
      { feature: "Cost per km", aws: "Low", tpws: "High", acd: "Moderate", kavach: "Affordable" },
      { feature: "SIL Level", aws: "None", tpws: "SIL-4", acd: "None", kavach: "SIL-4" }
  ]
};

export const incidentData = {
  incidentId: "INC-2026-001",
  timestamp: "2026-01-28T14:30:00Z",
  type: "derailment",
  severity: "serious",
  location: {
    stationCode: "NDLS",
    kilometerPost: 25.3
  },
  trainsInvolved: ["12345"],
  casualties: {
    fatalities: 0,
    seriousInjuries: 3,
    minorInjuries: 12
  },
  rootCause: {
    primaryCause: "track_geometry_deviation",
    humanError: false,
    equipmentFailure: true
  },
  responseTime: 8.5,
  investigationStatus: "ongoing"
};
