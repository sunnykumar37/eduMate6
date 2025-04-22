import React, { useState } from 'react';
import RemediationPlanList from '../../components/teacher-tools/remediation-plan/RemediationPlanList';
import RemediationPlanForm from '../../components/teacher-tools/remediation-plan/RemediationPlanForm';
import '../../components/teacher-tools/remediation-plan/RemediationPlan.css';
import './RemediationPlanPage.css';

const RemediationPlanGeneratorPage = () => {
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

  return (
    <div className="remediation-plan-page">
      <h1>Remediation Plan Generator</h1>
      
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

      {showForm ? (
        <div className="tab-content">
          <RemediationPlanForm
            planId={selectedPlanId}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      ) : (
        <div className="tab-content">
          {activeTab === 'list' && (
            <div>
              <div className="list-header">
                <h2>Your Remediation Plans</h2>
                <button className="btn-primary" onClick={handleCreatePlan}>
                  Create New Plan
                </button>
              </div>
              <RemediationPlanList onEdit={handleEditPlan} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RemediationPlanGeneratorPage; 