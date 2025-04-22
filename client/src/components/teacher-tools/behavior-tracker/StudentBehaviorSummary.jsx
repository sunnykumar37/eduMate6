import React, { useState, useEffect } from 'react';
import { getStudentBehaviorSummary } from '../../../services/teacher-tools/behaviorTrackerService';
import './BehaviorTracker.css';

const StudentBehaviorSummary = ({ studentName, onClose }) => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (studentName) {
      fetchStudentSummary();
    }
  }, [studentName]);
  
  const fetchStudentSummary = async () => {
    setLoading(true);
    try {
      const data = await getStudentBehaviorSummary(studentName);
      setSummaryData(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch student behavior summary. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Render behavior type badge
  const renderBehaviorTypeBadge = (type) => {
    let badgeClass = '';
    
    switch (type) {
      case 'Positive':
        badgeClass = 'badge-positive';
        break;
      case 'Concerning':
        badgeClass = 'badge-concerning';
        break;
      case 'Neutral':
        badgeClass = 'badge-neutral';
        break;
      default:
        badgeClass = '';
    }
    
    return <span className={`behavior-badge ${badgeClass}`}>{type}</span>;
  };
  
  // Generate summary chart color
  const getChartColor = (type) => {
    switch (type) {
      case 'Positive':
        return '#4CAF50';
      case 'Concerning':
        return '#F44336';
      case 'Neutral':
        return '#9E9E9E';
      case 'Academic Engagement':
        return '#2196F3';
      case 'Classroom Conduct':
        return '#FF9800';
      case 'Social Interaction':
        return '#9C27B0';
      case 'Emotional Regulation':
        return '#E91E63';
      case 'Other':
        return '#607D8B';
      default:
        return '#CCCCCC';
    }
  };
  
  // Calculate chart dimensions
  const calculateBarWidth = (count, maxCount) => {
    return (count / maxCount) * 100;
  };
  
  return (
    <div className="student-behavior-summary">
      <div className="summary-header">
        <h2>Behavior Summary: {studentName}</h2>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading student behavior summary...</div>
      ) : summaryData ? (
        <div className="summary-content">
          <div className="summary-section">
            <h3>Behavior Type Distribution</h3>
            {summaryData.typeCounts.length === 0 ? (
              <p>No behavior data available.</p>
            ) : (
              <div className="chart-container">
                {summaryData.typeCounts.map(item => {
                  const maxCount = Math.max(...summaryData.typeCounts.map(i => i.count));
                  const barWidth = calculateBarWidth(item.count, maxCount);
                  
                  return (
                    <div key={item._id} className="chart-item">
                      <div className="chart-label">{item._id}</div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar" 
                          style={{ 
                            width: `${barWidth}%`,
                            backgroundColor: getChartColor(item._id)
                          }}
                        >
                          <span className="chart-value">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="summary-section">
            <h3>Behavior Categories</h3>
            {summaryData.categoryCounts.length === 0 ? (
              <p>No category data available.</p>
            ) : (
              <div className="chart-container">
                {summaryData.categoryCounts.map(item => {
                  const maxCount = Math.max(...summaryData.categoryCounts.map(i => i.count));
                  const barWidth = calculateBarWidth(item.count, maxCount);
                  
                  return (
                    <div key={item._id} className="chart-item">
                      <div className="chart-label">{item._id}</div>
                      <div className="chart-bar-container">
                        <div 
                          className="chart-bar" 
                          style={{ 
                            width: `${barWidth}%`,
                            backgroundColor: getChartColor(item._id)
                          }}
                        >
                          <span className="chart-value">{item.count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="summary-section">
            <h3>Recent Records</h3>
            {summaryData.recentRecords.length === 0 ? (
              <p>No recent records available.</p>
            ) : (
              <div className="recent-records">
                {summaryData.recentRecords.map((record, index) => (
                  <div key={record.id || index} className="record-card">
                    <div className="record-date">{formatDate(record.date)}</div>
                    <div className="record-type">
                      {renderBehaviorTypeBadge(record.behaviorType)} | {record.category}
                    </div>
                    <div className="record-description">{record.description}</div>
                    {record.followUpNeeded && (
                      <div className="record-followup">
                        <strong>Follow-up:</strong> {record.followUpNotes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-data">No data available for {studentName}</div>
      )}
    </div>
  );
};

export default StudentBehaviorSummary; 