const axios = require("axios");
const {html2json} = require("html2json");
const {writeFileSync} = require("fs");

const url = "https://www.sekaipedia.org/w/api.php";
const params = {
  action: "parse",
  format: "json",
  title: "Database:Songs",
  prop: "text",
  text: `{{Song datatable
    |units = 
    |3d mv =  
    |2d mv =  
    |original mv =  
    |commissioned =  
    |released after = 
    |released before = 
    |easy diff = 
    |normal diff = 
    |hard diff = 
    |expert diff = 
    |master diff = 
    |columns = producer,unit,bpm,duration,date,commissioned,3d mv,2d mv,original mv,easy diff,normal diff,hard diff,expert diff,master diff,easy notes,normal notes,hard notes,expert notes,master notes
    }}`,
  maxage: 3600,
  smaxage: 3600
};

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
    return;
  }

  return null;
}

async function main(){
  const res = await axios.default.get(url,{params});

  const jsonRes = html2json(res.data.parse.text['*']);

  const table = jsonRes.child[0].child[0].child[0].child;
  const colHeaders = table[0].child.map(i => i.child[0].text);
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
    });
    return values;
  }).filter(i => i);

  var flatTbl = [];

  rowValues.forEach((row) => {
    var jsonRow = {};
    for (var i = 0; i < colHeaders.length; i++){
      if (colHeaders[i] == "Song name"){
        jsonRow['Song title'] = decodeURIComponent(row[i].substring(6)).replaceAll('_',' ');
      }
      else if (colHeaders[i] == "Jacket art"){
        jsonRow[colHeaders[i]] = row[i].replaceAll('64px','720px');
        continue;
      }
      jsonRow[colHeaders[i]] = row[i];
    }
    flatTbl.push(jsonRow);
  });

  writeFileSync("./public/data/songs.json",JSON.stringify(flatTbl));

}

main();