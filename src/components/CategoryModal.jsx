import React, { useCallback } from 'react';
import { Modal, Pressable, Text, View, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/appStyles';

const CategoryModal = ({
  visible,
  onClose,
  categories,
  selectedCategories,
  onToggleCategory,
  onClear,
  theme,
}) => {
  const insets = useSafeAreaInsets();

  const renderItem = useCallback(
    ({ item }) => {
      const selected = selectedCategories.includes(item.key);

      return (
        <Pressable
          onPress={() => onToggleCategory(item.key)}
          style={({ pressed }) => [
            styles.catItem,
            {
              borderColor: selected ? theme.colors.accent : theme.colors.border,
              backgroundColor: selected ? theme.colors.accentMuted : theme.colors.card,
            },
            pressed && { opacity: 0.8 },
          ]}
        >
          <Text
            style={[
              styles.catText,
              { color: theme.colors.textSecondary },
              selected && styles.catTextSelected,
            ]}
          >
            {item.label}
          </Text>
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
    [onToggleCategory, selectedCategories, theme.colors.accent, theme.colors.accentMuted, theme.colors.border, theme.colors.card, theme.colors.textPrimary, theme.colors.textSecondary],
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalBox,
            {
              backgroundColor: theme.colors.surface,
              paddingBottom: Math.max(20, insets.bottom + 12),
            },
          ]}
          onPress={() => {}}
        >
          <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>Select categories</Text>
          <FlatList
            data={categories}
            keyExtractor={item => item.key}
            numColumns={2}
            columnWrapperStyle={styles.catRow}
            renderItem={renderItem}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews
          />

          <View style={styles.modalActions}>
            <Pressable
              onPress={onClear}
              style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.75 }]}
            >
              <View style={styles.iconLabelRow}>
                <MaterialIcons name="refresh" size={16} color={theme.colors.textSecondary} />
                <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>Clear</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={onClose}
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
  );
};

export default React.memo(CategoryModal);
