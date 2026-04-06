import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, Pressable, Alert, Image } from 'react-native';
import PagerView from 'react-native-pager-view';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import styles from '../styles/appStyles';
import { CATEGORIES } from '../constants/categories';
import CategoryModal from '../components/CategoryModal';
import FavoriteToggleButton from '../components/FavoriteToggleButton';
import { flattenAffirmations } from '../utils/affirmations';

const AFFIRMATIONS_LOGO = require('../assets/affirmationslogo.png');

const affirmations = flattenAffirmations;

const HomeScreen = ({ theme, favorites, toggleFavorite }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [shareText, setShareText] = useState('');
  const shareCardRef = useRef(null);

  const toggleCategory = useCallback(key => {
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key],
    );
  }, []);

  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  const filteredAffirmations = useMemo(
    () =>
      affirmations.filter(item =>
        selectedCategories.length === 0
          ? true
          : selectedCategories.includes(item.category),
      ),
    [selectedCategories],
  );

  const shareAffirmation = useCallback(async text => {
    try {
      if (!shareCardRef.current) {
        return;
      }

      setShareText(text);
      await new Promise(resolve => requestAnimationFrame(resolve));

      const imageId = Math.floor(100000 + Math.random() * 900000);
      const uri = await shareCardRef.current.capture({
        format: 'png',
        quality: 1,
        fileName: `affir-${imageId}`,
      });
      const shareUrl = uri.startsWith('file://') ? uri : `file://${uri}`;

      await Share.open({
        title: 'Share affirmation',
        type: 'image/png',
        url: shareUrl,
        filename: `affir-${imageId}.png`,
        failOnCancel: false,
      });
    } catch (error) {
      Alert.alert('Could not share image', 'Please try again.');
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.header}
      />

      <View style={styles.contentArea}>
        <View style={styles.hiddenShotContainer} pointerEvents="none">
          <ViewShot
            ref={shareCardRef}
            options={{ format: 'png', quality: 1, result: 'tmpfile' }}
            style={[styles.shareCardCapture, { backgroundColor: theme.colors.background }]}
          >
            <View style={styles.shareBrandRow}>
              <Image source={AFFIRMATIONS_LOGO} style={styles.shareAvatar} />
              <Text style={[styles.shareLogo, { color: theme.colors.textSecondary }]}>Affir</Text>
            </View>
            <Text style={[styles.text, styles.shareText, { color: theme.colors.textPrimary }]}>{shareText}</Text>
          </ViewShot>
        </View>

        {filteredAffirmations.length > 0 ? (
          <PagerView
            style={styles.pager}
            initialPage={0}
            orientation="vertical"
          >
            {filteredAffirmations.map(item => (
              <View key={item.id} style={styles.page}>
                <Text style={[styles.text, styles.mainAffirmationText, { color: theme.colors.textPrimary }]}>{item.text}</Text>

                <View style={styles.pageActionsRow}>
                  <FavoriteToggleButton
                    theme={theme}
                    isFavorite={favorites.includes(item.text)}
                    onPress={() => toggleFavorite(item.text)}
                    showLabel={false}
                  />

                  <Pressable
                    onPress={() => shareAffirmation(item.text)}
                    style={({ pressed }) => [
                      styles.favoriteButton,
                      styles.shareButton,
                      { backgroundColor: theme.colors.card },
                      pressed && { opacity: 0.8 },
                    ]}
                    accessibilityLabel="Share affirmation image"
                  >
                    <MaterialIcons name="ios-share" size={30} color={theme.colors.textPrimary} />
                  </Pressable>
                </View>
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
        onClear={clearCategories}
        theme={theme}
      />
    </View>
  );
};

export default HomeScreen;
