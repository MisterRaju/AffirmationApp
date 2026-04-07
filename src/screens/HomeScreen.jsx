import React, { useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { View, Text, StatusBar, Pressable, Alert, Image, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/appStyles';
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
  ({ item, theme, isFavorite, onToggleFavorite, onShare, itemHeight, actionBottomOffset }) => (
    <View style={[styles.page, itemHeight ? { height: itemHeight } : null]}>
      <Text style={[styles.text, styles.mainAffirmationText, { color: theme.colors.textPrimary }]}>{item.text}</Text>

      <View style={[styles.pageActionsRow, { bottom: actionBottomOffset }]}> 
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

const HomeScreen = ({ navigation, theme, favorites, toggleFavorite, selectedCategories }) => {
  const insets = useSafeAreaInsets();
  const shareCaptureRef = useRef(null);
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const selectedSet = useMemo(() => new Set(selectedCategories), [selectedCategories]);

  const filteredAffirmations = useMemo(
    () => {
      if (selectedSet.size === 0) {
        return affirmations;
      }

      return affirmations.filter(item => selectedSet.has(item.category));
    },
    [selectedSet],
  );

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategories]);

  useEffect(() => {
    if (!isAutoplayEnabled || filteredAffirmations.length < 2 || listHeight <= 0) {
      return undefined;
    }

    const readingIntervalMs = 5500;
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % filteredAffirmations.length;
        listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        return nextIndex;
      });
    }, readingIntervalMs);

    return () => clearInterval(interval);
  }, [filteredAffirmations.length, isAutoplayEnabled, listHeight]);

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
        actionBottomOffset={Math.max(insets.bottom + 24, 96)}
      />
    ),
    [favoriteSet, insets.bottom, listHeight, shareAffirmation, theme, toggleFavorite],
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

  const handleMomentumEnd = useCallback(
    event => {
      if (!listHeight) {
        return;
      }

      const yOffset = event.nativeEvent.contentOffset.y;
      const nextIndex = Math.max(0, Math.round(yOffset / listHeight));
      if (nextIndex !== currentIndex) {
        setCurrentIndex(nextIndex);
      }
    },
    [currentIndex, listHeight],
  );

  const handleAutoplayToggle = useCallback(() => {
    setIsAutoplayEnabled(prev => !prev);
  }, []);

  const fabOverlayInsetStyle = useMemo(
    () => ({
      paddingLeft: Math.max(16, insets.left + 12),
      paddingRight: Math.max(16, insets.right + 12),
      paddingBottom: Math.max(20, insets.bottom + 12),
    }),
    [insets.bottom, insets.left, insets.right],
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
            ref={listRef}
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
            onMomentumScrollEnd={handleMomentumEnd}
            extraData={favorites}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>No affirmations found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>Try selecting fewer categories.</Text>
          </View>
        )}
      </View>

      <View style={[styles.fabOverlay, fabOverlayInsetStyle]} pointerEvents="box-none">
        <View style={styles.fabRow}>
          <Pressable
            style={[styles.fab, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={handleAutoplayToggle}
            accessibilityLabel={isAutoplayEnabled ? 'Pause autoplay' : 'Start autoplay'}
          >
            <MaterialIcons
              name={isAutoplayEnabled ? 'pause' : 'play-arrow'}
              size={22}
              color={theme.colors.textPrimary}
            />
          </Pressable>

          <Pressable
            style={[styles.fab, { backgroundColor: theme.colors.accent }]}
            onPress={() => navigation.navigate('Categories')}
            accessibilityLabel="Open categories"
          >
            <MaterialIcons name="tune" size={22} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
