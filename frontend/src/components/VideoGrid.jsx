'use client'

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const VideoElement = ({ stream, username, isLocal, userId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <div className="flex justify-between items-center">
          <span className="text-white font-medium text-sm">
            {username} {isLocal && '(You)'}
          </span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoGrid = ({ localStream, user }) => {
  const { peers } = useSelector(state => state.conference);

  const allPeers = Object.entries(peers);
  const totalParticipants = allPeers.length + 1; // +1 for local user

  const getGridClass = () => {
    if (totalParticipants === 1) return 'grid-cols-1';
    if (totalParticipants === 2) return 'grid-cols-1 md:grid-cols-2';
    if (totalParticipants <= 4) return 'grid-cols-1 md:grid-cols-2';
    if (totalParticipants <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className={`grid gap-4 ${getGridClass()}`}>
        {/* Local Video */}
        {localStream && user && (
          <VideoElement
            stream={localStream}
            username={user.username}
            isLocal={true}
            userId={user.id}
          />
        )}
        
        {/* Remote Videos */}
        {allPeers.map(([socketId, peer]) => (
          <VideoElement
            key={socketId}
            stream={peer.stream}
            username={peer.username}
            isLocal={false}
            userId={peer.userId}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;