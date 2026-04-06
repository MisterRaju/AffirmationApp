import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeaderActions from '../components/HeaderActions';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { getNavigationTheme } from '../theme/navigationTheme';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ theme, favorites, toggleFavorite, themeName, setThemeName, settings, setSettings }) => {
  const navTheme = useMemo(() => getNavigationTheme(theme), [theme]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.header, height: 92 },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: { fontWeight: '800', fontSize: 24 },
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            title: 'Affir',
            // React Navigation headerRight expects a function returning a node.
            // eslint-disable-next-line react/no-unstable-nested-components
            headerRight: () => <HeaderActions navigation={navigation} theme={theme} />,
          })}
        >
          {props => (
            <HomeScreen
              {...props}
              theme={theme}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Favorites" options={{ title: 'Favorites' }}>
          {props => (
            <FavoritesScreen
              {...props}
              theme={theme}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Settings" options={{ title: 'Settings' }}>
          {props => (
            <SettingsScreen
              {...props}
              theme={theme}
              themeName={themeName}
              setThemeName={setThemeName}
              settings={settings}
              setSettings={setSettings}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
