const { readFileSync, writeFileSync } = require("fs");

const tempSheet = readFileSync('@/../public/data/temp.json');

function getRecords(){
  var objArray = JSON.parse(tempSheet);
  var returnArray = [];
  var index = 0;
  objArray.forEach( (obj) => {
    index++;
    var newJsonObj = {};
    newJsonObj['ID'] = index;
    newJsonObj['Song ID'] = obj['songId']
    newJsonObj['Difficulty'] = 'Master'
    newJsonObj['noPL'] = (obj['noPl'] ? true : false)
    newJsonObj['Date'] = obj['date'].substring(0,10)
    newJsonObj['Image link'] = obj['screenie']
    newJsonObj['Nonperfs'] = (obj['nonperfs'] ?? 0)
    newJsonObj['Great'] = (obj['great'] ?? 0)
    newJsonObj['Good'] = (obj['good'] ?? 0)
    newJsonObj['Bad'] = (obj['bad'] ?? 0)
    newJsonObj['Miss'] = (obj['miss'] ?? 0)

    returnArray.push(newJsonObj);
  })

  writeFileSync("@/../public/data/records.json",JSON.stringify(returnArray));
}

function getBestRecords(){
  var bestRecords = [];

  const records = JSON.parse(readFileSync('@/../public/data/records.json'))

  for (var i = 1; i < 280; i++){
    var songRecords = records.filter((item) => {
      return item['Song ID'] == i;
    })

    var bestRecord = null;

    if (songRecords.length > 0){
      songRecords.forEach((record) => {
        if (!bestRecord || (record['Nonperfs'] <= bestRecord['Nonperfs'])){
          if (!bestRecord || (record['noPL'])){
            bestRecord = record;
            var recordId = record['ID']
            delete bestRecord['ID']
            bestRecord['Record ID'] = recordId
          }
        }
      })
    }
    if (bestRecord){
      bestRecords.push(bestRecord);
    }
  }

  writeFileSync("@/../public/data/bestRecords.json",JSON.stringify(bestRecords));
}

function main(){
  getRecords();

  getBestRecords();
}

main();