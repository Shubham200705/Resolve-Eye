import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { LandingPage } from '@/pages/LandingPage';
import { UserDashboard } from '@/pages/UserDashboard';
import { ExplorePlaces } from '@/pages/ExplorePlaces';
import { PlaceDetails } from '@/pages/PlaceDetails';
import { ReportIssue } from '@/pages/ReportIssue';
import { MyIssues } from '@/pages/MyIssues';
import { IssueDetails } from '@/pages/IssueDetails';
import { AIAssistant } from '@/pages/AIAssistant';
import { ManagementDashboard } from '@/pages/ManagementDashboard';
import { Notifications } from '@/pages/Notifications';
import { Profile } from '@/pages/Profile';
import { AdminDashboard } from '@/pages/AdminDashboard';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/explore" element={<ExplorePlaces />} />
            <Route path="/places/:id" element={<PlaceDetails />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/my-issues" element={<MyIssues />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/management" element={<ManagementDashboard />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
