import { View, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { setupPlayer, addTrack } from '../musicPlayerService';
import MusicPlayer from './screen/MusicPlayer';

const App = () => {
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  async function setUp() {
    let isSetup = await setupPlayer();

    if (isSetup) {
      await addTrack();
    }

    setIsPlayerReady(isSetup);
  }
  useEffect(() => {
    setUp();
  }, []);

  if (!isPlayerReady) {
    return (
      <SafeAreaView>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <MusicPlayer />
      </View>
    </SafeAreaView>
  );
};

export default App;
