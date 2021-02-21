import React, { useRef, useEffect, useState } from 'react';
import { IVideoTrack } from '../../types';
import { styled } from '@material-ui/core/styles';
import { Participant, Track } from 'twilio-video';
import useMediaStreamTrack from '../../hooks/useMediaStreamTrack/useMediaStreamTrack';
import useVideoTrackDimensions from '../../hooks/useVideoTrackDimensions/useVideoTrackDimensions';
import axios from 'axios';

const statusIcons = {
  default: '😎',
  neutral: '🙂',
  happy: '😀',
  sad: '😥',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😳',
};

const Video = styled('video')({
  width: '100%',
  height: '100%',
});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
  participant?: Participant;
}

export default function VideoTrack({ track, isLocal, priority, participant }: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const mediaStreamTrack = useMediaStreamTrack(track);
  const dimensions = useVideoTrackDimensions(track);
  const isPortrait = (dimensions?.height ?? 0) > (dimensions?.width ?? 0);

  const [isUpdating, setIsImageUpdating] = useState(false);
  const [emotions, setEmotions] = useState({});

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);

    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  useEffect(() => {
    const getEmotions = () => {
      if (!ref.current || isUpdating || !participant) {
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = dimensions?.width || 640;
      canvas.height = dimensions?.height || 480;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(ref.current, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL('image/jpeg');

      setIsImageUpdating(true);
      axios
        .post('http://localhost:5000/expression', { imageData: data, sid: participant.sid })
        .then(response => {
          setEmotions(response.data);
          setIsImageUpdating(false);
          setTimeout(getEmotions, 100);
        })
        .catch(err => console.error(err));
    };

    getEmotions();
  }, []);

  // The local video track is mirrored if it is not facing the environment.
  const isFrontFacing = mediaStreamTrack?.getSettings().facingMode !== 'environment';
  const style = {
    transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : '',
    objectFit: isPortrait || track.name.includes('screen') ? ('contain' as const) : ('cover' as const),
    display: participant?.sid === 'PAeeb1875bfa1131c0a9841f4bceabfc59' ? 'iherit' : 'none',
  };

  return (
    <>
      {participant?.sid !== 'PAeeb1875bfa1131c0a9841f4bceabfc59' && (
        <p style={{ color: 'white', fontSize: '100px', margin: '0px' }}>
          {statusIcons[emotions[`${participant ? participant.sid : ''}`]]}
        </p>
      )}
      <Video ref={ref} style={style} />;
    </>
  );
}
