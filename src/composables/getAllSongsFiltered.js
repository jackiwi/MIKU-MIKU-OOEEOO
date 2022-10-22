import songList from '@/../public/data/songs.json';
import checkOverlap from '@/composables/checkOverlap.js';
import { getBestRecordsDB } from '@/firebase.js';

export const getAllSongsFiltered = (filter) => {

  let filteredList = songList.filter(i => {
    return (
      checkOverlap(i['Unit(s)'], filter['focusUnit'])
      && i['Song title'].toLowerCase().includes(filter['searchTerm'].toLowerCase())
    );
  }).sort((a,b) => {
    if (filter['sortType'] == 'Release date'){
      if (filter['sortOrder'] == 'asc'){
        return new Date(a[filter['sortType']]) - new Date(b[filter['sortType']]);
      }else{
        return new Date(b[filter['sortType']]) - new Date(a[filter['sortType']]);
      }
    }
    if (filter['sortType'] == 'Song title'){
      var num = 0;
      if (a[filter['sortType']] < b[filter['sortType']]){
        num = -1;
      }else if (a[filter['sortType']] > b[filter['sortType']]){
        num = 1;
      }
      if (filter['sortOrder'] == 'asc'){
        return num;
      }else{
        return num*-1;
      }
    }
    if (filter['sortOrder'] == 'asc'){
      return a[filter['sortType']] - b[filter['sortType']];
    }else{
      return b[filter['sortType']] - a[filter['sortType']];
    }
  });

  return filteredList;
};


export const getAllSongsFiltered1 = async (filter, userUID) => {
  if (!userUID){
    return getAllSongsFiltered(filter);
  }
  const bestRecords = await getBestRecordsDB(userUID);
  
  let filteredList = songList.filter(i => {
    return (
      checkOverlap(i['Unit(s)'], filter['focusUnit'])
      && i['Song title'].toLowerCase().includes(filter['searchTerm'].toLowerCase())
    );
  }).map(i => {
    return { ...i, 'bestRecord': bestRecords?.filter(j => j.songID == i.ID && j.difficulty == filter['songDifficulty'].toLowerCase())[0] };
  }).sort((a,b) => {
    if (filter['sortType'] == 'Release date'){
      if (filter['sortOrder'] == 'asc'){
        return new Date(a[filter['sortType']]) - new Date(b[filter['sortType']]);
      }else{
        return new Date(b[filter['sortType']]) - new Date(a[filter['sortType']]);
      }
    }
    if (filter['sortType'] == 'Song title'){
      var num = 0;
      if (a[filter['sortType']] < b[filter['sortType']]){
        num = -1;
      }else if (a[filter['sortType']] > b[filter['sortType']]){
        num = 1;
      }
      if (filter['sortOrder'] == 'asc'){
        return num;
      }else{
        return num*-1;
      }
    }
    if (filter['sortType'] == 'nonperfs'){
      if (filter['sortOrder'] == 'asc'){
        return a.bestRecord?.nonperfs - b.bestRecord?.nonperfs;
      }else{
        return b.bestRecord?.nonperfs - a.bestRecord?.nonperfs;
      }
    }
    if (filter['sortOrder'] == 'asc'){
      return a[filter['sortType']] - b[filter['sortType']];
    }else{
      return b[filter['sortType']] - a[filter['sortType']];
    }
  });

  return filteredList;
};