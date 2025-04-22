import React, { useState } from 'react';
import { addProgressNote } from '../../../services/teacher-tools/remediationPlanService';

const ProgressTracker = ({ plan, onProgressUpdate }) => {
  const [noteData, setNoteData] = useState({
    content: '',
    progressIndicator: 'some_progress'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoteData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!noteData.content.trim()) {
      setError('Note content is required');
      setLoading(false);
      return;
    }
    
    try {
      const updatedPlan = await addProgressNote(plan._id, noteData);
      setLoading(false);
      setNoteData({
        content: '',
        progressIndicator: 'some_progress'
      });
      
      if (onProgressUpdate) {
        onProgressUpdate(updatedPlan);
      }
    } catch (err) {
      setError('Failed to add progress note');
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'not_started': return 'Not Started';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getProgressIndicatorLabel = (indicator) => {
    switch (indicator) {
      case 'significant_progress': return 'Significant Progress';
      case 'some_progress': return 'Some Progress';
      case 'little_progress': return 'Little Progress';
      case 'no_progress': return 'No Progress';
      default: return indicator;
    }
  };

  const getProgressIndicatorClass = (indicator) => {
    switch (indicator) {
      case 'significant_progress': return 'progress-significant';
      case 'some_progress': return 'progress-some';
      case 'little_progress': return 'progress-little';
      case 'no_progress': return 'progress-none';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="progress-tracker">
      <h3>Progress Tracking</h3>
      
      <div className="plan-status">
        <div className="status-info">
          <div className="status-item">
            <span className="status-label">Current Status:</span>
            <span className={`status-value status-${plan.progress.status}`}>
              {getStatusLabel(plan.progress.status)}
            </span>
          </div>
          
          <div className="status-item">
            <span className="status-label">Start Date:</span>
            <span className="status-value">{formatDate(plan.startDate)}</span>
          </div>
          
          {plan.endDate && (
            <div className="status-item">
              <span className="status-label">End Date:</span>
              <span className="status-value">{formatDate(plan.endDate)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="progress-notes-section">
        <h4>Progress Notes</h4>
        
        {plan.progress.notes && plan.progress.notes.length > 0 ? (
          <div className="progress-notes">
            {plan.progress.notes.map((note, index) => (
              <div key={index} className="progress-note">
                <div className="note-header">
                  <span className="note-date">{formatDate(note.date)}</span>
                  <span className={`note-indicator ${getProgressIndicatorClass(note.progressIndicator)}`}>
                    {getProgressIndicatorLabel(note.progressIndicator)}
                  </span>
                </div>
                <div className="note-content">{note.content}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-notes">No progress notes available yet.</div>
        )}
      </div>
      
      <div className="add-note-section">
        <h4>Add Progress Note</h4>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="progressIndicator">Progress Indicator*:</label>
            <select
              id="progressIndicator"
              name="progressIndicator"
              value={noteData.progressIndicator}
              onChange={handleChange}
              required
            >
              <option value="significant_progress">Significant Progress</option>
              <option value="some_progress">Some Progress</option>
              <option value="little_progress">Little Progress</option>
              <option value="no_progress">No Progress</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="content">Note Content*:</label>
            <textarea
              id="content"
              name="content"
              value={noteData.content}
              onChange={handleChange}
              placeholder="Describe current progress, observations, and next steps..."
              rows={4}
              required
            />
          </div>
          
          <button type="submit" className="btn-add-note" disabled={loading}>
            {loading ? 'Adding...' : 'Add Note'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProgressTracker; 