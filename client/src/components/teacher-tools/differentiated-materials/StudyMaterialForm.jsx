import React, { useState, useEffect } from 'react';
import { createStudyMaterial, updateStudyMaterial, getStudyMaterialById } from '../../../services/teacher-tools/studyMaterialService';
import { getAllCurriculum } from '../../../services/teacher-tools/curriculumService';

const StudyMaterialForm = ({ materialId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    gradeLevel: '',
    topic: '',
    learningLevel: 'intermediate',
    content: '',
    resources: [''],
    activities: [{
      title: '',
      description: '',
      difficultyLevel: 'medium'
    }],
    curriculumStandards: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [curricula, setCurricula] = useState([]);

  useEffect(() => {
    fetchCurricula();
    
    if (materialId) {
      setIsEditing(true);
      fetchMaterial(materialId);
    }
  }, [materialId]);

  const fetchCurricula = async () => {
    try {
      const data = await getAllCurriculum();
      setCurricula(data);
    } catch (err) {
      setError('Failed to fetch curriculum standards');
    }
  };

  const fetchMaterial = async (id) => {
    try {
      setLoading(true);
      const data = await getStudyMaterialById(id);
      
      // Ensure resources and activities are in the right format
      if (!data.resources) {
        data.resources = [''];
      }
      
      if (!data.activities || data.activities.length === 0) {
        data.activities = [{
          title: '',
          description: '',
          difficultyLevel: 'medium'
        }];
      }
      
      // Ensure curriculum standards are in the right format
      if (data.curriculumStandards) {
        data.curriculumStandards = data.curriculumStandards.map(
          std => typeof std === 'object' ? std._id : std
        );
      }
      
      setFormData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch study material');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResourceChange = (index, value) => {
    const updatedResources = [...formData.resources];
    updatedResources[index] = value;
    setFormData(prev => ({
      ...prev,
      resources: updatedResources
    }));
  };

  const handleAddResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, '']
    }));
  };

  const handleRemoveResource = (index) => {
    if (formData.resources.length === 1) return;
    const updatedResources = formData.resources.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      resources: updatedResources
    }));
  };

  const handleActivityChange = (index, field, value) => {
    const updatedActivities = [...formData.activities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      activities: updatedActivities
    }));
  };

  const handleAddActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, {
        title: '',
        description: '',
        difficultyLevel: 'medium'
      }]
    }));
  };

  const handleRemoveActivity = (index) => {
    if (formData.activities.length === 1) return;
    const updatedActivities = formData.activities.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      activities: updatedActivities
    }));
  };

  const handleCurriculumStandardsChange = (e) => {
    // Get selected options from multi-select
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      curriculumStandards: selectedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Filter out empty resources
    const filteredResources = formData.resources.filter(r => r.trim());
    
    // Validate activities
    const validActivities = formData.activities.filter(
      a => a.title.trim() && a.description.trim()
    );
    
    if (validActivities.length === 0) {
      setError('At least one activity with title and description is required');
      setLoading(false);
      return;
    }
    
    const submissionData = {
      ...formData,
      resources: filteredResources,
      activities: validActivities
    };
    
    try {
      if (isEditing) {
        await updateStudyMaterial(materialId, submissionData);
      } else {
        await createStudyMaterial(submissionData);
      }
      
      setLoading(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} study material`);
      setLoading(false);
    }
  };

  return (
    <div className="study-material-form">
      <h2>{isEditing ? 'Edit Study Material' : 'Create Study Material'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title*:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Material title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="topic">Topic*:</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              placeholder="E.g. Photosynthesis, Linear Equations"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject">Subject*:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="E.g. Mathematics, Science"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gradeLevel">Grade Level*:</label>
            <input
              type="text"
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              placeholder="E.g. Grade 5, High School"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="learningLevel">Learning Level*:</label>
            <select
              id="learningLevel"
              name="learningLevel"
              value={formData.learningLevel}
              onChange={handleChange}
              required
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content*:</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="The main content of the study material"
            rows={10}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Resources:</label>
          {formData.resources.map((resource, index) => (
            <div key={index} className="resource-input">
              <input
                type="text"
                value={resource}
                onChange={(e) => handleResourceChange(index, e.target.value)}
                placeholder="URL or description of resource"
              />
              <button 
                type="button" 
                className="btn-remove-resource"
                onClick={() => handleRemoveResource(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button" 
            className="btn-add-resource"
            onClick={handleAddResource}
          >
            Add Resource
          </button>
        </div>
        
        <div className="form-group">
          <label>Activities*:</label>
          {formData.activities.map((activity, index) => (
            <div key={index} className="activity-card">
              <div className="activity-header">
                <h4>Activity {index + 1}</h4>
                <button 
                  type="button" 
                  className="btn-remove-activity"
                  onClick={() => handleRemoveActivity(index)}
                >
                  Remove
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor={`activity-title-${index}`}>Title*:</label>
                  <input
                    type="text"
                    id={`activity-title-${index}`}
                    value={activity.title}
                    onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
                    placeholder="Activity title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor={`activity-difficulty-${index}`}>Difficulty Level:</label>
                  <select
                    id={`activity-difficulty-${index}`}
                    value={activity.difficultyLevel}
                    onChange={(e) => handleActivityChange(index, 'difficultyLevel', e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor={`activity-description-${index}`}>Description*:</label>
                <textarea
                  id={`activity-description-${index}`}
                  value={activity.description}
                  onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
                  placeholder="Activity description and instructions"
                  rows={3}
                  required
                />
              </div>
            </div>
          ))}
          
          <button 
            type="button" 
            className="btn-add-activity"
            onClick={handleAddActivity}
          >
            Add Activity
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="curriculumStandards">Curriculum Standards:</label>
          <select
            id="curriculumStandards"
            name="curriculumStandards"
            multiple
            value={formData.curriculumStandards}
            onChange={handleCurriculumStandardsChange}
            size={5}
          >
            {curricula.map(curr => (
              <option key={curr._id} value={curr._id}>
                {curr.standardId}: {curr.subject} ({curr.gradeLevel})
              </option>
            ))}
          </select>
          <small>Hold Ctrl or Cmd to select multiple standards</small>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyMaterialForm; 