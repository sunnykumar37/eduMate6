import React, { useState } from 'react';
import BehaviorRecordList from '../../components/teacher-tools/behavior-tracker/BehaviorRecordList';
import BehaviorRecordForm from '../../components/teacher-tools/behavior-tracker/BehaviorRecordForm';
import StudentBehaviorSummary from '../../components/teacher-tools/behavior-tracker/StudentBehaviorSummary';
import './BehaviorTrackerPage.css';

const BehaviorTrackerPage = () => {
  const [activeTab, setActiveTab] = useState('records');
  const [showForm, setShowForm] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [studentNameForSummary, setStudentNameForSummary] = useState('');
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setRecordToEdit(null);
  };
  
  // Handle new record button click
  const handleNewRecord = () => {
    setShowForm(true);
    setRecordToEdit(null);
  };
  
  // Handle edit record
  const handleEditRecord = (record) => {
    setRecordToEdit(record);
    setShowForm(true);
  };
  
  // Handle form success
  const handleFormSuccess = () => {
    setShowForm(false);
    setRecordToEdit(null);
  };
  
  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setRecordToEdit(null);
  };
  
  // Handle view student summary
  const handleViewStudentSummary = () => {
    if (searchInput.trim()) {
      setStudentNameForSummary(searchInput);
      setShowSummary(true);
    }
  };
  
  // Handle close summary
  const handleCloseSummary = () => {
    setShowSummary(false);
    setStudentNameForSummary('');
  };
  
  return (
    <div className="behavior-tracker-page">
      <div className="page-header">
        <h1>Behavior Tracker</h1>
        <p>Track and manage student behavior patterns</p>
      </div>
      
      <div className="tracker-tabs">
        <button 
          className={`tab-button ${activeTab === 'records' ? 'active' : ''}`}
          onClick={() => handleTabChange('records')}
        >
          Behavior Records
        </button>
        <button 
          className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => handleTabChange('summary')}
        >
          Student Summary
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'records' && (
          <>
            {!showForm ? (
              <div className="action-bar">
                <button 
                  className="btn btn-primary"
                  onClick={handleNewRecord}
                >
                  New Behavior Record
                </button>
              </div>
            ) : null}
            
            {showForm ? (
              <BehaviorRecordForm 
                recordId={recordToEdit?.id} 
                onCancel={handleFormCancel}
                onSuccess={handleFormSuccess}
              />
            ) : (
              <BehaviorRecordList 
                onEdit={handleEditRecord}
                onFormSuccess={handleFormSuccess}
              />
            )}
          </>
        )}
        
        {activeTab === 'summary' && (
          <div className="summary-container">
            <div className="search-student">
              <input
                type="text"
                placeholder="Enter student name"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button 
                className="btn btn-primary"
                onClick={handleViewStudentSummary}
                disabled={!searchInput.trim()}
              >
                View Summary
              </button>
            </div>
            
            <div className="summary-info">
              <div className="info-card">
                <h3>What is the Student Behavior Summary?</h3>
                <p>
                  The Student Behavior Summary provides a comprehensive overview of a student's 
                  behavior patterns over time. It includes:
                </p>
                <ul>
                  <li>Distribution of positive, concerning, and neutral behaviors</li>
                  <li>Breakdown of behavior categories</li>
                  <li>Recent behavior incidents and follow-ups</li>
                </ul>
                <p>
                  Use this feature to identify patterns, monitor progress, and inform 
                  parent-teacher conferences or intervention planning.
                </p>
              </div>
            </div>
            
            {showSummary && (
              <StudentBehaviorSummary 
                studentName={studentNameForSummary}
                onClose={handleCloseSummary}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BehaviorTrackerPage;