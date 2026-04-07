import React from 'react';
import { View, Text, FlatList, Pressable, Switch } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/appStyles';
import { THEMES } from '../theme/themes';

const SettingsScreen = ({ theme, themeName, setThemeName, settings, setSettings }) => {
  const insets = useSafeAreaInsets();

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
        contentContainerStyle={[
          styles.settingsList,
          {
            paddingBottom: Math.max(24, insets.bottom + 16),
            paddingLeft: Math.max(16, insets.left + 12),
            paddingRight: Math.max(16, insets.right + 12),
          },
        ]}
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

export default SettingsScreen;
