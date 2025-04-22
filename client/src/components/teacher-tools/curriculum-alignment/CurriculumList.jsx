import React, { useState, useEffect } from 'react';
import { 
  getAllCurriculum, 
  deleteCurriculum,
  searchCurriculum
} from '../../../services/teacher-tools/curriculumService';
import CurriculumForm from './CurriculumForm';

const CurriculumList = () => {
  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editCurriculumId, setEditCurriculumId] = useState(null);
  const [searchParams, setSearchParams] = useState({
    subject: '',
    gradeLevel: '',
    keywords: '',
    standardId: ''
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchCurricula();
  }, []);

  const fetchCurricula = async () => {
    try {
      setLoading(true);
      const data = await getAllCurriculum();
      setCurricula(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch curriculum standards');
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
      const data = await searchCurriculum(searchParams);
      setCurricula(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to search curriculum standards');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this curriculum standard?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteCurriculum(id);
      setCurricula(curricula.filter(curr => curr._id !== id));
      setLoading(false);
    } catch (err) {
      setError('Failed to delete curriculum standard');
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditCurriculumId(id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    fetchCurricula();
    setShowForm(false);
    setEditCurriculumId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditCurriculumId(null);
  };

  const handleViewDetails = (curriculum) => {
    setSelectedCurriculum(curriculum);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedCurriculum(null);
  };

  return (
    <div className="curriculum-list">
      <div className="list-header">
        <h2>Curriculum Standards</h2>
        <button 
          className="btn-add-curriculum" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Add New Curriculum Standard
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
              <label htmlFor="keywords">Keywords:</label>
              <input
                type="text"
                id="keywords"
                name="keywords"
                value={searchParams.keywords}
                onChange={handleSearchParamsChange}
                placeholder="E.g. fractions, photosynthesis"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="standardId">Standard ID:</label>
              <input
                type="text"
                id="standardId"
                name="standardId"
                value={searchParams.standardId}
                onChange={handleSearchParamsChange}
                placeholder="E.g. MATH.5.NBT.1"
              />
            </div>
            
            <button type="submit" className="btn-search" disabled={loading}>
              Search
            </button>
            <button 
              type="button" 
              className="btn-reset" 
              onClick={() => {
                setSearchParams({
                  subject: '',
                  gradeLevel: '',
                  keywords: '',
                  standardId: ''
                });
                fetchCurricula();
              }}
            >
              Reset
            </button>
          </form>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <CurriculumForm 
          curriculumId={editCurriculumId} 
          onSuccess={handleFormSuccess} 
          onCancel={handleFormCancel} 
        />
      ) : (
        <>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : curricula.length === 0 ? (
            <div className="no-results">No curriculum standards found.</div>
          ) : (
            <div className="curriculum-table">
              <table>
                <thead>
                  <tr>
                    <th>Standard ID</th>
                    <th>Subject</th>
                    <th>Grade Level</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {curricula.map(curriculum => (
                    <tr key={curriculum._id}>
                      <td>{curriculum.standardId}</td>
                      <td>{curriculum.subject}</td>
                      <td>{curriculum.gradeLevel}</td>
                      <td className="actions">
                        <button 
                          className="btn-view" 
                          onClick={() => handleViewDetails(curriculum)}
                        >
                          View
                        </button>
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(curriculum._id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(curriculum._id)}
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

      {showDetails && selectedCurriculum && (
        <div className="curriculum-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Curriculum Standard Details</h3>
              <button className="close-button" onClick={closeDetails}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Standard ID:</strong> {selectedCurriculum.standardId}</p>
              <p><strong>Subject:</strong> {selectedCurriculum.subject}</p>
              <p><strong>Grade Level:</strong> {selectedCurriculum.gradeLevel}</p>
              <p><strong>Description:</strong> {selectedCurriculum.description}</p>
              
              <div className="objectives">
                <h4>Objectives:</h4>
                <ul>
                  {selectedCurriculum.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
              
              {selectedCurriculum.keywords && selectedCurriculum.keywords.length > 0 && (
                <div className="keywords">
                  <h4>Keywords:</h4>
                  <div className="keyword-tags">
                    {selectedCurriculum.keywords.map((keyword, index) => (
                      <span key={index} className="keyword-tag">{keyword}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-edit" onClick={() => {
                handleEdit(selectedCurriculum._id);
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
    </div>
  );
};

export default CurriculumList; 