import React, { useState } from 'react';
import StudyMaterialList from '../../components/teacher-tools/differentiated-materials/StudyMaterialList';
import StudyMaterialForm from '../../components/teacher-tools/differentiated-materials/StudyMaterialForm';
import './DifferentiatedMaterials.css';

const DifferentiatedMaterialsPage = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);

  const handleCreateMaterial = () => {
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
    <div className="differentiated-materials-page">
      <h1>Differentiated Study Material Creator</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'list' ? 'active' : ''}`} 
          onClick={() => {
            setActiveTab('list');
            setShowForm(false);
          }}
        >
          View Materials
        </button>
        <button 
          className={`tab ${activeTab === 'create' ? 'active' : ''}`} 
          onClick={handleCreateMaterial}
        >
          Create Material
        </button>
      </div>
      
      <div className="feature-description">
        <p>
          Create differentiated learning materials tailored to different student ability levels. 
          This tool allows you to manage study materials and automatically generate versions
          adapted for basic, intermediate, and advanced learners.
        </p>
      </div>
      
      <div className="tab-content">
        {activeTab === 'list' && !showForm ? (
          <StudyMaterialList onCreateClick={handleCreateMaterial} />
        ) : (
          <StudyMaterialForm 
            onSuccess={handleFormSuccess} 
            onCancel={handleFormCancel} 
          />
        )}
      </div>
    </div>
  );
};

export default DifferentiatedMaterialsPage; 