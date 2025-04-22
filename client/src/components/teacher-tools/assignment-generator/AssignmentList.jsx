import React, { useState, useEffect } from 'react';
import { 
  getAllAssignments, 
  deleteAssignment,
  searchAssignments
} from '../../../services/teacher-tools/assignmentService';
import AssignmentForm from './AssignmentForm';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editAssignmentId, setEditAssignmentId] = useState(null);
  const [searchParams, setSearchParams] = useState({
    title: '',
    subject: '',
    gradeLevel: ''
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await getAllAssignments();
      setAssignments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch assignments');
      setAssignments([]);
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
      const data = await searchAssignments(searchParams);
      setAssignments(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to search assignments');
      setAssignments([]);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteAssignment(id);
      setAssignments(assignments.filter(assignment => assignment._id !== id));
      setLoading(false);
    } catch (err) {
      setError('Failed to delete assignment');
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    setEditAssignmentId(id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    fetchAssignments();
    setShowForm(false);
    setEditAssignmentId(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditAssignmentId(null);
  };

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedAssignment(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="assignment-list">
      <div className="list-header">
        <h2>Assignments</h2>
        <button 
          className="btn-add-assignment" 
          onClick={() => setShowForm(true)}
          disabled={showForm}
        >
          Create New Assignment
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
                  gradeLevel: ''
                });
                fetchAssignments();
              }}
            >
              Reset
            </button>
          </form>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <AssignmentForm 
          assignmentId={editAssignmentId} 
          onSuccess={handleFormSuccess} 
          onCancel={handleFormCancel} 
        />
      ) : (
        <>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : assignments.length === 0 ? (
            <div className="no-results">No assignments found.</div>
          ) : (
            <div className="assignment-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Grade Level</th>
                    <th>Due Date</th>
                    <th>Points</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(assignment => (
                    <tr key={assignment._id}>
                      <td>{assignment.title}</td>
                      <td>{assignment.subject}</td>
                      <td>{assignment.gradeLevel}</td>
                      <td>{formatDate(assignment.dueDate)}</td>
                      <td>{assignment.pointsPossible}</td>
                      <td className="actions">
                        <button 
                          className="btn-view" 
                          onClick={() => handleViewDetails(assignment)}
                        >
                          View
                        </button>
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEdit(assignment._id)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(assignment._id)}
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

      {showDetails && selectedAssignment && (
        <div className="assignment-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Assignment Details</h3>
              <button className="close-button" onClick={closeDetails}>×</button>
            </div>
            <div className="modal-body">
              <h4>{selectedAssignment.title}</h4>
              <div className="assignment-meta">
                <p><strong>Subject:</strong> {selectedAssignment.subject}</p>
                <p><strong>Grade Level:</strong> {selectedAssignment.gradeLevel}</p>
                <p><strong>Due Date:</strong> {formatDate(selectedAssignment.dueDate)}</p>
                <p><strong>Points Possible:</strong> {selectedAssignment.pointsPossible}</p>
              </div>
              
              <div className="assignment-description">
                <h5>Description:</h5>
                <p>{selectedAssignment.description}</p>
              </div>
              
              <div className="assignment-instructions">
                <h5>Instructions:</h5>
                <p>{selectedAssignment.instructions}</p>
              </div>
              
              {selectedAssignment.curriculumStandards && selectedAssignment.curriculumStandards.length > 0 && (
                <div className="curriculum-standards">
                  <h5>Curriculum Standards:</h5>
                  <ul>
                    {selectedAssignment.curriculumStandards.map((standard, index) => (
                      <li key={index}>
                        {typeof standard === 'object' ? 
                          `${standard.standardId}: ${standard.subject} (${standard.gradeLevel})` : 
                          standard}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedAssignment.rubric && selectedAssignment.rubric.length > 0 && (
                <div className="assignment-rubric">
                  <h5>Rubric:</h5>
                  <table className="rubric-table">
                    <thead>
                      <tr>
                        <th>Criteria</th>
                        <th>Description</th>
                        <th>Points</th>
                        <th>Levels</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAssignment.rubric.map((criteria, index) => (
                        <tr key={index}>
                          <td>{criteria.name}</td>
                          <td>{criteria.description}</td>
                          <td>{criteria.pointsPossible}</td>
                          <td>
                            {criteria.levels && (
                              <ul className="levels-list">
                                {criteria.levels.map((level, i) => (
                                  <li key={i}>
                                    <strong>{level.score}:</strong> {level.description}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-edit" onClick={() => {
                handleEdit(selectedAssignment._id);
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

export default AssignmentList; 