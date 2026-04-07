import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HeaderActions from '../components/HeaderActions';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import { getNavigationTheme } from '../theme/navigationTheme';
import { responsiveFont } from '../utils/responsive';

const Stack = createNativeStackNavigator();

const AppNavigator = ({ theme, favorites, toggleFavorite, selectedCategories, setSelectedCategories, themeName, setThemeName, settings, setSettings }) => {
  const navTheme = useMemo(() => getNavigationTheme(theme), [theme]);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTintColor: theme.colors.textPrimary,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '800', fontSize: responsiveFont(24) },
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
              selectedCategories={selectedCategories}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Categories" options={{ title: 'Categories' }}>
          {props => (
            <CategoriesScreen
              {...props}
              theme={theme}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
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
