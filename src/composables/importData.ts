import { batchUpdate, batchAdd } from '@/firebase';
import { filterBest } from '@/composables/filterBest';

let allRecords : any = null;
let bestPerfRecords : any = null;
let bestCBRecords : any = null;
let bestPerfRecords_NoPL : any = null;
let bestCBRecords_NoPL : any = null;
let recordsToUpdate : any = null;
let newBestRecords : any = null;
let newRecords : any = null;

const csvToJson = (text:string, headers?:any, quoteChar = '"', delimiter = ',') => {
  const regex = new RegExp(`\\s*(${quoteChar})?(.*?)\\1\\s*(?:${delimiter}|$)`, 'gs');

  const match = (line:any) => [...line.matchAll(regex)]
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

const mapJson = (userUID:string, json:any, headers:any) => {
  return (json.map((i:any) => {
    return {
      songID: i[headers.songID] ?? i.songID,
      date: i[headers.date] ?? i.date,
      difficulty: i[headers.difficulty] ?? i.difficulty ?? 'master',
      great: i[headers.great] ? parseInt(i[headers.great]) : i.great ? parseInt(i.great) : 0,
      good: i[headers.good] ? parseInt(i[headers.good]) : i.good ? parseInt(i.good) : 0,
      bad: i[headers.bad] ? parseInt(i[headers.bad]) : i.bad ? parseInt(i.bad) : 0,
      miss: i[headers.miss] ? parseInt(i[headers.miss]) : i.miss ? parseInt(i.miss) : 0,
      imageLink: i[headers.imageLink] ?? i.imageLink,
      noPL: (i[headers.noPL] ?? i.noPL ?? false) ? true : false,
      'userUID': userUID
    }
  }))
  .map((i:any) => {
    return {
      ...i,
      nonperfs: i.great + i.good + i.bad + i.miss,
      breaks: i.good + i.bad + i.miss
    }
  })
  .filter((i:any) => {
    return i.songID;
  });
}

const parseJson = (json:any) => {
  const songIDs = [ ...new Set(json.map((i:any) => { return i.songID; })) ]; 
  const songDifficulties = [ ...new Set(json.map((i:any) => { return i.difficulty; })) ]; 

  songIDs.forEach((id) => {
    if (!id) { return; }
    songDifficulties.forEach((diff:any) => {
      //group by song id and diff, then sort, then compare, then batch add
      let songDiffGroup = json.filter((i:any) => { return i.difficulty == diff && i.songID == id; });

      if (songDiffGroup.length){
        parseSongRecords(id, diff, songDiffGroup);
      }
      
    });
  });
}

const compareRecFunction = (a:any, b:any, compAttr:string) => {
  if (a[compAttr] == b[compAttr]){
    if (a.noPL == b.noPL){
      return (new Date(b['date']).valueOf() - new Date(a['date']).valueOf());
    }
    if (!a.noPL && b.noPL){
      return 1;
    }
    return -1;
  }
  return a[compAttr] - b[compAttr];
}

const parseSongRecords = (songID:any, diff:string, songDiffGroup:any) => {
  //get bestPerf bestCB bestPerf_NoPL bestCB_NoPL
  let bestPerf = songDiffGroup.sort((a:any,b:any) => { return compareRecFunction(a, b, 'nonperfs'); })[0];
  let bestCB = songDiffGroup.sort((a:any,b:any) => { return compareRecFunction(a, b, 'breaks'); })[0];
  let bestPerf_NoPL = songDiffGroup.filter((i:any) => { return i.noPL; }).sort((a:any,b:any) => { return compareRecFunction(a, b, 'nonperfs'); })[0];
  let bestCB_NoPL = songDiffGroup.filter((i:any) => { return i.noPL; }).sort((a:any,b:any) => { return compareRecFunction(a, b, 'breaks'); })[0];

  //push all other records to newRecords
  songDiffGroup.forEach((i:any) => {
    if (i != bestPerf && i != bestCB && i != bestPerf_NoPL && i != bestCB_NoPL && !isInDB(i)){
      newRecords.push(i);
    }
  });

  let currentBestPerf = bestPerfRecords?.filter((i:any) => { return i.songID == songID && i.difficulty == diff; })[0];
  let currentBestPerf_NoPL = bestPerfRecords_NoPL?.filter((i:any) => { return i.songID == songID && i.difficulty == diff; })[0];
  let currentBestCB = bestCBRecords?.filter((i:any) => { return i.songID == songID && i.difficulty == diff; })[0];
  let currentBestCB_NoPL = bestCBRecords_NoPL?.filter((i:any) => { return i.songID == songID && i.difficulty == diff; })[0];

  //compare best to whatever's already in DB
  compareRecords(bestPerf, currentBestPerf, 'ap');
  compareRecords(bestPerf_NoPL, currentBestPerf_NoPL, 'ap', true);
  compareRecords(bestCB, currentBestCB, 'fc');
  compareRecords(bestCB_NoPL, currentBestCB_NoPL, 'fc', true);
}

const compareRecords = (newRec:any, currentRec:any, trackerMode:string, noPL = false) => {
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
const uniqueArray = (a:any) => [...new Set<any>(a.map((o:any) => JSON.stringify(o)))].map((s:any) => JSON.parse(s));

const isInDB = (newRec:any) => {
  let rec = allRecords.filter((i:any) => {
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

export const processCSV = async (userUID:string, file:any, headers:any, allRecordsDB:any) => {
  allRecords = allRecordsDB;
  bestPerfRecords = filterBest(allRecordsDB, 'ap');
  bestCBRecords = filterBest(allRecordsDB, 'fc');
  bestPerfRecords_NoPL = filterBest(allRecordsDB, 'ap', true);
  bestCBRecords_NoPL = filterBest(allRecordsDB, 'fc', true);
  recordsToUpdate = [];
  newBestRecords = [];
  newRecords = [];

  return new Promise((resolve, reject) => {
    let reader = new FileReader();
  
    reader.onload = (event) => {
      let csv = event.target?.result as string;
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

export const importData = async (userUID:string, recsToUpdate:any, newBestRecs:any, newRecs:any) => {
  const timestamp = Date.now().toString();

  await batchUpdate(userUID, recsToUpdate, newBestRecs, (timestamp + "i_"));

  //now add the rest of the records
  await batchAdd(userUID, newRecs, (timestamp + "a_"));

}