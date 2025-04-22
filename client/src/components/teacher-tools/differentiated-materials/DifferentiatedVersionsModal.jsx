import React, { useState } from 'react';
import { createStudyMaterial } from '../../../services/teacher-tools/studyMaterialService';

const DifferentiatedVersionsModal = ({ versions, onClose, onSave }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('basic');
  
  // Function to handle saving a version as a new material
  const handleSaveVersion = async (version) => {
    try {
      setSaving(true);
      setError('');
      
      // Create a new study material with this version
      await createStudyMaterial(version);
      
      setSaving(false);
      if (onSave) {
        onSave();
      }
      onClose();
    } catch (err) {
      setError('Failed to save differentiated version');
      setSaving(false);
    }
  };
  
  // Helper function to get the current version being viewed
  const getCurrentVersion = () => {
    switch (activeTab) {
      case 'basic': return versions.basic;
      case 'advanced': return versions.advanced;
      default: return versions.original;
    }
  };
  
  return (
    <div className="differentiated-versions-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Differentiated Study Materials</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-tabs">
          <button 
            className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Version
          </button>
          <button 
            className={`tab ${activeTab === 'original' ? 'active' : ''}`}
            onClick={() => setActiveTab('original')}
          >
            Original Version
          </button>
          <button 
            className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced Version
          </button>
        </div>
        
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          <div className="version-details">
            <h4>{getCurrentVersion().title}</h4>
            <div className="version-meta">
              <p><strong>Subject:</strong> {getCurrentVersion().subject}</p>
              <p><strong>Grade Level:</strong> {getCurrentVersion().gradeLevel}</p>
              <p><strong>Topic:</strong> {getCurrentVersion().topic}</p>
              <p><strong>Learning Level:</strong> {getCurrentVersion().learningLevel}</p>
            </div>
            
            <div className="version-content">
              <h5>Content:</h5>
              <div className="content-box">
                {getCurrentVersion().content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
            
            {getCurrentVersion().resources && getCurrentVersion().resources.length > 0 && (
              <div className="version-resources">
                <h5>Resources:</h5>
                <ul>
                  {getCurrentVersion().resources.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {getCurrentVersion().activities && getCurrentVersion().activities.length > 0 && (
              <div className="version-activities">
                <h5>Activities:</h5>
                {getCurrentVersion().activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <h6>{activity.title} <span className="difficulty">{activity.difficultyLevel}</span></h6>
                    <p>{activity.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn-save-version" 
            onClick={() => handleSaveVersion(getCurrentVersion())}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save as New Material'}
          </button>
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DifferentiatedVersionsModal; 