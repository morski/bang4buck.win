var https = require('https');
var fs = require('fs');
var xlsx = require('xlsx');

//Download alko prices as xls file
var file = fs.createWriteStream("alko.xls");
var request = https.get("https://www.alko.fi/INTERSHOP/static/WFS/Alko-OnlineShop-Site/-/Alko-OnlineShop/fi_FI/Alkon%20Hinnasto%20Tekstitiedostona/alkon-hinnasto-tekstitiedostona.xls", function(response) {
  response.pipe(file);
});

file.on('finish', function(){
    //Read excel file and remove 3 first rows that contains non trivial data
    var filename = 'alko.xls'
    var workbook = xlsx.readFile(filename);
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    delete_row(worksheet, 2);
    delete_row(worksheet, 1);
    delete_row(worksheet, 0);
    //Create JSON of excel file. Use current first row as keys
    var alkoJson = xlsx.utils.sheet_to_json(worksheet,{defval:""});

    //Save json to file
    var jString = JSON.stringify(alkoJson);
    fs.writeFile("alko.json",jString,function(err){
        if(err) console.log("Error creating alko.json - " + err);
    });
    
});

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