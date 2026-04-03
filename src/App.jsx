import React, { useEffect, useState } from 'react';
import { View, Text, StatusBar, StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import PagerView from 'react-native-pager-view';

const affirmations = require('./affirmations.json');

const App = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    BootSplash.hide({ fade: true });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <PagerView
        style={styles.pager}
        initialPage={0}
        orientation="vertical"
        onPageSelected={e => setIndex(e.nativeEvent.position)}
      >
        {affirmations.map((a, i) => (
          <View key={i} style={styles.page}>
            <Text style={styles.text}>{a}</Text>
          </View>
        ))}
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  pager: { flex: 1 },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  text: {
    color: '#dbdbdb',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 34,
    textAlign: 'center',
  },
});

export default App;
