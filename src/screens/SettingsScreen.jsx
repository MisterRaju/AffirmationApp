import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, Linking, Share, Modal, Switch, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/appStyles';
import { THEMES } from '../theme/themes';

const RATE_APP_URL = 'https://example.com/rate';
const APP_SHARE_URL = 'https://example.com/affir';
const FEEDBACK_EMAIL = 'itsrajughimire@gmail.com';
const FEEDBACK_SUBJECT = 'Affir Feedback';
const FEEDBACK_BODY = [
  'Hi Affir Team,',
  '',
  'I would like to share the following feedback:',
  '',
  '',
  'Device:',
  'App version: 1.0.0',
].join('\n');

const LEGAL_CONTENT = {
  tos: {
    title: 'Terms of Service',
    icon: 'description',
    sections: [
      {
        heading: 'Acceptance',
        body:
          'By using Affir, you agree to these Terms. If you do not agree, please stop using the app.',
      },
      {
        heading: 'Personal, Non-Commercial Use',
        body:
          'Affir is provided for personal wellbeing and reflection. You may not copy, resell, or redistribute the app content for commercial use without permission.',
      },
      {
        heading: 'Wellbeing Disclaimer',
        body:
          'Affirmations are motivational content and are not medical, psychological, or crisis advice. If you need urgent help, contact local emergency or professional services.',
      },
      {
        heading: 'App Availability',
        body:
          'We may update, improve, or discontinue features at any time. We try to keep the app available but do not guarantee uninterrupted service.',
      },
      {
        heading: 'Liability',
        body:
          'To the maximum extent permitted by law, Affir is provided as-is without warranties. We are not liable for indirect, incidental, or consequential damages.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    icon: 'privacy-tip',
    sections: [
      {
        heading: 'Data We Store',
        body:
          'Affir stores your favorites, selected categories, theme, and reminder preference locally on your device to provide core app functionality.',
      },
      {
        heading: 'Notifications',
        body:
          'If you enable reminders, the app requests notification permission and schedules local notifications. Notification text is generated from built-in affirmations.',
      },
      {
        heading: 'No Account Required',
        body:
          'Affir does not require sign-up and does not intentionally collect account credentials from you.',
      },
      {
        heading: 'No Sale of Data',
        body:
          'We do not sell your personal information. Local app data remains on your device unless you choose to share content using system share actions.',
      },
      {
        heading: 'Control and Deletion',
        body:
          'You can disable reminders in settings and remove locally stored data by clearing app storage or uninstalling the app.',
      },
    ],
  },
};

const SettingsScreen = ({ theme, themeName, setThemeName, settings, setSettings }) => {
  const insets = useSafeAreaInsets();
  const [activeInfoModal, setActiveInfoModal] = useState(null);
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

  const handleSendFeedback = () => {
    const mailtoUrl = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(FEEDBACK_SUBJECT)}&body=${encodeURIComponent(FEEDBACK_BODY)}`;
    openExternalLink(mailtoUrl, 'Feedback');
  };

  const openInfoModal = modalType => setActiveInfoModal(modalType);
  const closeInfoModal = () => setActiveInfoModal(null);

  const legalItems = [
    { key: 'tos', label: 'Terms of Service', icon: 'description', action: () => openInfoModal('tos') },
    { key: 'privacy', label: 'Privacy Policy', icon: 'privacy-tip', action: () => openInfoModal('privacy') },
  ];

  const supportItems = [
    { key: 'feedback', label: 'Send Feedback', icon: 'email', action: handleSendFeedback },
    { key: 'rate', label: 'Rate Us', icon: 'star-rate', action: () => openExternalLink(RATE_APP_URL, 'Rate Us') },
    { key: 'share', label: 'Share App', icon: 'share', action: handleShareApp },
    { key: 'about', label: 'About', icon: 'info-outline', action: () => openInfoModal('about') },
  ];

  const modalTitle =
    activeInfoModal === 'about' ? 'About Affir' : LEGAL_CONTENT[activeInfoModal]?.title;
  const modalIcon =
    activeInfoModal === 'about' ? 'self-improvement' : LEGAL_CONTENT[activeInfoModal]?.icon;
  const modalSections =
    activeInfoModal === 'about'
      ? [
          {
            heading: 'What Affir Is',
            body:
              'Affir is a simple daily affirmation app built to help you pause, reset your mindset, and keep perspective during busy moments.',
          },
          {
            heading: 'How It Helps',
            body:
              'You can browse affirmations by category, save favorites, choose your visual theme, and enable reminders for steady motivation through the day.',
          },
          {
            heading: 'Privacy by Design',
            body:
              'Affir keeps your core preferences on your own device and aims to minimize data collection while staying practical and calm to use.',
          },
          {
            heading: 'Version',
            body: 'Version 1.0.0',
          },
        ]
      : LEGAL_CONTENT[activeInfoModal]?.sections || [];

  const renderSettingsItem = item => (
    <Pressable
      key={item.key}
      onPress={item.action}
      style={({ pressed }) => [
        styles.settingRow,
        { backgroundColor: theme.colors.card },
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
        numColumns={3}
        keyExtractor={item => item.key}
        columnWrapperStyle={styles.themeGridRow}
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
                  backgroundColor: active
                    ? theme.colors.accentMuted
                    : pressed
                      ? theme.colors.surface
                      : theme.colors.card,
                  borderColor: active ? theme.colors.accent : theme.colors.border,
                },
                pressed && styles.interactiveButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.themeOptionTitle,
                  {
                    color: active ? theme.colors.accent : theme.colors.textPrimary,
                  },
                ]}
              >
                {item.label}
              </Text>
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
                { backgroundColor: theme.colors.card },
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
        visible={Boolean(activeInfoModal)}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeInfoModal}
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
              <MaterialIcons name={modalIcon || 'info-outline'} size={22} color={theme.colors.accent} />
            </View>
            <Pressable
              onPress={closeInfoModal}
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

          <Text style={[styles.aboutModalTitle, { color: theme.colors.textPrimary }]}>{modalTitle || 'Details'}</Text>
          <Text style={[styles.aboutModalSubtitle, { color: theme.colors.textSecondary }]}>Read the full details below.</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.aboutModalScrollContent}
          >
            {modalSections.map(section => (
              <View
                key={section.heading}
                style={[styles.aboutModalCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.aboutModalCardTitle, { color: theme.colors.textPrimary }]}>{section.heading}</Text>
                <Text style={[styles.aboutModalBody, { color: theme.colors.textPrimary }]}>{section.body}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;
