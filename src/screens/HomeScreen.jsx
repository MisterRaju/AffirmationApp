import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/appStyles';
import { CATEGORIES } from '../constants/categories';
import CategoryModal from '../components/CategoryModal';
import FavoriteToggleButton from '../components/FavoriteToggleButton';

const affirmations = require('../affirmations.json');

const HomeScreen = ({ theme, favorites, toggleFavorite }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleCategory = key => {
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key],
    );
  };

  const filteredAffirmations = affirmations.filter(item =>
    selectedCategories.length === 0
      ? true
      : item.categories && item.categories.some(c => selectedCategories.includes(c)),
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.header}
      />

      <View style={styles.contentArea}>
        {filteredAffirmations.length > 0 ? (
          <PagerView
            style={styles.pager}
            key={filteredAffirmations.length}
            initialPage={0}
            orientation="vertical"
          >
            {filteredAffirmations.map(item => (
              <View key={item.text} style={styles.page}>
                <Text style={[styles.text, { color: theme.colors.textPrimary }]}>{item.text}</Text>
                <FavoriteToggleButton
                  theme={theme}
                  isFavorite={favorites.includes(item.text)}
                  onPress={() => toggleFavorite(item.text)}
                  showLabel={false}
                />
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

      <CategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categories={CATEGORIES}
        selectedCategories={selectedCategories}
        onToggleCategory={toggleCategory}
        onClear={() => setSelectedCategories([])}
        theme={theme}
      />
    </View>
  );
};

export default HomeScreen;
