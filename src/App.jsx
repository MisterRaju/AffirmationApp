import React, { useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { SETTINGS_DEFAULTS } from './constants/settings';
import { THEMES } from './theme/themes';
import styles from './styles/appStyles';

const App = () => {
  const [themeName, setThemeName] = useState('peach');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
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
    <SafeAreaProvider>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <AppNavigator
          theme={theme}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          themeName={themeName}
          setThemeName={setThemeName}
          settings={settings}
          setSettings={setSettings}
        />
      </View>
    </SafeAreaProvider>
  );
};

export default App;
