import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, View } from 'react-native';
import { playListData } from '../constant';
import TrackPlayer, { Event, Track, useTrackPlayerEvents } from 'react-native-track-player';
import SongInfo from '../components/SongInfo';
import SongSlider from '../components/SongSlider';
import ControlCenter from '../components/ControlCenter';

const { width } = Dimensions.get('window');

function MusicPlayer() {
    const [track, setTrack] = useState<Track | null>(null);

    useEffect(() => {
        const listener = TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event) => {
            const playingTrack = await TrackPlayer.getTrack(event.nextTrack);
            setTrack(playingTrack);
        });

        return () => {
            listener.remove();
        };
    }, []);


    const renderArtWork = () => {
        return (
            <View>
                <View>
                    {track?.artwork && (
                        <Image
                            source={{ uri: track?.artwork?.toString() }}
                        />
                    )}
                </View>
            </View>
        );
    }

    return (
        <View>
            <FlatList
                horizontal
                data={playListData}
                renderItem={renderArtWork}
                keyExtractor={(song) => song.id.toString()}
            />

            <SongInfo track={track} />
            <SongSlider />
            <ControlCenter />
        </View>
    );
}

export default MusicPlayer;
