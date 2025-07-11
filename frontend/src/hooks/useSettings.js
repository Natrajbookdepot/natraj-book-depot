import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    axios
      .get('/api/settings')
      .then(res => setSettings(res.data))
      .catch(err => {
        console.error('Failed to load settings:', err);
      });
  }, []);
console.log("Footer settings:", settings);
  
  return settings;
}
