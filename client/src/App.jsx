import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CurriculumAlignmentPage from './pages/teacher-tools/CurriculumAlignmentPage';
import AssignmentGeneratorPage from './pages/teacher-tools/AssignmentGeneratorPage';
import DifferentiatedMaterialsPage from './pages/teacher-tools/DifferentiatedMaterialsPage';
import RemediationPlanPage from './pages/teacher-tools/RemediationPlanPage';
import BehaviorTrackerPage from './pages/teacher-tools/BehaviorTrackerPage';
import './App.css';
import './components/teacher-tools/curriculum-alignment/CurriculumAlignment.css';

// Placeholder components for future implementation
const ProgressAnalyticsPage = () => <div>Progress Analytics Page (Coming Soon)</div>;

// Main navigation component
const Navbar = () => (
  <nav className="main-nav">
    <div className="nav-logo">eduMate</div>
  </nav>
);

// Dashboard component
const Dashboard = () => (
  <div className="dashboard">
    <h1>Teacher Tools Dashboard</h1>
    <div className="dashboard-cards">
      <div className="dashboard-card">
        <h3>Curriculum Alignment</h3>
        <p>Check how well your teaching materials align with curriculum standards</p>
        <a href="#/teacher-tools/curriculum-alignment" className="card-link">Navigate</a>
      </div>
      <div className="dashboard-card">
        <h3>Assignment Generator</h3>
        <p>Create assignments and rubrics quickly</p>
        <a href="#/teacher-tools/assignment-generator" className="card-link">Navigate</a>
      </div>
      <div className="dashboard-card">
        <h3>Differentiated Materials</h3>
        <p>Create materials for different learning levels</p>
        <a href="#/teacher-tools/differentiated-materials" className="card-link">Navigate</a>
      </div>
      <div className="dashboard-card">
        <h3>Remediation Plans</h3>
        <p>Generate personalized learning plans for students</p>
        <a href="#/teacher-tools/remediation-plan" className="card-link">Navigate</a>
      </div>
      <div className="dashboard-card">
        <h3>Behavior Tracker</h3>
        <p>Track and analyze student behavior patterns</p>
        <a href="#/teacher-tools/behavior-tracker" className="card-link">Navigate</a>
      </div>
      <div className="dashboard-card">
        <h3>Progress Analytics</h3>
        <p>View and analyze class performance</p>
        <a href="#/teacher-tools/progress-analytics" className="card-link">Navigate</a>
      </div>
    </div>
  </div>
);

// Main App component
function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teacher-tools/curriculum-alignment" element={<CurriculumAlignmentPage />} />
          <Route path="/teacher-tools/assignment-generator" element={<AssignmentGeneratorPage />} />
          <Route path="/teacher-tools/differentiated-materials" element={<DifferentiatedMaterialsPage />} />
          <Route path="/teacher-tools/remediation-plan" element={<RemediationPlanPage />} />
          <Route path="/teacher-tools/behavior-tracker" element={<BehaviorTrackerPage />} />
          <Route path="/teacher-tools/progress-analytics" element={<ProgressAnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} EduMate. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App; 