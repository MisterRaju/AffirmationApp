import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import AppNavigator from './navigation/AppNavigator';
import { SETTINGS_DEFAULTS } from './constants/settings';
import { THEMES } from './theme/themes';
import styles from './styles/appStyles';

const App = () => {
  const [themeName, setThemeName] = useState('peach');
  const [favorites, setFavorites] = useState([]);
  const [settings, setSettings] = useState(SETTINGS_DEFAULTS);

  useLayoutEffect(() => {
    BootSplash.hide({ fade: true }).catch(() => {});
  }, []);

  const theme = THEMES[themeName] || THEMES.peach;

  const toggleFavorite = text => {
    setFavorites(prev =>
      prev.includes(text) ? prev.filter(item => item !== text) : [...prev, text],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AppNavigator
        theme={theme}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        themeName={themeName}
        setThemeName={setThemeName}
        settings={settings}
        setSettings={setSettings}
      />
    </View>
  );
};

export default App;
