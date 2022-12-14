export const filterBest = (songRecords, trackerMode, noPL = false) => {
  let tracker = trackerMode == 'ap' ? "bestPerf" : "bestCB";
  if (noPL) { tracker += '_NoPL'; }

  return songRecords.filter((item) => {
    return item[tracker];
  })
}