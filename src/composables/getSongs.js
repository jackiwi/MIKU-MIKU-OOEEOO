import songList from '@/../public/data/songs.json';

const getSongs = (pageNum, numEntries) => {
  var data = [];

  var i = 0;
  var index = (numEntries * pageNum);
  while (i < numEntries && songList[index]){
    data.push(songList[index]);
    i++;
    index++;
  }

  return data;
};

export default getSongs;