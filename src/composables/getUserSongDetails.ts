export const getSongRecords = (allSongRecords:any, songID:any, difficulty:string) => {
  return allSongRecords.filter((item:any) => {
    return item.songID == songID && item.difficulty.toLowerCase() == difficulty.toLowerCase();
  });
}

export const getSongNotes = (allSongNotes:any, songID:any) => {
  return allSongNotes.filter((item:any) => {
    return item.songID == songID;
  })[0] ?? null;
}