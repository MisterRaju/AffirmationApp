import React, { useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/appStyles';
import { flattenAffirmations } from '../utils/affirmations';

const affirmations = flattenAffirmations;

const FavoritesScreen = ({ theme, favorites, toggleFavorite }) => {
  const insets = useSafeAreaInsets();
  const affirmationByText = useMemo(
    () => new Map(affirmations.map(item => [item.text, item])),
    [],
  );

  // favorites are appended on add, so reversing puts newest favorites first.
  const favoriteItems = useMemo(
    () => [...favorites].reverse().map(text => affirmationByText.get(text)).filter(Boolean),
    [affirmationByText, favorites],
  );

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}> 
      <FlatList
        data={favoriteItems}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.favoritesList, { paddingBottom: Math.max(20, insets.bottom + 12) }]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>No favorites yet</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>Tap the heart icon on the home screen.</Text>
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
            <View style={styles.favoriteCardRow}>
              <Text style={[styles.favoriteText, styles.favoriteTextInRow, { color: theme.colors.textPrimary }]}>{item.text}</Text>
              <Pressable
                onPress={() => toggleFavorite(item.text)}
                style={({ pressed }) => [
                  styles.removeFavoriteButton,
                  { backgroundColor: theme.colors.accentMuted, borderColor: theme.colors.border },
                  pressed && { opacity: 0.75 },
                ]}
                accessibilityLabel="Remove favorite"
              >
                <MaterialIcons name="delete-outline" size={18} color={theme.colors.textPrimary} />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default FavoritesScreen;
