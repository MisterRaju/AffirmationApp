import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

export const scale = size => (width / guidelineBaseWidth) * size;

export const verticalScale = size => (height / guidelineBaseHeight) * size;

export const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

export const responsiveFont = size => {
  const newSize = moderateScale(size, 0.35);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
