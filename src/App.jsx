import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  Switch,
  TouchableOpacity,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import PagerView from 'react-native-pager-view';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const affirmations = require('./affirmations.json');
const Stack = createNativeStackNavigator();

const CATEGORIES = [
  { key: 'career', label: 'Career' },
  { key: 'student', label: 'Student' },
  { key: 'self-care', label: 'Self Care' },
  { key: 'breakup', label: 'Breakup' },
  { key: 'general', label: 'General' },
];

const THEMES = {
  peach: {
    key: 'peach',
    label: 'Peach Bliss',
    isDark: false,
    colors: {
      background: '#fff4ec',
      surface: '#ffe8da',
      card: '#fff6ef',
      border: '#f1b08f',
      textPrimary: '#5f3a2f',
      textSecondary: '#6f4a3b',
      accent: '#f49a6c',
      accentMuted: '#ffd8c1',
      overlay: 'rgba(108,66,50,0.35)',
      header: '#ffe8da',
    },
  },
  apricot: {
    key: 'apricot',
    label: 'Apricot Glow',
    isDark: false,
    colors: {
      background: '#fff8f1',
      surface: '#ffead5',
      card: '#fff4e8',
      border: '#efbf95',
      textPrimary: '#5a3b24',
      textSecondary: '#765136',
      accent: '#ea8d55',
      accentMuted: '#ffd9bb',
      overlay: 'rgba(118,81,54,0.3)',
      header: '#ffead5',
    },
  },
  coral: {
    key: 'coral',
    label: 'Soft Coral',
    isDark: false,
    colors: {
      background: '#fff5f3',
      surface: '#ffe2dc',
      card: '#fff1ed',
      border: '#efb3a5',
      textPrimary: '#5e3730',
      textSecondary: '#744a41',
      accent: '#e98270',
      accentMuted: '#ffd0c5',
      overlay: 'rgba(116,74,65,0.33)',
      header: '#ffe2dc',
    },
  },
};

const SETTINGS_DEFAULTS = {
  dailyReminder: true,
  calmAnimations: true,
  autoplayPager: false,
  hapticFeedback: true,
};

const HeaderActions = ({ navigation, theme }) => (
  <View style={styles.headerActions}>
    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
        pressed && { opacity: 0.75 },
      ]}
      onPress={() => navigation.navigate('Favorites')}
      accessibilityLabel="Open favorites"
    >
      <MaterialIcons name="favorite-border" size={20} color={theme.colors.textPrimary} />
    </Pressable>
    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        { borderColor: theme.colors.border, backgroundColor: theme.colors.card },
        pressed && { opacity: 0.75 },
      ]}
      onPress={() => navigation.navigate('Settings')}
      accessibilityLabel="Open settings"
    >
      <MaterialIcons name="settings" size={20} color={theme.colors.textPrimary} />
    </Pressable>
  </View>
);

const HomeScreen = ({ navigation, theme, favorites, toggleFavorite }) => {
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = key => {
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key],
    );
  };

  const filtered = affirmations.filter(a =>
    selectedCategories.length === 0
      ? true
      : a.categories && a.categories.some(c => selectedCategories.includes(c)),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.header}
      />

      <View style={styles.contentArea}>
        {filtered.length > 0 ? (
          <PagerView
            style={styles.pager}
            key={filtered.length}
            initialPage={0}
            orientation="vertical"
            onPageSelected={e => setIndex(e.nativeEvent.position)}
          >
            {filtered.map((a, i) => (
              <View key={i} style={styles.page}>
                <Text style={[styles.text, { color: theme.colors.textPrimary }]}>{a.text}</Text>
                <Pressable
                  onPress={() => toggleFavorite(a.text)}
                  style={({ pressed }) => [
                    styles.favoriteButton,
                    {
                      borderColor: favorites.includes(a.text)
                        ? theme.colors.accent
                        : theme.colors.border,
                      backgroundColor: favorites.includes(a.text)
                        ? theme.colors.accentMuted
                        : theme.colors.card,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                  accessibilityLabel="Toggle favorite"
                >
                  <View style={styles.iconLabelRow}>
                    <MaterialIcons
                      name={favorites.includes(a.text) ? 'favorite' : 'favorite-border'}
                      size={30}
                      color={theme.colors.textPrimary}
                    />
                    {/* <Text style={[styles.favoriteButtonText, { color: theme.colors.textPrimary }]}>
                      {favorites.includes(a.text) ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Text> */}
                  </View>
                </Pressable>
              </View>
            ))}
          </PagerView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>No affirmations found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>Try selecting fewer categories.</Text>
          </View>
        )}

      </View>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.accent }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Open categories"
      >
        <MaterialIcons name="tune" size={22} color={theme.colors.textPrimary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <Pressable
          style={[styles.modalOverlay, { backgroundColor: theme.colors.overlay }]}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={[styles.modalBox, { backgroundColor: theme.colors.surface }]} onPress={() => {}}>
            <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Select categories</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={item => item.key}
              numColumns={2}
              columnWrapperStyle={styles.catRow}
              renderItem={({ item }) => {
                const selected = selectedCategories.includes(item.key);
                return (
                  <Pressable
                    onPress={() => toggleCategory(item.key)}
                    style={({ pressed }) => [
                      styles.catItem,
                      {
                        borderColor: selected ? theme.colors.accent : theme.colors.border,
                        backgroundColor: selected ? theme.colors.accentMuted : theme.colors.card,
                      },
                      pressed && { opacity: 0.8 },
                    ]}
                  >
                    <Text style={[styles.catText, { color: theme.colors.textSecondary }, selected && styles.catTextSelected]}>
                      {item.label}
                    </Text>
                    {selected && <MaterialIcons name="check-circle" size={16} color={theme.colors.textPrimary} style={styles.check} />}
                  </Pressable>
                );
              }}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setSelectedCategories([])}
                style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.75 }]}
              >
                <View style={styles.iconLabelRow}>
                  <MaterialIcons name="refresh" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>Clear</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={({ pressed }) => [
                  styles.actionButton,
                  styles.applyButton,
                  { backgroundColor: theme.colors.accent },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={styles.iconLabelRow}>
                  <MaterialIcons name="done" size={16} color="#ffffff" />
                  <Text style={[styles.actionText, styles.applyText]}>Apply</Text>
                </View>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const FavoritesScreen = ({ theme, favorites, toggleFavorite }) => {
  const favoriteItems = affirmations.filter(item => favorites.includes(item.text));

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}> 
      <FlatList
        data={favoriteItems}
        keyExtractor={item => item.text}
        contentContainerStyle={styles.favoritesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>No favorites yet</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>Tap "Add to Favorites" on the home screen.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.favoriteCard,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text style={[styles.favoriteText, { color: theme.colors.textPrimary }]}>{item.text}</Text>
            <Pressable
              onPress={() => toggleFavorite(item.text)}
              style={({ pressed }) => [
                styles.removeFavoriteButton,
                { backgroundColor: theme.colors.accentMuted, borderColor: theme.colors.border },
                pressed && { opacity: 0.75 },
              ]}
            >
              <View style={styles.iconLabelRow}>
                <MaterialIcons name="delete-outline" size={16} color={theme.colors.textPrimary} />
                <Text style={[styles.removeFavoriteButtonText, { color: theme.colors.textPrimary }]}>Remove</Text>
              </View>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const SettingsScreen = ({ theme, themeName, setThemeName, settings, setSettings }) => {
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}> 
      <FlatList
        data={Object.values(THEMES)}
        keyExtractor={item => item.key}
        ListHeaderComponent={
          <View>
            <Text style={[styles.settingsSectionTitle, { color: theme.colors.textPrimary }]}>Appearance</Text>
            <Text style={[styles.settingsSectionSubtitle, { color: theme.colors.textSecondary }]}>Choose a theme that feels right for your day.</Text>
          </View>
        }
        contentContainerStyle={styles.settingsList}
        renderItem={({ item }) => {
          const active = item.key === themeName;
          return (
            <Pressable
              onPress={() => setThemeName(item.key)}
              style={({ pressed }) => [
                styles.themeOption,
                {
                  backgroundColor: active ? theme.colors.accentMuted : theme.colors.card,
                  borderColor: active ? theme.colors.accent : theme.colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View>
                <Text style={[styles.themeOptionTitle, { color: theme.colors.textPrimary }]}>{item.label}</Text>
                <Text style={[styles.themeOptionSubtitle, { color: theme.colors.textSecondary }]}>{active ? 'Currently active' : 'Tap to apply'}</Text>
              </View>
              <MaterialIcons
                name={active ? 'radio-button-checked' : 'radio-button-unchecked'}
                size={22}
                color={active ? theme.colors.accent : theme.colors.textSecondary}
              />
            </Pressable>
          );
        }}
        ListFooterComponent={
          <View>
            <Text style={[styles.settingsSectionTitle, { color: theme.colors.textPrimary }]}>Preferences</Text>
            <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Daily reminder</Text>
                <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>Receive one affirmation nudge each day.</Text>
              </View>
              <Switch
                value={settings.dailyReminder}
                onValueChange={value => updateSetting('dailyReminder', value)}
                thumbColor="#ffffff"
                trackColor={{ false: '#d6c0b5', true: theme.colors.accent }}
              />
            </View>
            <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Calm animations</Text>
                <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>Keep transitions smooth and slow.</Text>
              </View>
              <Switch
                value={settings.calmAnimations}
                onValueChange={value => updateSetting('calmAnimations', value)}
                thumbColor="#ffffff"
                trackColor={{ false: '#d6c0b5', true: theme.colors.accent }}
              />
            </View>
            <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Autoplay pager</Text>
                <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>Auto-scroll affirmations every few seconds.</Text>
              </View>
              <Switch
                value={settings.autoplayPager}
                onValueChange={value => updateSetting('autoplayPager', value)}
                thumbColor="#ffffff"
                trackColor={{ false: '#d6c0b5', true: theme.colors.accent }}
              />
            </View>
            <View style={[styles.settingRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.settingTextGroup}>
                <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Haptic feedback</Text>
                <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>Use subtle vibration on taps.</Text>
              </View>
              <Switch
                value={settings.hapticFeedback}
                onValueChange={value => updateSetting('hapticFeedback', value)}
                thumbColor="#ffffff"
                trackColor={{ false: '#d6c0b5', true: theme.colors.accent }}
              />
            </View>

            <Text style={[styles.settingsSectionTitle, { color: theme.colors.textPrimary }]}>About</Text>
            <View style={[styles.aboutCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.aboutText, { color: theme.colors.textSecondary }]}>Affir helps you stay grounded with quick daily affirmations.</Text>
            </View>
          </View>
        }
      />
    </View>
  );
};

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

  const navTheme = useMemo(
    () => ({
      dark: theme.isDark,
      colors: {
        primary: theme.colors.accent,
        background: theme.colors.background,
        card: theme.colors.header,
        text: theme.colors.textPrimary,
        border: theme.colors.border,
        notification: theme.colors.accent,
      },
      fonts: {
        regular: { fontFamily: 'System', fontWeight: '400' },
        medium: { fontFamily: 'System', fontWeight: '500' },
        bold: { fontFamily: 'System', fontWeight: '700' },
        heavy: { fontFamily: 'System', fontWeight: '800' },
      },
    }),
    [theme],
  );

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.header },
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            title: 'Affirmations',
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentArea: { flex: 1 },
  screenContainer: { flex: 1 },
  pager: { flex: 1 },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 34,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  favoriteButton: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffb48f',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBox: {
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  catRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  catItem: {
    flex: 1,
    minHeight: 72,
    marginHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  catText: { fontSize: 16, textAlign: 'center' },
  catTextSelected: { fontWeight: '700' },
  check: { fontSize: 14, position: 'absolute', top: 8, right: 10, fontWeight: '700' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: { paddingVertical: 8, paddingHorizontal: 12, marginLeft: 8 },
  applyButton: { borderRadius: 6 },
  actionText: { fontWeight: '600' },
  applyText: { color: '#ffffff' },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    borderWidth: 1,
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  favoritesList: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  favoriteText: {
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 12,
  },
  removeFavoriteButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeFavoriteButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },

  settingsList: {
    padding: 16,
    paddingBottom: 28,
  },
  settingsSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    marginTop: 4,
  },
  settingsSectionSubtitle: {
    fontSize: 14,
    marginBottom: 14,
  },
  themeOption: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  themeOptionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  settingRow: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingHint: {
    fontSize: 13,
    marginTop: 2,
  },
  aboutCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default App;
