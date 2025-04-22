import React, { useState, useEffect } from 'react';
import { generateRubric } from '../../../services/teacher-tools/assignmentService';
import { getAllCurriculum } from '../../../services/teacher-tools/curriculumService';

const RubricGenerator = ({ assignmentData, onRubricGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rubric, setRubric] = useState([]);
  const [curricula, setCurricula] = useState([]);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const [formData, setFormData] = useState({
    title: assignmentData?.title || '',
    description: assignmentData?.description || '',
    pointsPossible: assignmentData?.pointsPossible || 100
  });

  useEffect(() => {
    if (assignmentData) {
      setFormData({
        title: assignmentData.title || '',
        description: assignmentData.description || '',
        pointsPossible: assignmentData.pointsPossible || 100
      });
      
      if (assignmentData.curriculumStandards) {
        setSelectedStandards(
          Array.isArray(assignmentData.curriculumStandards) 
            ? assignmentData.curriculumStandards.map(std => typeof std === 'object' ? std._id : std)
            : []
        );
      }
    }
    
    fetchCurricula();
  }, [assignmentData]);

  const fetchCurricula = async () => {
    try {
      const data = await getAllCurriculum();
      setCurricula(data);
    } catch (err) {
      setError('Failed to fetch curriculum standards');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pointsPossible' ? parseInt(value, 10) || 0 : value
    });
  };

  const handleStandardChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedStandards(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await generateRubric({
        ...formData,
        curriculumStandards: selectedStandards
      });
      
      setRubric(result);
      
      if (onRubricGenerated) {
        onRubricGenerated(result);
      }
    } catch (err) {
      setError('Failed to generate rubric');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rubric-generator">
      <h3>Generate Rubric</h3>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Assignment Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Assignment Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="pointsPossible">Total Points:</label>
          <input
            type="number"
            id="pointsPossible"
            name="pointsPossible"
            value={formData.pointsPossible}
            onChange={handleChange}
            min={1}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="curriculumStandards">Curriculum Standards (optional):</label>
          <select
            id="curriculumStandards"
            multiple
            size={5}
            value={selectedStandards}
            onChange={handleStandardChange}
          >
            {curricula.map(curr => (
              <option key={curr._id} value={curr._id}>
                {curr.standardId}: {curr.subject} ({curr.gradeLevel})
              </option>
            ))}
          </select>
          <small>Hold Ctrl or Cmd to select multiple standards</small>
        </div>
        
        <button type="submit" className="btn-generate" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Rubric'}
        </button>
      </form>
      
      {rubric.length > 0 && (
        <div className="generated-rubric">
          <h4>Generated Rubric</h4>
          <div className="rubric-table-container">
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
                {rubric.map((criteria, index) => (
                  <tr key={index}>
                    <td>{criteria.name}</td>
                    <td>{criteria.description}</td>
                    <td>{criteria.pointsPossible}</td>
                    <td>
                      <ul className="levels-list">
                        {criteria.levels.map((level, i) => (
                          <li key={i}>
                            <strong>{level.score}:</strong> {level.description}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RubricGenerator; 