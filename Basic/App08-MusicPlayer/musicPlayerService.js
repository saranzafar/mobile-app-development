import TrackPlayer, { Event, RepeatMode } from 'react-native-track-player';
import { playListData } from './src/constant';

export async function setupPlayer() {
    try {
        const isSetup = await TrackPlayer.isServiceRunning();
        if (!isSetup) {
            await TrackPlayer.setupPlayer();
        }
        return true;
    } catch (error) {
        console.log('Player setup error:', error);
        return false;
    }
}


export async function addTrack() {
    await TrackPlayer.add(playListData);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
    TrackPlayer.addEventListener(Event.RemotePause, async () => {
        await TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemotePlay, async () => {
        await TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, async () => {
        await TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
        await TrackPlayer.skipToPrevious();
    });
}

