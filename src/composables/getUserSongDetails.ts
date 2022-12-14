export const getSongRecords = (allSongRecords, songID, difficulty) => {
  return allSongRecords.filter((item) => {
    return item.songID == songID && item.difficulty.toLowerCase() == difficulty.toLowerCase();
  });
}

export const getSongNotes = (allSongNotes, songID) => {
  return allSongNotes.filter((item) => {
    return item.songID == songID;
  })[0] ?? null;
}