import songList from '@/../public/data/songs.json';
import checkOverlap from '@/composables/checkOverlap';
import { filterBest } from '@/composables/filterBest';

const filtering = (sortType:string, sortOrder:any, a:any, b:any) : number => {
  switch (sortType){
    case 'Release date':
      return sortOrder * (new Date(a[sortType]).valueOf() - new Date(b[sortType]).valueOf());
    case 'Song title':
      let num = 0;
      if (a[sortType] < b[sortType]){
        num = -1;
      }else if (a[sortType] > b[sortType]){
        num = 1;
      }
      return sortOrder * num;
    default:
      if (a[sortType] == b[sortType]){
        return sortOrder * (a.ID - b.ID);
      }
      return sortOrder * (a[sortType] - b[sortType]);
  }
}

export const getAllSongsFiltered = (filter:any) => {

  let filteredList = songList.filter(i => {
    return (
      checkOverlap(i['Unit(s)'], filter['focusUnit'])
      && i['Song title'].toLowerCase().includes(filter['searchTerm'].toLowerCase())
    );
  }).sort((a,b) => {
    let sortOrder = ( filter['sortOrder'] == 'asc' ? 1 : -1 );
    return (filtering(filter['sortType'], sortOrder, a, b));
  });

  return filteredList;
};

export const getAllSongsFiltered1 = (filter:any, userUID:string, trackerMode:string, userSongRecords:any) => {
  if (!userUID || !userSongRecords){
    return getAllSongsFiltered(filter);
  }

  const bestRecords = filterBest(userSongRecords, trackerMode, filter.noPL);
  const bestPerfRecords = filterBest(userSongRecords, 'ap');
  const bestCBRecords = filterBest(userSongRecords, 'fc');
  
  let filteredList = songList.filter((i:any) => {
    return (
      checkOverlap(i['Unit(s)'], filter['focusUnit'])
      && i['Song title'].toLowerCase().includes(filter['searchTerm'].toLowerCase())
    );
  }).map((i:any) => {
    let bestRecord0 = bestRecords?.filter((j:any) => j.songID == i.ID && j.difficulty == filter['songDifficulty'].toLowerCase())[0];
    let bestRecord = bestRecord0 ?
      { ...bestRecord0,
        comboBreaks: bestRecord0?.good + bestRecord0?.bad + bestRecord0?.miss,
        nonperfs: bestRecord0?.great + bestRecord0?.good + bestRecord0?.bad + bestRecord0?.miss,
      } : null;
    return {
      ...i,
      'bestRecord': bestRecord,
      'bestPerfRecord': bestPerfRecords?.filter((j:any) => j.songID == i.ID && j.difficulty == filter['songDifficulty'].toLowerCase())[0],
      'bestCBRecord': bestCBRecords?.filter((j:any) => j.songID == i.ID && j.difficulty == filter['songDifficulty'].toLowerCase())[0]
    };
  }).sort((a:any,b:any) : number => {
    let sortOrder = ( filter['sortOrder'] == 'asc' ? 1 : -1);

    switch(filter['sortType']){
      case 'combo breaks':
        if (!a.bestCBRecord || !b.bestCBRecord){
          if (!a.bestCBRecord && !b.bestCBRecord) { return 0; }
          if (!b.bestCBRecord) { return -1; }
          return 1;
        }
        let aBreaks = a.bestCBRecord?.good + a.bestCBRecord?.bad + a.bestCBRecord?.miss;
        let bBreaks = b.bestCBRecord?.good + b.bestCBRecord?.bad + b.bestCBRecord?.miss;
        
        return sortOrder * (aBreaks - bBreaks);

      case 'nonperfs':
        if (!a.bestPerfRecord || !b.bestPerfRecord){
          if (!a.bestPerfRecord && !b.bestPerfRecord) { return 0; }
          if (!b.bestPerfRecord) { return -1; }
          return 1;
        }
        let aPerfs = a.bestPerfRecord?.great + a.bestPerfRecord?.good + a.bestPerfRecord?.bad + a.bestPerfRecord?.miss;
        let bPerfs = b.bestPerfRecord?.great + b.bestPerfRecord?.good + b.bestPerfRecord?.bad + b.bestPerfRecord?.miss;
        
        return sortOrder * (aPerfs - bPerfs);
        
      case 'Release date':
      case 'Song title':
      default:
        return (filtering(filter['sortType'], sortOrder, a, b));
    }
  });

  return filteredList;
};