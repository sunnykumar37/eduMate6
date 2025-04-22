import React, { useState, useEffect } from 'react';
import { 
  getAllStudyMaterials, 
  deleteStudyMaterial,
  searchStudyMaterials,
  generateDifferentiatedVersions
} from '../../../services/teacher-tools/studyMaterialService';
import StudyMaterialForm from './StudyMaterialForm';
import DifferentiatedVersionsModal from './DifferentiatedVersionsModal';

const StudyMaterialList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMaterialId, setEditMaterialId] = useState(null);
  const [searchParams, setSearchParams] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    topic: '',
    learningLevel: ''
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDifferentiatedVersions, setShowDifferentiatedVersions] = useState(false);
  const [differentiatedVersions, setDifferentiatedVersions] = useState(null);
  const [generatingVersions, setGeneratingVersions] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await getAllStudyMaterials();
      setMaterials(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch study materials');
      setLoading(false);
    }
  };

  const handleSearchParamsChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await searchStudyMaterials(searchParams);
      setMaterials(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to search study materials');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this study material?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteStudyMaterial(id);
      setMaterials(materials.filter(material => material._id !== id));
      setLoading(false);
    } catch (err) {
      setError('Failed to delete study material');
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditMaterialId(id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    fetchMaterials();
    setShowForm(false);
    setEditMaterialId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditMaterialId(null);
  };

  const handleViewDetails = (material) => {
    setSelectedMaterial(material);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedMaterial(null);
  };

  const handleGenerateDifferentiatedVersions = async (materialId) => {
    try {
      setGeneratingVersions(true);
      const data = await generateDifferentiatedVersions(materialId);
      setDifferentiatedVersions(data);
      setShowDifferentiatedVersions(true);
      setGeneratingVersions(false);
    } catch (err) {
      setError('Failed to generate differentiated versions');
      setGeneratingVersions(false);
    }
  };

  const closeDifferentiatedVersions = () => {
    setShowDifferentiatedVersions(false);
    setDifferentiatedVersions(null);
  };

  const getLearningLevelLabel = (level) => {
    switch (level) {
      case 'basic': return 'Basic';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return level;
    }
  };

  return (
    <div className="study-material-list">
      <div className="list-header">
        <h2>Study Materials</h2>
        <button 
          className="btn-add-material" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Create New Material
        </button>
      </div>

      <div className="filter-section">
        <button 
          className="btn-toggle-filter" 
          onClick={() => setFilterVisible(!filterVisible)}
        >
          {filterVisible ? 'Hide Filters' : 'Show Filters'}
        </button>
        
        {filterVisible && (
          <form onSubmit={handleSearch} className="filter-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={searchParams.title}
                  onChange={handleSearchParamsChange}
                  placeholder="Search by title"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="topic">Topic:</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={searchParams.topic}
                  onChange={handleSearchParamsChange}
                  placeholder="Search by topic"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={searchParams.subject}
                  onChange={handleSearchParamsChange}
                  placeholder="E.g. Mathematics, Science"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="gradeLevel">Grade Level:</label>
                <input
                  type="text"
                  id="gradeLevel"
                  name="gradeLevel"
                  value={searchParams.gradeLevel}
                  onChange={handleSearchParamsChange}
                  placeholder="E.g. Grade 5, High School"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="learningLevel">Learning Level:</label>
                <select
                  id="learningLevel"
                  name="learningLevel"
                  value={searchParams.learningLevel}
                  onChange={handleSearchParamsChange}
                >
                  <option value="">All Levels</option>
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-search" disabled={loading}>
                Search
              </button>
              <button 
                type="button" 
                className="btn-reset" 
                onClick={() => {
                  setSearchParams({
                    title: '',
                    subject: '',
                    gradeLevel: '',
                    topic: '',
                    learningLevel: ''
                  });
                  fetchMaterials();
                }}
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <StudyMaterialForm 
          materialId={editMaterialId} 
          onSuccess={handleFormSuccess} 
          onCancel={handleFormCancel} 
        />
      ) : (
        <>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : materials.length === 0 ? (
            <div className="no-results">No study materials found.</div>
          ) : (
            <div className="material-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Grade Level</th>
                    <th>Topic</th>
                    <th>Learning Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(material => (
                    <tr key={material._id}>
                      <td>{material.title}</td>
                      <td>{material.subject}</td>
                      <td>{material.gradeLevel}</td>
                      <td>{material.topic}</td>
                      <td>{getLearningLevelLabel(material.learningLevel)}</td>
                      <td className="actions">
                        <button 
                          className="btn-view" 
                          onClick={() => handleViewDetails(material)}
                        >
                          View
                        </button>
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(material._id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-differentiate" 
                          onClick={() => handleGenerateDifferentiatedVersions(material._id)}
                          disabled={generatingVersions}
                        >
                          Differentiate
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(material._id)}
                        >
                          Delete
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

      {showDetails && selectedMaterial && (
        <div className="material-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Study Material Details</h3>
              <button className="close-button" onClick={closeDetails}>×</button>
            </div>
            <div className="modal-body">
              <h4>{selectedMaterial.title}</h4>
              <div className="material-meta">
                <p><strong>Subject:</strong> {selectedMaterial.subject}</p>
                <p><strong>Grade Level:</strong> {selectedMaterial.gradeLevel}</p>
                <p><strong>Topic:</strong> {selectedMaterial.topic}</p>
                <p><strong>Learning Level:</strong> {getLearningLevelLabel(selectedMaterial.learningLevel)}</p>
              </div>
              
              <div className="material-content">
                <h5>Content:</h5>
                <div className="content-box">
                  {selectedMaterial.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              
              {selectedMaterial.resources && selectedMaterial.resources.length > 0 && (
                <div className="material-resources">
                  <h5>Resources:</h5>
                  <ul>
                    {selectedMaterial.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedMaterial.activities && selectedMaterial.activities.length > 0 && (
                <div className="material-activities">
                  <h5>Activities:</h5>
                  {selectedMaterial.activities.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <h6>{activity.title} <span className="difficulty">{activity.difficultyLevel}</span></h6>
                      <p>{activity.description}</p>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedMaterial.curriculumStandards && selectedMaterial.curriculumStandards.length > 0 && (
                <div className="curriculum-standards">
                  <h5>Curriculum Standards:</h5>
                  <ul>
                    {selectedMaterial.curriculumStandards.map((standard, index) => (
                      <li key={index}>
                        {typeof standard === 'object' ? 
                          `${standard.standardId}: ${standard.subject} (${standard.gradeLevel})` : 
                          standard}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-differentiate" onClick={() => {
                handleGenerateDifferentiatedVersions(selectedMaterial._id);
                closeDetails();
              }}>
                Generate Differentiated Versions
              </button>
              <button className="btn-edit" onClick={() => {
                handleEdit(selectedMaterial._id);
                closeDetails();
              }}>
                Edit
              </button>
              <button className="btn-close" onClick={closeDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showDifferentiatedVersions && differentiatedVersions && (
        <DifferentiatedVersionsModal 
          versions={differentiatedVersions} 
          onClose={closeDifferentiatedVersions}
          onSave={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default StudyMaterialList; 