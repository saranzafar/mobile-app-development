import React from 'react';
import { Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';

function SongSlider() {
    const { position, duration } = useProgress();


    return (
        <View>
            <Slider
                value={position}
                minimumValue={0}
                maximumValue={duration}
                thumbTintColor="#FFF"
                maximumTrackTintColor="#FFF"
                onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
            />

            <View >
                <Text>
                    {new Date(position * 1000).toISOString().substring(15, 19)}
                </Text>
                <Text>
                    {new Date((duration - position) * 1000).toISOString().substring(15, 19)}
                </Text>
            </View>
        </View>
    );
}

export default SongSlider;
