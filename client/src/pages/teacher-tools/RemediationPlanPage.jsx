import React, { useState } from 'react';
import RemediationPlanList from '../../components/teacher-tools/remediation-plan/RemediationPlanList';
import RemediationPlanForm from '../../components/teacher-tools/remediation-plan/RemediationPlanForm';
import '../../components/teacher-tools/remediation-plan/RemediationPlan.css';
import './RemediationPlanPage.css';

const RemediationPlanPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const handleCreatePlan = () => {
    setSelectedPlanId(null);
    setShowForm(true);
    setActiveTab('create');
  };

  const handleEditPlan = (planId) => {
    setSelectedPlanId(planId);
    setShowForm(true);
    setActiveTab('create');
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setActiveTab('list');
    setSelectedPlanId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setActiveTab('list');
    setSelectedPlanId(null);
  };

  // If showing the dashboard overview
  if (activeTab === 'dashboard') {
    return (
      <div className="remediation-plan-page">
        <div className="page-header">
          <h1>Remediation Plans</h1>
          <p className="page-description">
            Create and manage personalized remediation plans for students who need additional support.
          </p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>View Remediation Plans</h3>
            <p>Access all your existing remediation plans. Track progress, update interventions, and monitor student improvement over time.</p>
            <button className="card-link" onClick={() => setActiveTab('list')}>
              Navigate
            </button>
          </div>

          <div className="dashboard-card">
            <h3>Create New Plan</h3>
            <p>Quickly generate personalized remediation plans based on student needs, curriculum standards, and effective interventions.</p>
            <button className="card-link" onClick={handleCreatePlan}>
              Navigate
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="remediation-plan-page">
      <h1>Student Remediation Plans</h1>
      
      {!showForm && (
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            View Plans
          </button>
          <button 
            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
            onClick={handleCreatePlan}
          >
            Create New Plan
          </button>
        </div>
      )}
      
      <div className="tab-content">
        {activeTab === 'list' && !showForm && (
          <RemediationPlanList onEdit={handleEditPlan} />
        )}
        
        {(activeTab === 'create' || showForm) && (
          <RemediationPlanForm 
            planId={selectedPlanId}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </div>
    </div>
  );
};

export default RemediationPlanPage; 