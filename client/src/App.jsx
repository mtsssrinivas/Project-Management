import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@/contexts/ToastContext';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { AppShell } from '@/components/layout/AppShell';

// Pages
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Workspaces } from '@/pages/Workspaces';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { ProjectBoard } from '@/pages/ProjectBoard';
import { CalendarPage } from '@/pages/Calendar';
import { MyTasks } from '@/pages/MyTasks';
import { Team } from '@/pages/Team';
import { Settings } from '@/pages/Settings';
import { Profile } from '@/pages/Profile';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <WorkspaceProvider>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Application Shell */}
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workspaces" element={<Workspaces />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/projects/:projectId/board" element={<ProjectBoard />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/my-tasks" element={<MyTasks />} />
              <Route path="/team" element={<Team />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </WorkspaceProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
