import React, { useState, useEffect } from 'react';
import { 
  getAllBehaviorRecords, 
  searchBehaviorRecords, 
  deleteBehaviorRecord 
} from '../../../services/teacher-tools/behaviorTrackerService';
import './BehaviorTracker.css';

const BehaviorRecordList = ({ onEdit, onFormSuccess }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  
  // Search states
  const [searchName, setSearchName] = useState('');
  const [behaviorTypeFilter, setBehaviorTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [followUpFilter, setFollowUpFilter] = useState('');
  
  // Fetch behavior records
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await getAllBehaviorRecords();
      setRecords(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch behavior records. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecords();
  }, []);
  
  // Handle search and filters
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const searchParams = {
        studentName: searchName,
        behaviorType: behaviorTypeFilter,
        category: categoryFilter,
        followUpNeeded: followUpFilter
      };
      
      const data = await searchBehaviorRecords(searchParams);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError('Failed to search behavior records. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchName('');
    setBehaviorTypeFilter('');
    setCategoryFilter('');
    setFollowUpFilter('');
    fetchRecords();
  };
  
  // View record details
  const viewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetails(true);
  };
  
  // Edit record
  const handleEdit = (record) => {
    if (onEdit) {
      onEdit(record);
    }
  };
  
  // Delete record
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this behavior record?')) {
      try {
        await deleteBehaviorRecord(id);
        setRecords(records.filter(record => record.id !== id));
        if (onFormSuccess) {
          onFormSuccess();
        }
      } catch (err) {
        setError('Failed to delete behavior record. Please try again later.');
        console.error(err);
      }
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
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
  
  // Render follow up badge
  const renderFollowUpBadge = (needsFollowUp) => {
    return needsFollowUp 
      ? <span className="follow-up-badge">Needs Follow-up</span> 
      : null;
  };
  
  return (
    <div className="behavior-record-list">
      <h2>Behavior Records</h2>
      
      {/* Search Form */}
      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-row">
            <div className="search-field">
              <label htmlFor="searchName">Student Name:</label>
              <input
                type="text"
                id="searchName"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search by name..."
              />
            </div>
            
            <div className="search-field">
              <label htmlFor="behaviorTypeFilter">Behavior Type:</label>
              <select
                id="behaviorTypeFilter"
                value={behaviorTypeFilter}
                onChange={(e) => setBehaviorTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Positive">Positive</option>
                <option value="Concerning">Concerning</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
            
            <div className="search-field">
              <label htmlFor="categoryFilter">Category:</label>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Academic Engagement">Academic Engagement</option>
                <option value="Classroom Conduct">Classroom Conduct</option>
                <option value="Social Interaction">Social Interaction</option>
                <option value="Emotional Regulation">Emotional Regulation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="search-field">
              <label htmlFor="followUpFilter">Follow-up Status:</label>
              <select
                id="followUpFilter"
                value={followUpFilter}
                onChange={(e) => setFollowUpFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="true">Needs Follow-up</option>
                <option value="false">No Follow-up</option>
              </select>
            </div>
          </div>
          
          <div className="button-group">
            <button type="submit" className="btn btn-primary">Search</button>
            <button type="button" onClick={resetFilters} className="btn btn-secondary">Reset</button>
          </div>
        </form>
      </div>
      
      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Loading State */}
      {loading ? (
        <div className="loading">Loading behavior records...</div>
      ) : (
        <>
          {/* Records Table */}
          {records.length === 0 ? (
            <div className="no-records">No behavior records found.</div>
          ) : (
            <div className="table-responsive">
              <table className="behavior-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Date</th>
                    <th>Behavior Type</th>
                    <th>Category</th>
                    <th>Follow Up</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.studentName}</td>
                      <td>{formatDate(record.date)}</td>
                      <td>{renderBehaviorTypeBadge(record.behaviorType)}</td>
                      <td>{record.category}</td>
                      <td>{renderFollowUpBadge(record.followUpNeeded)}</td>
                      <td className="action-buttons">
                        <button 
                          onClick={() => viewDetails(record)} 
                          className="btn-icon" 
                          title="View Details"
                        >
                          <i className="fa fa-eye"></i>
                        </button>
                        <button 
                          onClick={() => handleEdit(record)} 
                          className="btn-icon" 
                          title="Edit Record"
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(record.id)} 
                          className="btn-icon delete" 
                          title="Delete Record"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
      {/* Detail Modal */}
      {showDetails && selectedRecord && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Behavior Record Details</h3>
              <button 
                onClick={() => setShowDetails(false)} 
                className="close-btn"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <strong>Student:</strong> {selectedRecord.studentName} (Grade {selectedRecord.gradeLevel})
              </div>
              <div className="detail-row">
                <strong>Date:</strong> {formatDate(selectedRecord.date)}
              </div>
              <div className="detail-row">
                <strong>Behavior Type:</strong> {renderBehaviorTypeBadge(selectedRecord.behaviorType)}
              </div>
              <div className="detail-row">
                <strong>Category:</strong> {selectedRecord.category}
              </div>
              <div className="detail-row">
                <strong>Description:</strong>
                <p>{selectedRecord.description}</p>
              </div>
              {selectedRecord.actionTaken && (
                <div className="detail-row">
                  <strong>Action Taken:</strong>
                  <p>{selectedRecord.actionTaken}</p>
                </div>
              )}
              <div className="detail-row">
                <strong>Follow-up Required:</strong> {selectedRecord.followUpNeeded ? 'Yes' : 'No'}
              </div>
              {selectedRecord.followUpNeeded && selectedRecord.followUpNotes && (
                <div className="detail-row">
                  <strong>Follow-up Notes:</strong>
                  <p>{selectedRecord.followUpNotes}</p>
                </div>
              )}
              <div className="detail-row">
                <strong>Parent Notified:</strong> {selectedRecord.parentNotified ? 'Yes' : 'No'}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleEdit(selectedRecord)} className="btn btn-primary">
                Edit Record
              </button>
              <button onClick={() => setShowDetails(false)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BehaviorRecordList; 