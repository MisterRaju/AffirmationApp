import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, Linking, Share, Modal, Switch } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/appStyles';
import { THEMES } from '../theme/themes';

const LICENSE_URL = 'https://opensource.org/license/mit/';
const TERMS_URL = 'https://example.com/terms';
const PRIVACY_URL = 'https://example.com/privacy';
const RATE_APP_URL = 'https://example.com/rate';
const APP_SHARE_URL = 'https://example.com/affir';

const SettingsScreen = ({ theme, themeName, setThemeName, settings, setSettings }) => {
  const insets = useSafeAreaInsets();
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const isReminderEnabled = Boolean(settings?.dailyReminder);

  const toggleDailyReminder = () => {
    setSettings(prev => ({
      ...prev,
      dailyReminder: !prev.dailyReminder,
    }));
  };

  const openExternalLink = async (url, label) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('Unavailable', `${label} is not available right now.`);
        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert('Unavailable', `${label} is not available right now.`);
    }
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: `Try Affir: ${APP_SHARE_URL}`,
      });
    } catch {
      Alert.alert('Could not share', 'Please try again.');
    }
  };

  const legalItems = [
    { key: 'license', label: 'License', icon: 'gavel', action: () => openExternalLink(LICENSE_URL, 'License') },
    { key: 'tos', label: 'Terms of Service', icon: 'description', action: () => openExternalLink(TERMS_URL, 'Terms of Service') },
    { key: 'privacy', label: 'Privacy Policy', icon: 'privacy-tip', action: () => openExternalLink(PRIVACY_URL, 'Privacy Policy') },
  ];

  const supportItems = [
    { key: 'feedback', label: 'Send Feedback', icon: 'email', action: () => openExternalLink('mailto:support@affir.app?subject=Affir%20Feedback', 'Feedback') },
    { key: 'rate', label: 'Rate Us', icon: 'star-rate', action: () => openExternalLink(RATE_APP_URL, 'Rate Us') },
    { key: 'share', label: 'Share App', icon: 'share', action: handleShareApp },
    { key: 'about', label: 'About', icon: 'info-outline', action: () => setIsAboutModalVisible(true) },
  ];

  const renderSettingsItem = item => (
    <Pressable
      key={item.key}
      onPress={item.action}
      style={({ pressed }) => [
        styles.settingRow,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.settingRowLeft}>
        <View style={[styles.settingRowIcon, { backgroundColor: theme.colors.accentMuted }]}>
          <MaterialIcons name={item.icon} size={18} color={theme.colors.accent} />
        </View>
        <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>{item.label}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color={theme.colors.textSecondary} />
    </Pressable>
  );

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}> 
      <FlatList
        data={Object.values(THEMES)}
        keyExtractor={item => item.key}
        ListHeaderComponent={
          <View>
            <Text style={[styles.settingsSectionTitle, { color: theme.colors.textPrimary }]}>Appearance</Text>
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
            <Text style={[styles.settingsSectionTitle, styles.settingsSplitSectionTitle, { color: theme.colors.textPrimary }]}>Notifications</Text>
            <Pressable
              onPress={toggleDailyReminder}
              style={({ pressed }) => [
                styles.settingRow,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                pressed && { opacity: 0.85 },
              ]}
            >
              <View style={styles.settingRowLeft}>
                <View style={[styles.settingRowIcon, { backgroundColor: theme.colors.accentMuted }]}>
                  <MaterialIcons name="notifications-active" size={18} color={theme.colors.accent} />
                </View>
                <View style={styles.settingTextGroup}>
                  <Text style={[styles.settingTitle, { color: theme.colors.textPrimary }]}>Reminder</Text>
                  <Text style={[styles.settingHint, { color: theme.colors.textSecondary }]}>See affirmations in notification.</Text>
                </View>
              </View>
              <Switch
                value={isReminderEnabled}
                onValueChange={toggleDailyReminder}
                thumbColor="#ffffff"
                trackColor={{ false: '#d8d8d8', true: theme.colors.accent }}
              />
            </Pressable>

            <Text style={[styles.settingsSectionTitle, { color: theme.colors.textPrimary }]}>Support</Text>
            {supportItems.map(renderSettingsItem)}
            <Text style={[styles.settingsSectionTitle, styles.settingsSplitSectionTitle, { color: theme.colors.textPrimary }]}>Legal</Text>
            {legalItems.map(renderSettingsItem)}
          </View>
        }
      />

      <Modal
        visible={isAboutModalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsAboutModalVisible(false)}
      >
        <View
          style={[
            styles.aboutModalScreen,
            {
              backgroundColor: theme.colors.background,
              paddingTop: Math.max(18, insets.top + 8),
              paddingBottom: Math.max(18, insets.bottom + 8),
              paddingLeft: Math.max(16, insets.left + 12),
              paddingRight: Math.max(16, insets.right + 12),
            },
          ]}
        >
          <View style={styles.aboutModalHeader}>
            <View style={[styles.aboutModalBadge, { backgroundColor: theme.colors.accentMuted, borderColor: theme.colors.accent }]}> 
              <MaterialIcons name="self-improvement" size={22} color={theme.colors.accent} />
            </View>
            <Pressable
              onPress={() => setIsAboutModalVisible(false)}
              style={({ pressed }) => [
                styles.aboutModalClose,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                pressed && { opacity: 0.8 },
              ]}
              accessibilityLabel="Close about"
            >
              <MaterialIcons name="close" size={20} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          <Text style={[styles.aboutModalTitle, { color: theme.colors.textPrimary }]}>About Affir</Text>
          <Text style={[styles.aboutModalSubtitle, { color: theme.colors.textSecondary }]}>A calm companion for your everyday mindset.</Text>

          <View style={[styles.aboutModalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.aboutModalBody, { color: theme.colors.textPrimary }]}>Affir delivers short affirmations designed to help you pause, reset, and move through your day with clarity.</Text>
            <Text style={[styles.aboutModalMeta, { color: theme.colors.textSecondary }]}>Version 1.0.0</Text>
            <Text style={[styles.aboutModalMeta, { color: theme.colors.textSecondary }]}>Made for simple daily use.</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
