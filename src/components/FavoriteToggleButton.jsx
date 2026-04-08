import React from 'react';
import { Pressable, View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/appStyles';

const FavoriteToggleButton = ({ theme, isFavorite, onPress, showLabel = true }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.favoriteButton,
      {
        backgroundColor: pressed ? theme.colors.accentMuted : theme.colors.card,
        borderWidth: 0,
        borderColor: 'transparent',
      },
      pressed && styles.interactiveButtonPressed,
    ]}
    accessibilityLabel="Toggle favorite"
  >
    <View style={styles.iconLabelRow}>
      <MaterialIcons
        name={isFavorite ? 'favorite' : 'favorite-border'}
        size={30}
        color={isFavorite ? theme.colors.accent : theme.colors.textPrimary}
      />
      {showLabel && (
        <Text style={[styles.favoriteButtonText, { color: theme.colors.textPrimary }]}>
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      )}
    </View>
  </Pressable>
);

export default FavoriteToggleButton;
