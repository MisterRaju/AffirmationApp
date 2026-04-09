import React, { useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle } from 'react';
import { View, Text, StatusBar, Pressable, Alert, Image, FlatList, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../styles/appStyles';
import FavoriteToggleButton from '../components/FavoriteToggleButton';
import { flattenAffirmations } from '../utils/affirmations';
import BootSplash from 'react-native-bootsplash';


const AFFIRMATIONS_LOGO = require('../assets/affirlogo.png');

const affirmations = flattenAffirmations;

const darkenHexColor = (hexColor, amount = 0.1) => {
  if (typeof hexColor !== 'string') {
    return hexColor;
  }

  const normalized = hexColor.trim().replace('#', '');
  const validHex = /^[0-9a-fA-F]{6}$/.test(normalized)
    ? normalized
    : /^[0-9a-fA-F]{3}$/.test(normalized)
      ? normalized
          .split('')
          .map(char => char + char)
          .join('')
      : null;

  if (!validHex) {
    return hexColor;
  }

  const clamp = value => Math.max(0, Math.min(255, value));
  const ratio = Math.max(0, Math.min(1, amount));
  const r = clamp(Math.round(parseInt(validHex.slice(0, 2), 16) * (1 - ratio)));
  const g = clamp(Math.round(parseInt(validHex.slice(2, 4), 16) * (1 - ratio)));
  const b = clamp(Math.round(parseInt(validHex.slice(4, 6), 16) * (1 - ratio)));

  const toHex = value => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

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
            pressed && { backgroundColor: theme.colors.accentMuted },
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
  const hasHiddenBootSplashRef = useRef(false);
  const autoplayOpacity = useRef(new Animated.Value(1)).current;
  const autoplayEnabledRef = useRef(false);
  const previousAutoplayRef = useRef(false);
  const stableInsetsRef = useRef({
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
  });
  const [listHeight, setListHeight] = useState(0);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const functionButtonColor = theme.colors.functionBtn || theme.colors.card || '#ffb48f';
  const pressedFunctionButtonColor = useMemo(
    () => darkenHexColor(functionButtonColor, 0.08),
    [functionButtonColor],
  );
  const stableInsets = stableInsetsRef.current;

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

    if (!autoplayEnabledRef.current) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      });
    }
  }, [selectedCategories]);

  useEffect(() => {
    autoplayEnabledRef.current = isAutoplayEnabled;
  }, [isAutoplayEnabled]);

  useEffect(() => {
    if (!isAutoplayEnabled || filteredAffirmations.length < 2) {
      autoplayOpacity.setValue(1);
      return undefined;
    }

    const readingIntervalMs = 5500;
    const interval = setInterval(() => {
      Animated.timing(autoplayOpacity, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || !autoplayEnabledRef.current) {
          autoplayOpacity.setValue(1);
          return;
        }

        setCurrentIndex(prevIndex => (prevIndex + 1) % filteredAffirmations.length);

        if (!autoplayEnabledRef.current) {
          autoplayOpacity.setValue(1);
          return;
        }

        Animated.timing(autoplayOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }).start();
      });
    }, readingIntervalMs);

    return () => clearInterval(interval);
  }, [autoplayOpacity, filteredAffirmations.length, isAutoplayEnabled]);

  useEffect(() => {
    const wasAutoplayEnabled = previousAutoplayRef.current;

    if (
      wasAutoplayEnabled &&
      !isAutoplayEnabled &&
      listHeight > 0 &&
      filteredAffirmations.length > 0
    ) {
      const targetIndex = Math.min(currentIndex, filteredAffirmations.length - 1);
      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({ index: targetIndex, animated: false });
      });
    }

    previousAutoplayRef.current = isAutoplayEnabled;
  }, [currentIndex, filteredAffirmations.length, isAutoplayEnabled, listHeight]);

  const shareAffirmation = useCallback(async text => {
    setIsShareSheetOpen(true);

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
    } finally {
      setIsShareSheetOpen(false);
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
        actionBottomOffset={Math.max(stableInsets.bottom + 36, 128)}
      />
    ),
    [favoriteSet, listHeight, shareAffirmation, stableInsets.bottom, theme, toggleFavorite],
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

      if (nextHeight > 0 && !hasHiddenBootSplashRef.current) {
        hasHiddenBootSplashRef.current = true;
        BootSplash.hide({ fade: true }).catch(() => {});
      }

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
    setIsAutoplayEnabled(prev => {
      const next = !prev;
      autoplayEnabledRef.current = next;
      if (!next) {
        autoplayOpacity.stopAnimation(() => {
          autoplayOpacity.setValue(1);
        });
      }
      return next;
    });
  }, [autoplayOpacity]);

  const currentAutoplayItem = filteredAffirmations[currentIndex] || filteredAffirmations[0];

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
          <>
            <FlatList
              ref={listRef}
              data={filteredAffirmations}
              keyExtractor={item => item.id}
              renderItem={renderAffirmation}
              style={[styles.pager, isAutoplayEnabled && styles.pagerHidden]}
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
              scrollEnabled={!isAutoplayEnabled}
            />

            {isAutoplayEnabled ? (
              <Animated.View
                pointerEvents="auto"
                style={[styles.pager, styles.autoplayOverlay, { opacity: autoplayOpacity }]}
              >
                <AffirmationPage
                  item={currentAutoplayItem}
                  theme={theme}
                  isFavorite={favoriteSet.has(currentAutoplayItem.text)}
                  onToggleFavorite={toggleFavorite}
                  onShare={shareAffirmation}
                  itemHeight={listHeight}
                  actionBottomOffset={Math.max(stableInsets.bottom + 36, 128)}
                />
              </Animated.View>
            ) : null}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateTitle, { color: theme.colors.textPrimary }]}>No affirmations found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>Try selecting fewer categories.</Text>
          </View>
        )}
      </View>

      <View
        style={[styles.fabOverlayFixed, isShareSheetOpen && styles.fabOverlayHidden]}
        pointerEvents="box-none"
      >
        <View style={styles.fabRow}>
          <Pressable
            style={({ pressed }) => [
              styles.fab,
              {
                backgroundColor: pressed ? pressedFunctionButtonColor : functionButtonColor,
                borderWidth: 0,
                borderColor: 'transparent',
              },
              pressed && styles.interactiveButtonPressed,
            ]}
            onPress={handleAutoplayToggle}
            accessibilityLabel={isAutoplayEnabled ? 'Pause autoplay' : 'Start autoplay'}
          >
            <MaterialIcons
              name={isAutoplayEnabled ? 'pause' : 'play-arrow'}
              size={30}
              color={theme.colors.textPrimary}
            />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.fab,
              {
                backgroundColor: pressed ? pressedFunctionButtonColor : functionButtonColor,
                borderWidth: 0,
                borderColor: 'transparent',
              },
              pressed && styles.interactiveButtonPressed,
            ]}
            onPress={() => navigation.navigate('Categories')}
            accessibilityLabel="Open categories"
          >
            <MaterialIcons name="web-stories" size={30} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
