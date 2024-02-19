import React, { useState, useEffect } from 'react';

const App = () => {
  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audioPlayer, setAudioPlayer] = useState(new Audio());

  useEffect(() => {
    // Load saved audio files from local storage on component mount
    const savedAudioFiles = JSON.parse(localStorage.getItem('audioFiles'));
    if (savedAudioFiles) {
      setAudioFiles(savedAudioFiles);
    }

    // Load last playing audio file and position on component mount
    const lastPlayedTrackIndex = localStorage.getItem('lastPlayedTrackIndex');
    if (lastPlayedTrackIndex) {
      setCurrentTrackIndex(parseInt(lastPlayedTrackIndex));
    }
  }, []);

  useEffect(() => {
    // Update local storage when audio files change
    localStorage.setItem('audioFiles', JSON.stringify(audioFiles));
  }, [audioFiles]);

  useEffect(() => {
    // Set up event listener for audio playback ended
    audioPlayer.addEventListener('ended', handleTrackEnd);

    // Clear event listener on component unmount
    return () => {
      audioPlayer.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex]);

  const handleTrackEnd = () => {
    // Play the next track when current track ends
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % audioFiles.length);
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newAudioFiles = [...audioFiles];
    for (let i = 0; i < files.length; i++) {
      newAudioFiles.push(files[i]);
    }
    setAudioFiles(newAudioFiles);
  };

  const handlePlay = (index) => {
    setCurrentTrackIndex(index);
    const audio = new Audio(URL.createObjectURL(audioFiles[index]));
    setAudioPlayer(audio);
    audio.play();
    // Save last playing track index
    localStorage.setItem('lastPlayedTrackIndex', index);
  };

  return (
    <div>
      <input type="file" accept=".mp3" onChange={handleFileUpload} multiple />
      <ul>
        {audioFiles.map((file, index) => (
          <li key={index} onClick={() => handlePlay(index)}>
            {file.name}
          </li>
        ))}
      </ul>
      <div>
        <h2>Now Playing:</h2>
        <p>{audioFiles[currentTrackIndex]?.name}</p>
      </div>
    </div>
  );
};

export default App;
