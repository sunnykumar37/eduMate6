import React, { useState } from 'react';
import AssignmentList from '../../components/teacher-tools/assignment-generator/AssignmentList';
import AssignmentForm from '../../components/teacher-tools/assignment-generator/AssignmentForm';
import './AssignmentGenerator.css';

const AssignmentGeneratorPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);

  const handleCreateAssignment = () => {
    setShowForm(true);
    setActiveTab('create');
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setActiveTab('list');
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setActiveTab('list');
  };

  return (
    <div className="assignment-generator-page">
      <h1>Assignment & Rubric Generator</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`} 
          onClick={() => {
            setActiveTab('list');
            setShowForm(false);
          }}
        >
          View Assignments
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`} 
          onClick={handleCreateAssignment}
        >
          Create Assignment
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'list' && !showForm ? (
          <AssignmentList onCreateClick={handleCreateAssignment} />
        ) : (
          <AssignmentForm 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormCancel} 
          />
        )}
      </div>
    </div>
  );
};

export default AssignmentGeneratorPage; 