import AppText from '@/components/ui/atoms/app-text';
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/splash-icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <AppText style={styles.text}>Вначале была мысль...</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: SCREEN_WIDTH,
    height: undefined,
    aspectRatio: 1,
  },
  text: {
    marginTop: 20,
  },
});

export default SplashScreen;
