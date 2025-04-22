import React, { useState, useEffect } from 'react';
import { 
  getAllCurriculum, 
  checkAlignment, 
  searchCurriculum 
} from '../../../services/teacher-tools/curriculumService';

const CurriculumAlignmentChecker = () => {
  const [curricula, setCurricula] = useState([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState('');
  const [content, setContent] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    subject: '',
    gradeLevel: '',
    keywords: '',
    standardId: ''
  });
  const [filterVisible, setFilterVisible] = useState(false);

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

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCurriculumSelect = (e) => {
    setSelectedCurriculum(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCurriculum || !content) {
      setError('Please select a curriculum standard and enter content to check');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const results = await checkAlignment(selectedCurriculum, content);
      setResults(results);
      setLoading(false);
    } catch (err) {
      setError('Failed to check alignment');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCurriculum('');
    setContent('');
    setResults(null);
    setError('');
  };

  return (
    <div className="curriculum-alignment-checker">
      <h2>Curriculum Alignment Checker</h2>
      <p>Check how well your teaching materials align with curriculum standards.</p>

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

      <form onSubmit={handleSubmit} className="alignment-form">
        <div className="form-group">
          <label htmlFor="curriculum">Select Curriculum Standard:</label>
          <select
            id="curriculum"
            value={selectedCurriculum}
            onChange={handleCurriculumSelect}
            required
          >
            <option value="">-- Select a Standard --</option>
            {curricula.map(curr => (
              <option key={curr._id} value={curr._id}>
                {curr.standardId}: {curr.subject} ({curr.gradeLevel})
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Enter Content to Check:</label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            placeholder="Paste your lesson plan, assignment, or other teaching material here..."
            rows={10}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-check-alignment" disabled={loading}>
            {loading ? 'Checking...' : 'Check Alignment'}
          </button>
          <button type="button" className="btn-reset" onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {results && (
        <div className="alignment-results">
          <h3>Alignment Results</h3>
          
          <div className="alignment-score">
            <div className="score-label">Alignment Score:</div>
            <div className="score-value">
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${results.alignmentScore}%` }}
                />
              </div>
              <span>{results.alignmentScore}%</span>
            </div>
          </div>
          
          <div className="matched-keywords">
            <h4>Matched Keywords:</h4>
            {results.matchedKeywords.length > 0 ? (
              <ul>
                {results.matchedKeywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            ) : (
              <p>No keywords matched.</p>
            )}
          </div>
          
          <div className="suggestions">
            <h4>Suggestions:</h4>
            <ul>
              {results.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
          
          <div className="curriculum-details">
            <h4>Curriculum Standard Details:</h4>
            <p><strong>ID:</strong> {results.curriculum.standardId}</p>
            <p><strong>Subject:</strong> {results.curriculum.subject}</p>
            <p><strong>Grade Level:</strong> {results.curriculum.gradeLevel}</p>
            <p><strong>Description:</strong> {results.curriculum.description}</p>
            <div>
              <strong>Objectives:</strong>
              <ul>
                {results.curriculum.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurriculumAlignmentChecker; 