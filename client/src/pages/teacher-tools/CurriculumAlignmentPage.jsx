import React, { useState } from 'react';
import CurriculumAlignmentChecker from '../../components/teacher-tools/curriculum-alignment/CurriculumAlignmentChecker';
import CurriculumList from '../../components/teacher-tools/curriculum-alignment/CurriculumList';

const CurriculumAlignmentPage = () => {
  const [activeTab, setActiveTab] = useState('checker');

  return (
    <div className="curriculum-alignment-page">
      <h1>Curriculum Alignment Tools</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'checker' ? 'active' : ''}`} 
          onClick={() => setActiveTab('checker')}
        >
          Alignment Checker
        </button>
        <button 
          className={`tab ${activeTab === 'standards' ? 'active' : ''}`} 
          onClick={() => setActiveTab('standards')}
        >
          Manage Standards
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'checker' ? (
          <CurriculumAlignmentChecker />
        ) : (
          <CurriculumList />
        )}
      </div>
    </div>
  );
};

export default CurriculumAlignmentPage; 