export const getNavigationTheme = theme => ({
  dark: theme.isDark,
  colors: {
    primary: theme.colors.accent,
    background: theme.colors.background,
    card: theme.colors.header,
    text: theme.colors.textPrimary,
    border: theme.colors.border,
    notification: theme.colors.accent,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: '400' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: '700' },
    heavy: { fontFamily: 'System', fontWeight: '800' },
  },
});
