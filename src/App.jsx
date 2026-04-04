import React, { useEffect, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './navigation/AppNavigator';
import { SETTINGS_DEFAULTS } from './constants/settings';
import { THEMES } from './theme/themes';

const App = () => {
  const [themeName, setThemeName] = useState('peach');
  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState(SETTINGS_DEFAULTS);

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  const theme = THEMES[themeName] || THEMES.peach;

  const toggleFavorite = text => {
    setFavorites(prev =>
      prev.includes(text) ? prev.filter(item => item !== text) : [...prev, text],
    );
  };

  return (
    <AppNavigator
      theme={theme}
      favorites={favorites}
      toggleFavorite={toggleFavorite}
      themeName={themeName}
      setThemeName={setThemeName}
      settings={settings}
      setSettings={setSettings}
    />
  );
};

export default App;
