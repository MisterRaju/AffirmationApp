import React from 'react';
import { View, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/appStyles';

const HeaderActions = ({ navigation, theme }) => (
  <View style={styles.headerActions}>
    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        {
          backgroundColor: pressed ? theme.colors.accentMuted : theme.colors.card,
          borderWidth: 0,
          borderColor: 'transparent',
        },
        pressed && styles.interactiveButtonPressed,
      ]}
      onPress={() => navigation.navigate('Categories')}
      accessibilityLabel="Open categories"
    >
      <MaterialIcons name="web-stories" size={27} color={theme.colors.textPrimary} />
    </Pressable>

    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        {
          backgroundColor: pressed ? theme.colors.accentMuted : theme.colors.card,
          borderWidth: 0,
          borderColor: 'transparent',
        },
        pressed && styles.interactiveButtonPressed,
      ]}
      onPress={() => navigation.navigate('Favorites')}
      accessibilityLabel="Open favorites"
    >
      <MaterialIcons name="favorite-border" size={27} color={theme.colors.textPrimary} />
    </Pressable>

    <Pressable
      style={({ pressed }) => [
        styles.headerButton,
        {
          backgroundColor: pressed ? theme.colors.accentMuted : theme.colors.card,
          borderWidth: 0,
          borderColor: 'transparent',
        },
        pressed && styles.interactiveButtonPressed,
      ]}
      onPress={() => navigation.navigate('Settings')}
      accessibilityLabel="Open settings"
    >
      <MaterialIcons name="settings" size={27} color={theme.colors.textPrimary} />
    </Pressable>
  </View>
);

export default HeaderActions;
