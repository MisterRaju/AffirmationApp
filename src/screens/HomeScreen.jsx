import React, { useCallback, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { View, Text, StatusBar, Pressable, Alert, Image, FlatList } from 'react-native';
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

const ShareCaptureCard = React.forwardRef(({ theme }, ref) => {
  const [captureText, setCaptureText] = useState('');
  const viewShotRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      async captureForText(text) {
        if (!viewShotRef.current) {
          return null;
        }

        setCaptureText(text);
        await new Promise(resolve => requestAnimationFrame(resolve));

        const imageId = Date.now();
        const uri = await viewShotRef.current.capture({
          format: 'jpg',
          quality: 0.9,
          fileName: `affir-${imageId}`,
        });

        return { uri, imageId };
      },
    }),
    [],
  );

  return (
    <View style={styles.hiddenShotContainer} pointerEvents="none">
      <ViewShot
        ref={viewShotRef}
        collapsable={false}
        options={{ format: 'jpg', quality: 0.9, result: 'tmpfile' }}
        style={[styles.shareCardCapture, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.shareBrandRow}>
          <Image source={AFFIRMATIONS_LOGO} style={styles.shareAvatar} />
          <Text style={[styles.shareLogo, { color: theme.colors.textSecondary }]}>Affir</Text>
        </View>
        <Text style={[styles.text, styles.shareText, { color: theme.colors.textPrimary }]}>{captureText}</Text>
      </ViewShot>
    </View>
  );
});

const AffirmationPage = React.memo(
  ({ item, theme, isFavorite, onToggleFavorite, onShare, itemHeight }) => (
    <View style={[styles.page, itemHeight ? { height: itemHeight } : null]}>
      <Text style={[styles.text, styles.mainAffirmationText, { color: theme.colors.textPrimary }]}>{item.text}</Text>

      <View style={styles.pageActionsRow}>
        <FavoriteToggleButton
          theme={theme}
          isFavorite={isFavorite}
          onPress={() => onToggleFavorite(item.text)}
          showLabel={false}
        />

        <Pressable
          onPress={() => onShare(item.text)}
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
  ),
);

const HomeScreen = ({ theme, favorites, toggleFavorite }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const shareCaptureRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const selectedSet = useMemo(() => new Set(selectedCategories), [selectedCategories]);

  const toggleCategory = useCallback(key => {
    setSelectedCategories(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key],
    );
  }, []);

  const clearCategories = useCallback(() => {
    setSelectedCategories([]);
  }, []);

  const filteredAffirmations = useMemo(
    () => {
      if (selectedSet.size === 0) {
        return affirmations;
      }

      return affirmations.filter(item => selectedSet.has(item.category));
    },
    [selectedSet],
  );

  const shareAffirmation = useCallback(async text => {
    try {
      if (!shareCaptureRef.current) {
        return;
      }

      const captured = await shareCaptureRef.current.captureForText(text);
      if (!captured) {
        return;
      }

      const { uri, imageId } = captured;
      const shareUrl = uri.startsWith('file://') ? uri : `file://${uri}`;

      await Share.open({
        title: 'Share affirmation',
        type: 'image/jpeg',
        url: shareUrl,
        filename: `affir-${imageId}.jpg`,
        failOnCancel: false,
      });
    } catch (error) {
      Alert.alert('Could not share image', 'Please try again.');
    }
  }, []);

  const renderAffirmation = useCallback(
    ({ item }) => (
      <AffirmationPage
        item={item}
        theme={theme}
        isFavorite={favoriteSet.has(item.text)}
        onToggleFavorite={toggleFavorite}
        onShare={shareAffirmation}
        itemHeight={listHeight}
      />
    ),
    [favoriteSet, listHeight, shareAffirmation, theme, toggleFavorite],
  );

  const getItemLayout = useCallback(
    (_, index) => ({
      length: listHeight || 1,
      offset: (listHeight || 1) * index,
      index,
    }),
    [listHeight],
  );

  const handleContentLayout = useCallback(
    event => {
      const nextHeight = Math.round(event.nativeEvent.layout.height);
      if (nextHeight > 0 && listHeight === 0) {
        setListHeight(nextHeight);
      }
    },
    [listHeight],
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.header}
      />

      <View
        style={styles.contentArea}
        onLayout={handleContentLayout}
      >
        <ShareCaptureCard ref={shareCaptureRef} theme={theme} />

        {filteredAffirmations.length > 0 ? (
          <FlatList
            data={filteredAffirmations}
            keyExtractor={item => item.id}
            renderItem={renderAffirmation}
            style={styles.pager}
            decelerationRate="normal"
            initialNumToRender={2}
            maxToRenderPerBatch={3}
            windowSize={5}
            removeClippedSubviews
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            snapToInterval={listHeight || undefined}
            snapToAlignment="start"
            disableIntervalMomentum
            extraData={favorites}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>No affirmations found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>Try selecting fewer categories.</Text>
          </View>
        )}
      </View>

      {!modalVisible && (
        <View style={styles.fabOverlay} pointerEvents="box-none">
          <Pressable
            style={[styles.fab, { backgroundColor: theme.colors.accent }]}
            onPress={() => setModalVisible(true)}
            accessibilityLabel="Open categories"
          >
            <MaterialIcons name="tune" size={22} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
      )}


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
