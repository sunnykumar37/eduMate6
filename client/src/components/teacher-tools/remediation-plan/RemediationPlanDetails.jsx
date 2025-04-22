import React, { useState, useEffect } from 'react';
import { getRemediationPlanById } from '../../../services/teacher-tools/remediationPlanService';
import ProgressTracker from './ProgressTracker';

const RemediationPlanDetails = ({ planId, onClose, onEdit, onDelete }) => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPlanDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await getRemediationPlanById(planId);
        setPlan(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching remediation plan details:', err);
        setError('Failed to load plan details. Please try again.');
        setLoading(false);
      }
    };

    if (planId) {
      fetchPlanDetails();
    }
  }, [planId]);

  const handleProgressUpdate = (updatedPlan) => {
    setPlan(updatedPlan);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'not_started':
        return 'Not Started';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const handleModalBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop') {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="modal-backdrop" onClick={handleModalBackdropClick}>
        <div className="modal-content plan-details-modal">
          <div className="modal-header">
            <h3>Remediation Plan Details</h3>
            <button type="button" className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p className="loading">Loading plan details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-backdrop" onClick={handleModalBackdropClick}>
        <div className="modal-content plan-details-modal">
          <div className="modal-header">
            <h3>Remediation Plan Details</h3>
            <button type="button" className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p className="error-message">{error}</p>
            <div className="modal-footer">
              <button type="button" className="btn-close" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="modal-backdrop" onClick={handleModalBackdropClick}>
        <div className="modal-content plan-details-modal">
          <div className="modal-header">
            <h3>Remediation Plan Details</h3>
            <button type="button" className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="modal-body">
            <p>No plan data available.</p>
            <div className="modal-footer">
              <button type="button" className="btn-close" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop" onClick={handleModalBackdropClick}>
      <div className="modal-content plan-details-modal">
        <div className="modal-header">
          <h3>{plan.title}</h3>
          <button type="button" className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="plan-details-tabs">
          <button 
            className={activeTab === 'overview' ? 'active' : ''} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'targets' ? 'active' : ''} 
            onClick={() => setActiveTab('targets')}
          >
            Target Areas
          </button>
          <button 
            className={activeTab === 'goals' ? 'active' : ''} 
            onClick={() => setActiveTab('goals')}
          >
            Learning Goals
          </button>
          <button 
            className={activeTab === 'activities' ? 'active' : ''} 
            onClick={() => setActiveTab('activities')}
          >
            Activities
          </button>
        </div>
        
        <div className="modal-body">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="plan-info-grid">
                <div className="info-group">
                  <h4>Student Information</h4>
                  <p><strong>Name:</strong> {plan.student?.name || 'Not specified'}</p>
                  <p><strong>Grade Level:</strong> {plan.student?.gradeLevel || 'Not specified'}</p>
                  <p><strong>ID:</strong> {plan.student?.id || 'Not specified'}</p>
                </div>
                
                <div className="info-group">
                  <h4>Plan Timeline</h4>
                  <p><strong>Created:</strong> {formatDate(plan.createdAt)}</p>
                  <p><strong>Start Date:</strong> {formatDate(plan.startDate)}</p>
                  <p><strong>End Date:</strong> {formatDate(plan.endDate)}</p>
                  <p><strong>Status:</strong> <span className={`status-${plan.status || 'not_started'}`}>{getStatusText(plan.status)}</span></p>
                </div>
              </div>
              
              <div className="plan-description">
                <h4>Description</h4>
                <p>{plan.description || 'No description provided.'}</p>
              </div>
              
              <div className="plan-notes">
                <h4>Notes</h4>
                <p>{plan.notes || 'No notes provided.'}</p>
              </div>
            </div>
          )}
          
          {activeTab === 'targets' && (
            <div className="targets-section">
              <h4>Target Areas for Improvement</h4>
              {plan.targetAreas && plan.targetAreas.length > 0 ? (
                <div className="target-areas-list">
                  {plan.targetAreas.map((area, index) => (
                    <div key={index} className="target-area-card">
                      <h5>{area.subject}</h5>
                      <p><strong>Skill:</strong> {area.skill}</p>
                      <p><strong>Current Level:</strong> {area.currentLevel}</p>
                      <p><strong>Target Level:</strong> {area.targetLevel}</p>
                      <p><strong>Description:</strong> {area.description || 'No description provided.'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No target areas specified.</p>
              )}
            </div>
          )}
          
          {activeTab === 'goals' && (
            <div className="goals-section">
              <h4>Learning Goals</h4>
              {plan.goals && plan.goals.length > 0 ? (
                <div className="goals-list">
                  {plan.goals.map((goal, index) => (
                    <div key={index} className="goal-card">
                      <h5>Goal {index + 1}</h5>
                      <p><strong>Description:</strong> {goal.description}</p>
                      <p><strong>Success Criteria:</strong> {goal.successCriteria || 'Not specified'}</p>
                      <p><strong>Timeline:</strong> {goal.timeline || 'Not specified'}</p>
                      <p><strong>Measurement Method:</strong> {goal.measurementMethod || 'Not specified'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No learning goals specified.</p>
              )}
            </div>
          )}
          
          {activeTab === 'activities' && (
            <div className="activities-section">
              <h4>Remediation Activities</h4>
              {plan.activities && plan.activities.length > 0 ? (
                <div className="activities-list">
                  {plan.activities.map((activity, index) => (
                    <div key={index} className="activity-card">
                      <h5>{activity.title}</h5>
                      <p><strong>Description:</strong> {activity.description}</p>
                      <p><strong>Instructions:</strong> {activity.instructions || 'No specific instructions.'}</p>
                      <p><strong>Duration:</strong> {activity.duration || 'Not specified'}</p>
                      <p><strong>Frequency:</strong> {activity.frequency || 'Not specified'}</p>
                      
                      {activity.resources && activity.resources.length > 0 && (
                        <div className="resources">
                          <h6>Resources:</h6>
                          <ul>
                            {activity.resources.map((resource, rIndex) => (
                              <li key={rIndex}>
                                {resource.url ? (
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    {resource.title || resource.url}
                                  </a>
                                ) : (
                                  <span>{resource.title}</span>
                                )}
                                {resource.description && <span> - {resource.description}</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No activities specified.</p>
              )}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn-edit" onClick={() => onEdit(plan)}>
            Edit Plan
          </button>
          <button type="button" className="btn-delete" onClick={() => onDelete(plan._id)}>
            Delete Plan
          </button>
          <button type="button" className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default RemediationPlanDetails; 