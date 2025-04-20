import React from 'react';
import { Pressable, View } from 'react-native';
import TrackPlayer, { State, usePlaybackState } from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { playbackService } from '../../musicPlayerService';

function ControlCenter() {
    const playBackState = usePlaybackState();

    // Next Button
    const skipToNext = async () => {
        await TrackPlayer.skipToNext();
    };

    // Preious Button
    const skipToPrevious = async () => {
        await TrackPlayer.skipToPrevious();
    };

    const togglePlayback = async (playback: State) => {
        const currentTrack = await TrackPlayer.getCurrentTrack();
        if (currentTrack !== null) {
            if (playback === State.Paused || playback === State.Ready || playback === State.Stopped) {
                await TrackPlayer.play();
            } else {
                await TrackPlayer.pause();
            }
        }
    };

    return (
        <View>
            <Pressable onPress={skipToPrevious}>
                <Icon name="skip-previous" size={40} />
            </Pressable>

            <Pressable onPress={() => togglePlayback(playBackState)}>
                <Icon
                    name={playBackState === State.Playing ? 'pause' : 'play-arrow'}
                    size={75}
                />
            </Pressable>

            <Pressable onPress={skipToNext}>
                <Icon name="skip-next" size={40} />
            </Pressable>

        </View>
    );
}

export default ControlCenter;
