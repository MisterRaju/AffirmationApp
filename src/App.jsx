import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
// import BootSplash from 'react-native-bootsplash';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './navigation/AppNavigator';
import { SETTINGS_DEFAULTS, SETTINGS_STORAGE_KEY } from './constants/settings';
import { THEMES } from './theme/themes';
import { disableHourlyReminder, enableHourlyReminder } from './utils/reminders';
import { storage } from './utils/storage';
import styles from './styles/appStyles';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const App = () => {
  const [themeName, setThemeName] = useState('peach');
  const [favorites, setFavorites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [settings, setSettings] = useState(SETTINGS_DEFAULTS);
  const [isSettingsHydrated, setIsSettingsHydrated] = useState(false);
  const previousDailyReminderRef = useRef(false);

  useEffect(() => {
    try {
      const rawSettings = storage.getString(SETTINGS_STORAGE_KEY);

      if (rawSettings) {
        const parsedSettings = JSON.parse(rawSettings);
        const nextSettings = {
          ...SETTINGS_DEFAULTS,
          ...parsedSettings,
        };

        setSettings(nextSettings);
        previousDailyReminderRef.current = Boolean(nextSettings.dailyReminder);
      } else {
        previousDailyReminderRef.current = Boolean(SETTINGS_DEFAULTS.dailyReminder);
      }
    } catch {
      previousDailyReminderRef.current = Boolean(SETTINGS_DEFAULTS.dailyReminder);
    } finally {
      setIsSettingsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isSettingsHydrated) {
      return;
    }

    storage.set(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [isSettingsHydrated, settings]);
  
  useEffect(() => {
    if (!isSettingsHydrated) {
      return;
    }

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
  }, [isSettingsHydrated, settings.dailyReminder]);

  const theme = THEMES[themeName] || THEMES.peach;

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    SystemNavigationBar.setNavigationColor(theme.colors.background);
    SystemNavigationBar.setBarMode(theme.isDark ? 'light' : 'dark');
  }, [theme]);

  const toggleFavorite = text => {
    setFavorites(prev =>
      prev.includes(text)
        ? prev.filter(item => item !== text)
        : [...prev, text],
    );
  };

  return (
    <SafeAreaProvider>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
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
