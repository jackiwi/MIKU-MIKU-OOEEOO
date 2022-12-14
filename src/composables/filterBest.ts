export const filterBest = (songRecords:any, trackerMode:string, noPL = false) => {
  let tracker = trackerMode == 'ap' ? "bestPerf" : "bestCB";
  if (noPL) { tracker += '_NoPL'; }

  return songRecords.filter((item:any) => {
    return item[tracker];
  })
}