import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/appStyles';
import { flattenAffirmations } from '../utils/affirmations';

const affirmations = flattenAffirmations;

const FavoritesScreen = ({ theme, favorites, toggleFavorite }) => {
  const favoriteItems = affirmations.filter(item => favorites.includes(item.text));

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}> 
      <FlatList
        data={favoriteItems}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.favoritesList}
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

export default FavoritesScreen;
