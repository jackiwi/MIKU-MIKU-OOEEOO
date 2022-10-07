import songList from '@/../public/data/songs.json';
import checkOverlap from '@/composables/checkOverlap.js';

const getAllSongsFiltered = (filter) => {

  var filteredList = songList.filter(i => {
    return checkOverlap(i['Unit(s)'], filter['focusUnit']);
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

export default getAllSongsFiltered;