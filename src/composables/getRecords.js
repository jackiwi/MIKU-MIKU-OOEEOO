import recordList from '@/../public/data/records.json';

const getRecords = (songID) => {
  return recordList.filter((i) => i.songID == songID);
}

export default getRecords;