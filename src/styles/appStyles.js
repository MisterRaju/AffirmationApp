import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentArea: { flex: 1 },
  screenContainer: { flex: 1 },
  pager: { flex: 1 },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 34,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  favoriteButton: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  iconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 15,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBox: {
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  catText: { fontSize: 16, textAlign: 'center' },
  catTextSelected: { fontWeight: '700' },
  check: { fontSize: 14, position: 'absolute', top: 8, right: 10, fontWeight: '700' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  actionButton: { paddingVertical: 8, paddingHorizontal: 12, marginLeft: 8 },
  applyButton: { borderRadius: 6 },
  actionText: { fontWeight: '600' },
  applyText: { color: '#ffffff' },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    borderWidth: 1,
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  favoritesList: {
    padding: 16,
    gap: 12,
    flexGrow: 1,
  },
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  favoriteText: {
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 12,
  },
  removeFavoriteButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  removeFavoriteButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },

  settingsList: {
    padding: 16,
    paddingBottom: 28,
  },
  settingsSectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    marginTop: 4,
  },
  settingsSectionSubtitle: {
    fontSize: 14,
    marginBottom: 14,
  },
  themeOption: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  themeOptionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  settingRow: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextGroup: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingHint: {
    fontSize: 13,
    marginTop: 2,
  },
  aboutCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginTop: 10,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default styles;
