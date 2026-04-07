import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
// import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { SETTINGS_DEFAULTS } from './constants/settings';
import { THEMES } from './theme/themes';
import { disableHourlyReminder, enableHourlyReminder } from './utils/reminders';
import styles from './styles/appStyles';

const App = () => {
  const [themeName, setThemeName] = useState('peach');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [settings, setSettings] = useState(SETTINGS_DEFAULTS);
  const previousDailyReminderRef = useRef(SETTINGS_DEFAULTS.dailyReminder);

  // useLayoutEffect(() => {
  //   BootSplash.hide({ fade: true }).catch(() => {});
  // }, []);

  useEffect(() => {
    const syncReminder = async () => {
      const wasEnabled = previousDailyReminderRef.current;
      const isEnabled = settings.dailyReminder;

      if (isEnabled) {
        await enableHourlyReminder({
          sendImmediate: !wasEnabled,
          requestPermission: !wasEnabled,
        });
      } else {
        await disableHourlyReminder();
      }

      previousDailyReminderRef.current = isEnabled;
    };

    syncReminder().catch(() => {});
  }, [settings.dailyReminder]);

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
