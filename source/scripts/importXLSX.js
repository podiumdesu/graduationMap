/*
 FileReader共有4种读取方法：
 1.readAsArrayBuffer(file)：将文件读取为ArrayBuffer。
 2.readAsBinaryString(file)：将文件读取为二进制字符串
 3.readAsDataURL(file)：将文件读取为Data URL
 4.readAsText(file, [encoding])：将文件读取为文本，encoding缺省值为'UTF-8'
 */

import {processData} from './processData.js';

var upload=document.getElementById('uploadXLSX');
export var finalName;
var finalWorkBook;
var finalWorkSheet;

function process_data(wb){
    finalWorkBook = wb;
    var firstSheetName = wb.SheetNames[0];
    finalWorkSheet = wb.Sheets[firstSheetName];
    finalName = finalWorkSheet['A1'].v;
    console.log("The name of the sheet is "+finalName);
    console.log("The data of the sheet is:");
    finalData = XLSX.utils.sheet_to_json(finalWorkSheet , {header:["name","job","school","location"],range:2});
    console.log(finalData);
    processData();
}
function handleFile(e) {
    var f = e.target.files[0];
    var reader = new FileReader();    //读取文件
    var name = f.name;
    console.log(name+' is being read!');
    reader.onload = function(e){
        //alert("onload ok!");
        var data = e.target.result;
        //console.log(data);
        var wb = XLSX.read(data,{type:'binary'});
        //console.log(wb);
        process_data(wb);   //处理数据
    }
    reader.readAsBinaryString(f);
}
if(upload.addEventListener) {
    upload.addEventListener('change', handleFile, false);
}

export var finalData;
