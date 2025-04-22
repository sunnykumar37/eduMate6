import React, { useState, useEffect } from 'react';
import { 
  getAllRemediationPlans, 
  deleteRemediationPlan, 
  searchRemediationPlans 
} from '../../../services/remediationPlanService';
import './RemediationPlan.css';

const RemediationPlanList = ({ onEdit }) => {
  const [remediationPlans, setRemediationPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  // Fetch remediation plans on component mount
  useEffect(() => {
    fetchRemediationPlans();
  }, []);

  // Function to fetch all remediation plans
  const fetchRemediationPlans = async () => {
    setLoading(true);
    try {
      const data = await getAllRemediationPlans();
      setRemediationPlans(data);
      setError(null);
    } catch (err) {
      setError('Failed to load remediation plans. Please try again later.');
      console.error('Error fetching remediation plans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters = {
        query: searchTerm,
        status: statusFilter,
        gradeLevel: gradeFilter
      };
      
      const data = await searchRemediationPlans(filters);
      setRemediationPlans(data);
      setError(null);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching remediation plans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset search filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setGradeFilter('');
    fetchRemediationPlans();
  };

  // Function to handle view details
  const handleView = (plan) => {
    setSelectedPlan(plan);
    setShowDetails(true);
  };

  // Function to handle edit
  const handleEdit = (plan) => {
    onEdit(plan);
  };

  // Function to handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this remediation plan?')) {
      setLoading(true);
      try {
        await deleteRemediationPlan(id);
        // Refresh the list after deletion
        fetchRemediationPlans();
      } catch (err) {
        setError('Failed to delete the remediation plan. Please try again.');
        console.error('Error deleting remediation plan:', err);
        setLoading(false);
      }
    }
  };

  // Function to close the details modal
  const closeDetails = () => {
    setShowDetails(false);
    setSelectedPlan(null);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    let className = 'status-badge ';
    
    switch (status.toLowerCase()) {
      case 'not started':
        className += 'status-not-started';
        break;
      case 'in progress':
        className += 'status-in-progress';
        break;
      case 'completed':
        className += 'status-completed';
        break;
      default:
        className += 'status-not-started';
    }
    
    return <span className={className}>{status}</span>;
  };

  if (loading && remediationPlans.length === 0) {
    return (
      <div className="loading-indicator">
        <div className="loading-spinner"></div>
        <p>Loading remediation plans...</p>
      </div>
    );
  }

  return (
    <div className="remediation-plans-list">
      <div className="remediation-plans-header">
        <h2>Remediation Plans</h2>
      </div>

      {error && (
        <div className="error-display">
          {error}
        </div>
      )}

      <div className="search-and-filter">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by student name or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="filter-options">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select 
            value={gradeFilter} 
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="">All Grades</option>
            <option value="K">Kindergarten</option>
            <option value="1">1st Grade</option>
            <option value="2">2nd Grade</option>
            <option value="3">3rd Grade</option>
            <option value="4">4th Grade</option>
            <option value="5">5th Grade</option>
            <option value="6">6th Grade</option>
            <option value="7">7th Grade</option>
            <option value="8">8th Grade</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
          
          <button className="btn-view" onClick={handleSearch}>Search</button>
          <button className="btn-edit" onClick={resetFilters}>Reset</button>
        </div>
      </div>

      {remediationPlans.length === 0 ? (
        <div className="empty-message">
          No remediation plans found. Create a new one to get started.
        </div>
      ) : (
        <table className="remediation-plans-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Student</th>
              <th>Grade</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {remediationPlans.map((plan) => (
              <tr key={plan.id}>
                <td>{plan.title}</td>
                <td>{plan.studentName}</td>
                <td>{plan.gradeLevel}</td>
                <td>{formatDate(plan.startDate)}</td>
                <td>{formatDate(plan.endDate)}</td>
                <td>{renderStatusBadge(plan.status)}</td>
                <td className="action-buttons">
                  <button 
                    className="btn-view" 
                    onClick={() => handleView(plan)}
                  >
                    View
                  </button>
                  <button 
                    className="btn-edit" 
                    onClick={() => handleEdit(plan)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete" 
                    onClick={() => handleDelete(plan.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showDetails && selectedPlan && (
        <div className="remediation-plan-details">
          <div className="modal-backdrop" onClick={closeDetails}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedPlan.title}</h2>
              <button className="close-button" onClick={closeDetails}>&times;</button>
            </div>
            
            <div className="plan-info">
              <div className="plan-info-row">
                <div className="info-label">Student Name:</div>
                <div className="info-value">{selectedPlan.studentName}</div>
              </div>
              <div className="plan-info-row">
                <div className="info-label">Grade Level:</div>
                <div className="info-value">{selectedPlan.gradeLevel}</div>
              </div>
              <div className="plan-info-row">
                <div className="info-label">Start Date:</div>
                <div className="info-value">{formatDate(selectedPlan.startDate)}</div>
              </div>
              <div className="plan-info-row">
                <div className="info-label">End Date:</div>
                <div className="info-value">{formatDate(selectedPlan.endDate)}</div>
              </div>
              <div className="plan-info-row">
                <div className="info-label">Status:</div>
                <div className="info-value">{renderStatusBadge(selectedPlan.status)}</div>
              </div>
            </div>
            
            <div className="tab-navigation">
              <button className="tab-button active">Overview</button>
            </div>
            
            <div className="tab-content">
              {selectedPlan.description && (
                <div className="plan-description">
                  <h3 className="section-title">Description</h3>
                  <p>{selectedPlan.description}</p>
                </div>
              )}
              
              {selectedPlan.notes && (
                <div className="plan-description">
                  <h3 className="section-title">Notes</h3>
                  <p>{selectedPlan.notes}</p>
                </div>
              )}
              
              {selectedPlan.targetAreas && selectedPlan.targetAreas.length > 0 && (
                <div>
                  <h3 className="section-title">Target Areas</h3>
                  <ul className="target-areas-list">
                    {selectedPlan.targetAreas.map((area, index) => (
                      <li key={index} className="target-area-item">
                        <h4>{area.name}</h4>
                        {area.description && <p>{area.description}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedPlan.goals && selectedPlan.goals.length > 0 && (
                <div>
                  <h3 className="section-title">Goals</h3>
                  <ul className="goals-list">
                    {selectedPlan.goals.map((goal, index) => (
                      <li key={index} className="goal-item">
                        <h4>{goal.description}</h4>
                        <div className="goal-details">
                          <div className="detail-row">
                            <div className="detail-label">Success Criteria:</div>
                            <div className="detail-value">{goal.successCriteria}</div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-label">Timeline:</div>
                            <div className="detail-value">{goal.timeline}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedPlan.activities && selectedPlan.activities.length > 0 && (
                <div>
                  <h3 className="section-title">Activities</h3>
                  <ul className="activities-list">
                    {selectedPlan.activities.map((activity, index) => (
                      <li key={index} className="activity-item">
                        <h4>{activity.name}</h4>
                        <div className="activity-details">
                          <div className="detail-row">
                            <div className="detail-label">Description:</div>
                            <div className="detail-value">{activity.description}</div>
                          </div>
                          <div className="detail-row">
                            <div className="detail-label">Frequency:</div>
                            <div className="detail-value">{activity.frequency}</div>
                          </div>
                          
                          {activity.resources && activity.resources.length > 0 && (
                            <div>
                              <h5>Resources</h5>
                              <ul className="resources-list">
                                {activity.resources.map((resource, resIndex) => (
                                  <li key={resIndex} className="resource-item">
                                    <span className="resource-title">{resource.name}</span>
                                    {resource.url && (
                                      <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="resource-url"
                                      >
                                        View Resource
                                      </a>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              <button className="btn-close" onClick={closeDetails}>Close</button>
              <button 
                className="btn-edit-plan" 
                onClick={() => {
                  closeDetails();
                  handleEdit(selectedPlan);
                }}
              >
                Edit Plan
              </button>
              <button 
                className="btn-delete-plan" 
                onClick={() => {
                  closeDetails();
                  handleDelete(selectedPlan.id);
                }}
              >
                Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemediationPlanList; 