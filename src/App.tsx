import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SplashScreen } from "@/components/SplashScreen";
import Dashboard from "@/pages/Dashboard";
import PowerAnalytics from "@/pages/analytics/PowerAnalytics";
import IoTTelemetry from "@/pages/analytics/IoTTelemetry";
import TicketingAnalytics from "@/pages/analytics/TicketingAnalytics";
import FootfallAnalytics from "@/pages/analytics/FootfallAnalytics";
import AssetManagement from "@/pages/analytics/AssetManagement";
import LogisticsHub from "@/pages/LogisticsHub";
import AuctionDashboard from "@/pages/AuctionDashboard";
import DynamicPricing from "@/pages/DynamicPricing";
import PlatformEfficiency from "@/pages/PlatformEfficiency";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/NotFound";
import TrackSafety from "@/pages/safety/TrackSafety";
import SafetyDashboard from "@/pages/safety/SafetyDashboard";
import CollisionPrevention from "@/pages/safety/CollisionPrevention";
import Cleanliness from "@/pages/safety/Cleanliness";
import LegacyIntegration from "@/pages/safety/LegacyIntegration";
import IncidentManagement from "@/pages/safety/IncidentManagement";
import IoTDashboard from "@/pages/iot/IoTDashboard";
import IoTDevices from "@/pages/iot/IoTDevices";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              {/* IoT Command Center */}
              <Route path="/iot" element={<IoTDashboard />} />
              <Route path="/iot/devices" element={<IoTDevices />} />
              <Route path="/iot/alerts" element={<IoTDevices />} />
              <Route path="/iot/ai" element={<IoTDevices />} />
              {/* Analytics */}
              <Route path="/analytics/power" element={<PowerAnalytics />} />
              <Route path="/analytics/iot" element={<IoTTelemetry />} />
              <Route path="/analytics/ticketing" element={<TicketingAnalytics />} />
              <Route path="/analytics/footfall" element={<FootfallAnalytics />} />
              <Route path="/analytics/assets" element={<AssetManagement />} />
              {/* Other modules */}
              <Route path="/logistics" element={<LogisticsHub />} />
              <Route path="/auction" element={<AuctionDashboard />} />
              <Route path="/pricing" element={<DynamicPricing />} />
              <Route path="/platform" element={<PlatformEfficiency />} />
              {/* Safety */}
              <Route path="/safety" element={<SafetyDashboard />} />
              <Route path="/safety/track" element={<TrackSafety />} />
              <Route path="/safety/collision" element={<CollisionPrevention />} />
              <Route path="/safety/cleanliness" element={<Cleanliness />} />
              <Route path="/safety/legacy" element={<LegacyIntegration />} />
              <Route path="/safety/incident" element={<IncidentManagement />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
