import { Route, Routes } from 'react-router-dom';
import { RequireAdmin, RequireAuth } from './components/auth/Guards';
import { AppLayout } from './layouts/AppLayout';
import Account from './pages/Account';
import ChallengePage from './pages/ChallengePage';
import Course from './pages/Course';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import LessonPage from './pages/LessonPage';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Practice from './pages/Practice';
import ProgressPage from './pages/ProgressPage';
import ProjectPage from './pages/ProjectPage';
import Projects from './pages/Projects';
import Register from './pages/Register';
import AdminAudit from './pages/admin/AdminAudit';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminUsers from './pages/admin/AdminUsers';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="course" element={<Course />} />
          <Route path="lessons/:lessonId" element={<LessonPage />} />
          <Route path="practice" element={<Practice />} />
          <Route path="challenges/:challengeId" element={<ChallengePage />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:projectId" element={<ProjectPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="account" element={<Account />} />

          <Route element={<RequireAdmin />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<AdminUserDetail />} />
              <Route path="audit" element={<AdminAudit />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
