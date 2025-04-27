import React, { useMemo } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigations/AppNavigator';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import 'react-native-url-polyfill/auto';

const Main = () => {
  const { theme } = useTheme();

  // Memoize the combined style array so it's only recreated when the backgroundColor changes
  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: theme.colors.background }],
    [theme.colors.background]
  );

  return (
    <SafeAreaView style={containerStyle}>
      <StatusBar
        barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
      />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <Main />
    </AuthProvider>
  </ThemeProvider>
);

export default App;
