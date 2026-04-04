import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  FlatList,
} from 'react-native';
import BootSplash from 'react-native-bootsplash';
import PagerView from 'react-native-pager-view';

const affirmations = require('./affirmations.json');

const CATEGORIES = [
  { key: 'career', label: 'Career' },
  { key: 'student', label: 'Student' },
  { key: 'self-care', label: 'Self Care' },
  { key: 'breakup', label: 'Breakup' },
  { key: 'general', label: 'General' },
];

const App = () => {
  const [index, setIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  const toggleCategory = key => {
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key],
    );
  };

  const filtered = affirmations.filter(a =>
    selectedCategories.length === 0
      ? true
      : a.categories && a.categories.some(c => selectedCategories.includes(c)),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff4ec" />

      <PagerView
        style={styles.pager}
        key={filtered.length} // force update when filter changes
        initialPage={0}
        orientation="vertical"
        onPageSelected={e => setIndex(e.nativeEvent.position)}
      >
        {filtered.map((a, i) => (
          <View key={i} style={styles.page}>
            <Text style={styles.text}>{a.text}</Text>
          </View>
        ))}
      </PagerView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Open categories"
      >
        <Text style={styles.fabText}>⋮</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalBox} onPress={() => {}}>
            <Text style={styles.modalTitle}>Select categories</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={item => item.key}
              numColumns={2}
              columnWrapperStyle={styles.catRow}
              renderItem={({ item }) => {
                const selected = selectedCategories.includes(item.key);
                return (
                  <Pressable
                    onPress={() => toggleCategory(item.key)}
                    style={({ pressed }) => [
                      styles.catItem,
                      selected && styles.catItemSelected,
                      pressed && styles.catItemPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.catText,
                        selected && styles.catTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {selected && <Text style={styles.check}>✓</Text>}
                  </Pressable>
                );
              }}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setSelectedCategories([])}
                style={styles.actionButton}
              >
                <Text style={styles.actionText}>Clear</Text>
              </Pressable>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.actionButton, styles.applyButton]}
              >
                <Text style={[styles.actionText, styles.applyText]}>Apply</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff4ec' },
  pager: { flex: 1 },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  text: {
    color: '#5f3a2f',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 34,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    left: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffb48f',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabText: { color: '#5f3a2f', fontSize: 24, lineHeight: 28 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(108,66,50,0.35)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#ffe8da',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#6c4232',
    textAlign: 'center',
  },
  catRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  catItem: {
    flex: 1,
    minHeight: 72,
    marginHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f1b08f',
    backgroundColor: '#fff6ef',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  catItemSelected: { backgroundColor: '#ffd8c1', borderColor: '#e9875a' },
  catItemPressed: { backgroundColor: '#ffe3d1' },
  catText: { fontSize: 16, color: '#6b4739', textAlign: 'center' },
  catTextSelected: { color: '#6c2e16', fontWeight: '700' },
  check: { color: '#8a3f20', fontSize: 14, position: 'absolute', top: 8, right: 10 },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: { paddingVertical: 8, paddingHorizontal: 12, marginLeft: 8 },
  applyButton: { backgroundColor: '#f49a6c', borderRadius: 6 },
  actionText: { color: '#6f4a3b', fontWeight: '600' },
  applyText: { color: '#ffffff' },
});

export default App;
