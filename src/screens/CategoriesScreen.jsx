import React, { useCallback } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from '../styles/appStyles';
import { CATEGORIES } from '../constants/categories';

const CategoriesScreen = ({ navigation, theme, selectedCategories, setSelectedCategories }) => {
  const insets = useSafeAreaInsets();

  const toggleCategory = useCallback(
    key => {
      setSelectedCategories(prev =>
        prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key],
      );
    },
    [setSelectedCategories],
  );

  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, [setSelectedCategories]);

  const renderItem = useCallback(
    ({ item }) => {
      const selected = selectedCategories.includes(item.key);

      return (
        <Pressable
          onPress={() => toggleCategory(item.key)}
          style={({ pressed }) => [
            styles.catItem,
            {
              borderColor: selected ? theme.colors.accent : theme.colors.border,
              backgroundColor: selected
                ? pressed
                  ? theme.colors.accent
                  : theme.colors.accentMuted
                : pressed
                  ? theme.colors.surface
                  : theme.colors.card,
            },
            pressed && styles.interactiveButtonPressed,
          ]}
        >
          <View style={styles.iconLabelRow}>
            <MaterialIcons
              name={item.icon}
              size={18}
              color={selected ? theme.colors.textPrimary : theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.catText,
                { color: theme.colors.textSecondary },
                selected && styles.catTextSelected,
              ]}
            >
              {item.label}
            </Text>
          </View>
          {selected && (
            <MaterialIcons
              name="check-circle"
              size={16}
              color={theme.colors.textPrimary}
              style={styles.check}
            />
          )}
        </Pressable>
      );
    },
    [selectedCategories, theme.colors.accent, theme.colors.accentMuted, theme.colors.border, theme.colors.card, theme.colors.surface, theme.colors.textPrimary, theme.colors.textSecondary, toggleCategory],
  );

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.colors.background }]}> 
      <FlatList
        data={CATEGORIES}
        keyExtractor={item => item.key}
        numColumns={2}
        columnWrapperStyle={styles.catRow}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.categoriesList,
          {
            paddingBottom: Math.max(20, insets.bottom + 12),
            paddingLeft: Math.max(12, insets.left + 8),
            paddingRight: Math.max(12, insets.right + 8),
          },
        ]}
      />

      <View style={[styles.categoryActionsBar, { paddingBottom: Math.max(12, insets.bottom + 8) }]}> 
        <Pressable
          onPress={clearCategories}
          style={({ pressed }) => [
            styles.actionButton,
            styles.categoryActionButton,
            {
              backgroundColor: pressed ? theme.colors.surface : theme.colors.card,
              borderColor: theme.colors.border,
            },
            pressed && styles.interactiveButtonPressed,
          ]}
        >
          <View style={styles.iconLabelRow}>
            <MaterialIcons name="refresh" size={18} color={theme.colors.textSecondary} />
            <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>Clear</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.actionButton,
            styles.categoryActionButton,
            styles.applyButton,
            { backgroundColor: pressed ? theme.colors.accentMuted : theme.colors.accent },
            pressed && styles.interactiveButtonPressed,
          ]}
        >
          <View style={styles.iconLabelRow}>
            <MaterialIcons name="done" size={18} color="#ffffff" />
            <Text style={[styles.actionText, styles.applyText]}>Done</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default CategoriesScreen;
