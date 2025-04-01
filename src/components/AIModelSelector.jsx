import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAIModel } from '../store/gameSlice';

const AIModelSelector = () => {
  const dispatch = useDispatch();
  const [apiKeyStatus, setApiKeyStatus] = useState(false);

  useEffect(() => {
    // Check for API key in both environment variables and localStorage
    const checkApiKey = () => {
      setApiKeyStatus(!!(import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key')));
    };

    checkApiKey();
  }, []);

  const handleApiKeyChange = (e) => {
    const key = e.target.value;
    localStorage.setItem('gemini_api_key', key);
    setApiKeyStatus(!!key);
  };

  return (
    <div className="ai-model-selector">
      <h3>AI Settings</h3>
      <div className="api-key-input">
        <label htmlFor="apiKey">
          Gemini API Key: {apiKeyStatus ? '✓' : '✗'}
        </label>
        <input
          type="password"
          id="apiKey"
          placeholder="Enter Gemini API key"
          onChange={handleApiKeyChange}
          value={localStorage.getItem('gemini_api_key') || ''}
        />
        <small className="api-key-note">
          You can also set the API key in the .env file for better security
        </small>
      </div>
    </div>
  );
};

export default AIModelSelector; 