const axios = require("axios");
const { html2json } = require("html2json");
const { writeFileSync } = require("fs");

const url = "https://www.sekaipedia.org/w/api.php";

const params = {
  action: "parse",
  format: "json",
  title: "Database:Cards",
  prop: "text",
  text: `{{Card datatable
    |characters = 
    |units = 
    |support units = 
    |attributes = 
    |rarities = 
    |statuses = 
    |acquire = 
    |skills = 
    |released after = 
    |released before = 
    |columns = id,character,unit,support unit,attribute,rarity,date,status,skill,event
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
      return iChild.attr.href;
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
          return i.child.map(j => rowHandler(j));
        }
        return rowHandler(i.child[0]);
      }
      return rowHandler(i);
    });
    return values;
  }).filter(i => i);

  var flatTbl = [];
  var associatedEvent = null;
  var eventId = 0;

  rowValues.forEach((row) => {
    var jsonRow = {};
    for (var i = 0; i < colHeaders.length; i++){
      jsonRow[colHeaders[i]] = row[i];
    }
    if (jsonRow['Associated event']){
      var cardEvent = jsonRow['Associated event'].toLowerCase().replace(/([^a-z])+/g,'').trim();
      if (cardEvent != associatedEvent){
        eventId++;
        associatedEvent = cardEvent;

      }
      jsonRow['Event ID'] = eventId.toString();
    }
    else{
      jsonRow['Event ID'] = null;
    }
    flatTbl.push(jsonRow);
  });

  writeFileSync("./public/data/cards.json",JSON.stringify(flatTbl));

}

main();