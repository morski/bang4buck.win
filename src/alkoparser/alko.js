var https = require('https');
var fs = require('fs');
var xlsx = require('xlsx');
var db = require("./db");

//Download alko prices as xlsx file
var file = fs.createWriteStream("alko.xlsx");
var request = https.get("https://www.alko.fi/INTERSHOP/static/WFS/Alko-OnlineShop-Site/-/Alko-OnlineShop/fi_FI/Alkon%20Hinnasto%20Tekstitiedostona/alkon-hinnasto-tekstitiedostona.xlsx", function(response) {
  response.pipe(file);
});

const characterizationList = [];
const grapeList = [];

file.on('finish', async () => {
    //Read excel file and remove 3 first rows that contains non trivial data
    var filename = 'alko.xlsx'
    var workbook = xlsx.readFile(filename);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    delete_row(worksheet, 2);
    delete_row(worksheet, 1);
    delete_row(worksheet, 0);
    //Create JSON of excel file. Use current first row as keys
    var alkoJson = xlsx.utils.sheet_to_json(worksheet,{defval:""});
    parseJson(alkoJson);
    //Save json to file
    var jString = JSON.stringify(alkoJson);
    fs.writeFile("alko.json",jString,function(err){
        if(err) console.log("Error creating alko.json - " + err);
    });
    const grapes = await db.addOrUpdateCharacterizationsOrGrapes(grapeList, "grapes", "name");
    const char = await db.addOrUpdateCharacterizationsOrGrapes(characterizationList, "characterizations", "characterization")

    addIdsToProducts(alkoJson, grapes, char);
    console.log(alkoJson[0]);
    const productIdsAndNumbers = await db.updateOrAddProducts(alkoJson);

    for (const prod of alkoJson) {
        await db.addOrUpdateCharacterizationsOrGrapesForProducts(prod, productIdsAndNumbers);
    };
    

    //db.closePool();
});

const addIdsToProducts = (json, grapes, char) => {
    json.forEach(product => {
        if (product.grapes) {
            product.grapeIds = grapes.filter(value => -1 !== product.grapes.indexOf(value.name)).map(x => x.id);
        }

        if (product.characterizations) {
            product.characterizationIds = char.filter(value => -1 !== product.characterizations.indexOf(value.characterization)).map(x => x.id);
        }
    });
}

const parseJson = (json) => {
    json.forEach(product => {
        if (product["Tyyppi"] == "lahja- ja juomatarvikkeet") return;
        product["Pullokoko"] = parseFloat(product["Pullokoko"].replace(" l", "").replace(',', '.')).toFixed(2) * 100;
        const characterizations = product["Luonnehdinta"];
        const grapes = product["Rypäleet"];

        if (grapes) {
            product.grapes = getUniqueItems(product, grapes, grapeList);
        }

        if (characterizations) {
            product.characterizations = getUniqueItems(product, characterizations, characterizationList);
        }
    });
}

const getUniqueItems = (product, items, finalList) => {
    const itemsSplitted = items.split(/[.,]/);
    const productList = [];
    itemsSplitted.forEach(item => {
        const formattedItem = item.trim().toLowerCase();
        if (formattedItem.replace(/\s/g, '').length) {
            productList.push(formattedItem);
            if (!finalList.includes(formattedItem)) {
                finalList.push(formattedItem);
            }
        }
    });
    return productList;
}

//Row deletion function - Thanks to ksumrall and edohkodjo (https://github.com/SheetJS/js-xlsx/issues/352)
function ec(r, c){
    return xlsx.utils.encode_cell({r:r,c:c});
}

function delete_row(ws, row_index){
    var variable = xlsx.utils.decode_range(ws["!ref"])
    for(var R = row_index; R < variable.e.r; ++R){
        for(var C = variable.s.c; C <= variable.e.c; ++C){
            ws[ec(R,C)] = ws[ec(R+1,C)];
        }
    }
    variable.e.r--;
    ws['!ref'] = xlsx.utils.encode_range(variable.s, variable.e);
}