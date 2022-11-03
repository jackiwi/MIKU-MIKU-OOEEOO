import { getBestRecordsDB, batchUpdate, batchAdd, getAllRecordsDB } from '@/firebase.js';

let allRecords = null;
let bestPerfRecords = null;
let bestCBRecords = null;
let bestPerfRecords_NoPL = null;
let bestCBRecords_NoPL = null;
let recordsToUpdate = null;
let newBestRecords = null;
let newRecords = null;

const csvToJson = (text, headers, quoteChar = '"', delimiter = ',') => {
  const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');

  const match = (line) => [...line.matchAll(regex)]
    .map(m => m[2])
    .slice(0, -1); //https://stackoverflow.com/questions/59218548/

  const lines = text.split('\n');
  const heads = headers ?? match(lines.shift());

  return lines.map(line => {
    return match(line).reduce((acc, cur, i) => {
      const val = cur.length <= 0 ? null : Number(cur) || cur;
      const key = heads[i] ?? `extra_${i}`;
      return  { ...acc, [key]: val };
    }, {});
  });
}

const mapJson = (userUID, json, headers) => {
  return (json.map(i => {
    return {
      songID: i[headers.songID] ?? i.songID,
      date: i[headers.date] ?? i.date,
      difficulty: i[headers.difficulty] ?? i.difficulty ?? 'master',
      great: i[headers.great] ?? i.great ?? 0,
      good: i[headers.good] ?? i.good ?? 0,
      bad: i[headers.bad] ?? i.bad ?? 0,
      miss: i[headers.miss] ?? i.miss ?? 0,
      imageLink: i[headers.imageLink] ?? i.imageLink,
      noPL: (i[headers.noPL] ?? i.noPL ?? false) ? true : false,
      'userUID': userUID
    }
  })).map(i => {
    return {
      ...i,
      nonperfs: i.great + i.good + i.bad + i.miss,
      breaks: i.good + i.bad + i.miss
    }
  }).filter(i => {
    return i.songID;
  });
}

const parseJson = (json) => {
  const songIDs = [ ...new Set(json.map(i => { return i.songID; })) ]; 
  const songDifficulties = [ ...new Set(json.map(i => { return i.difficulty; })) ]; 

  songIDs.forEach((id) => {
    if (!id) { return; }
    songDifficulties.forEach((diff) => {
      //group by song id and diff, then sort, then compare, then batch add
      let songDiffGroup = json.filter(i => { return i.difficulty == diff && i.songID == id; });

      if (songDiffGroup.length){
        parseSongRecords(id, diff, songDiffGroup);
      }
      
    });
  });
}

const compareRecFunction = (a, b, compAttr) => {
  if (a[compAttr] == b[compAttr]){
    if (a.noPL == b.noPL){
      return (new Date(b['date'] - new Date(a['date'])));
    }
    if (!a.noPL && b.noPL){
      return 1;
    }
    return -1;
  }
  return a[compAttr] - b[compAttr];
}

const parseSongRecords = (songID, diff, songDiffGroup) => {
  //get bestPerf bestCB bestPerf_NoPL bestCB_NoPL
  let bestPerf = songDiffGroup.sort((a,b) => { return compareRecFunction(a, b, 'nonperfs'); })[0];
  let bestCB = songDiffGroup.sort((a,b) => { return compareRecFunction(a, b, 'breaks'); })[0];
  let bestPerf_NoPL = songDiffGroup.filter((i) => { return i.noPL; }).sort((a,b) => { return compareRecFunction(a, b, 'nonperfs'); })[0];
  let bestCB_NoPL = songDiffGroup.filter((i) => { return i.noPL; }).sort((a,b) => { return compareRecFunction(a, b, 'breaks'); })[0];

  //push all other records to newRecords
  songDiffGroup.forEach(i => {
    if (i != bestPerf && i != bestCB && i != bestPerf_NoPL && i != bestCB_NoPL && !isInDB(i)){
      newRecords.push(i);
    }
  });

  let currentBestPerf = bestPerfRecords?.filter(i => { return i.songID == songID && i.difficulty == diff; })[0];
  let currentBestPerf_NoPL = bestPerfRecords_NoPL?.filter(i => { return i.songID == songID && i.difficulty == diff; })[0];
  let currentBestCB = bestCBRecords?.filter(i => { return i.songID == songID && i.difficulty == diff; })[0];
  let currentBestCB_NoPL = bestCBRecords_NoPL?.filter(i => { return i.songID == songID && i.difficulty == diff; })[0];

  //compare best to whatever's already in DB
  compareRecords(bestPerf, currentBestPerf, 'ap');
  compareRecords(bestPerf_NoPL, currentBestPerf_NoPL, 'ap', true);
  compareRecords(bestCB, currentBestCB, 'fc');
  compareRecords(bestCB_NoPL, currentBestCB_NoPL, 'fc', true);
}

const compareRecords = (newRec, currentRec, trackerMode, noPL = false) => {
  if (!newRec) { return; }
  if (isInDB(newRec)) { return; }

  let compAttr = 'nonperfs', bestAttr = 'bestPerf';
  if (trackerMode == 'fc') { compAttr = 'breaks'; bestAttr = 'bestCB'; }
  if (noPL) { bestAttr += '_NoPL'; }

  if (currentRec){
    currentRec[compAttr] = currentRec.good + currentRec.bad + currentRec.miss;
    if (trackerMode == 'ap') { currentRec[compAttr] += currentRec.great; }  
  }

  if (!currentRec
        || newRec[compAttr] < currentRec[compAttr]
        || (newRec[compAttr] == currentRec[compAttr] && (!currentRec.noPL || newRec.noPL))){
    newRec[bestAttr] = true;
    if (currentRec){
      recordsToUpdate.push({
        'currentRec': currentRec,
        'bestAttr': bestAttr
      });
    }
    newBestRecords.push(newRec);  
  }else {
    newRecords.push(newRec);
  }
}

//https://stackoverflow.com/questions/55523596
const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));

const isInDB = (newRec) => {
  let rec = allRecords.filter(i => {
    return (i.imageLink && i.imageLink == newRec.imageLink)
      || (i.songID == newRec.songID
          && i.date == newRec.date
          && i.great == newRec.great
          && i.good == newRec.good
          && i.bad == newRec.bad
          && i.miss == newRec.miss
          && i.noPL == newRec.noPL
          );
  })[0];
  if (rec) { return true; }
  return false;
}

export const processCSV = async (userUID, file, headers) => {
  allRecords = await getAllRecordsDB(userUID);
  bestPerfRecords = await getBestRecordsDB(userUID, 'ap');
  bestCBRecords = await getBestRecordsDB(userUID, 'fc');
  bestPerfRecords_NoPL = await getBestRecordsDB(userUID, 'ap', true);
  bestCBRecords_NoPL = await getBestRecordsDB(userUID, 'fc', true);
  recordsToUpdate = [];
  newBestRecords = [];
  newRecords = [];

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
  
    reader.onload = (event) => {
      let csv = event.target.result;
      let json = mapJson(userUID, csvToJson(csv), headers);
  
      parseJson(json);
  
      const recsToUpdate = recordsToUpdate;
      const newBestRecs = uniqueArray(newBestRecords);
      const newRecs = uniqueArray(newRecords);
  
      const res = {
        'recsToUpdate': recsToUpdate,
        'newBestRecs': newBestRecs,
        'newRecs': newRecs
      };  
      resolve(res);
    }

    reader.onerror = (event) => {
      reject(event);
    }

    reader.readAsText(file, "UTF-8");
  });
}

export const importData = async (userUID, recsToUpdate, newBestRecs, newRecs) => {
  const timestamp = Date.now().toString();

  await batchUpdate(userUID, recsToUpdate, newBestRecs, (timestamp + "i_"));

  //now add the rest of the records
  await batchAdd(userUID, newRecs, (timestamp + "a_"));

}