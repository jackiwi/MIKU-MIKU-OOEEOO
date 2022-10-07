const axios = require("axios");
const {html2json} = require("html2json");
const {writeFileSync} = require("fs");

const url = "https://www.sekaipedia.org/wiki/List_of_events";

function rowHandler(iChild){
  if (iChild.text && iChild.text.trim()){
    return iChild.text.trim();
  }
  if (iChild.attr){
    if (iChild.attr.href){
      if (iChild.attr.title){
        return iChild.attr.href;
      }
      if (iChild.child && iChild.child[0].attr && iChild.child[0].attr.src){
        return iChild.child[0].attr.src;
      }
    }
  }
  return;
}

function tableHandler(table){
  const rowValues = table.map((tr,index) => {
    if (index === 0){
      return;
    }
    const values = tr.child.map(i => {
      if (i.child){
        if (i.child.length > 1){
          if (i.child.length === 2){
            return rowHandler(i.child[1]);
          }
          return i.child.map(j => rowHandler(j)).filter(i => i);
        }
        return rowHandler(i.child[0]);
      }
      return rowHandler(i);
    }).filter(i => i);
    return values;
  }).filter(i => i);

  return rowValues;
}

async function main(){
  const res = await axios.default.get(url);

  const jsonRes = html2json(res.data);

  const body = jsonRes.child[0].child[3].child[3].child[5].child[3].child[0].child;
  var colHeaders = null;

  const rowValues = body.map((element, index) => {
    if (index === 0){
      return;
    }
    if (element.child){
      if (element.child[1].tag === 'table') {
        const sectionTable = element.child[1].child[0].child;
        if (!colHeaders){
          colHeaders = sectionTable[0].child.map(i => i.child[0].text);
        }
        return tableHandler(sectionTable);
      }
      return;
    }
    return;
  }).filter(i => i);

  var flatTbl = [];

  rowValues.forEach((tbl) => {
    tbl.forEach((row) => {
      var jsonRow = {};
      for (var i = 0; i < colHeaders.length; i++){
        if (colHeaders[i] == "Event"){
          var eventName = decodeURIComponent(row[i]).substring(6).replaceAll('_',' ').trim();
          jsonRow["Event Name"] = eventName;
        }
        else if (colHeaders[i] == "Bonus characters"){
          const bonusChars = [];
          row[i].forEach((character) => {
            character = character.substring(6).replaceAll('_',' ');
            bonusChars.push(character);
          });
          jsonRow[colHeaders[i]] = bonusChars;
          continue;
        }
        jsonRow[colHeaders[i]] = row[i];
      }
      flatTbl.push(jsonRow);
    });
  });

  writeFileSync("./public/data/events.json",JSON.stringify(flatTbl));

}

main();