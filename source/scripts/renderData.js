import {jobStatistic,allProvince,isSameProvince} from './processData.js';
import {getAllGraduatorData, getAllTeacherData, getAllOtherData} from './processData.js';

import {finalName} from './importXLSX.js';
import {finalData} from './importXLSX.js';


export default function() {
    var targetNode = $("#map-part");
    console.log("This is render()");


    var otherData = finalData.filter(getAllOtherData);
    $("#map-title").html(finalName);
    targetNode.append(renderTeacher(finalData));
    targetNode.append(renderOther(finalData));

    isSameProvince.forEach(renderGraduator);
    //console.log(graduatorData);
    //console.log(teacherData);
    console.log(otherData);

    function g(el){ return document.getElementsByClassName(el);}
    var icons = g('student-data-style');
    var instace = false; //存放当前移动对象信息
    for(var i =0 ; i<icons.length ; i++){
        if(icons[i]) {
            icons[i].addEventListener('mousedown', function (e) {
                instace = {};
                var e = e || window.event;
                var el = e.toElement || e.target;
                console.log(e);
                instace.moveElement = el;
                //  获取鼠标的坐标
                var mouseX = e.pageX;
                var mouseY = e.pageY;
                //  获取元素左上角的坐标
                var elX = el.offsetLeft;
                var elY = el.offsetTop;
                //  计算出偏移量
                instace.offSetX = mouseX - elX;
                instace.offSetY = mouseY - elY;
                instace.moveElement.style.zIndex = 100;
            });
        }
    }
    document.onmouseup = function(e){
        instace.moveElement.style.zIndex = 2;
        instace = false;
    };
    document.onmousemove = function(e){
        if(instace){
            //  获取当前鼠标坐标
            var mouseX = e.pageX;
            var mouseY = e.pageY;
            //  计算元素移动坐标
            var moveX = mouseX - instace.offSetX;
            var moveY = mouseY - instace.offSetY;
            //  计算最大移动坐标
            var maxX = document.documentElement.clientWidth  - instace.moveElement.offsetWidth;
            var maxY = document.documentElement.clientHeight - instace.moveElement.offsetHeight;
            //  设置元素的坐标
            instace.moveElement.style.left = Math.max(0,Math.min(maxX,moveX)) + 'px';
            instace.moveElement.style.top  = Math.max(0,Math.min(maxY,moveY)) + 'px';
        }
    };
}



/*inSameProvince = [
{
    name:"shanghai",
    student:[],
}
*/
function renderGraduator(element) {
    var targetNode = $("#map-part");
    var divToInsert = document.createElement("div");
    var titleContainer = document.createElement("p");
    divToInsert.appendChild(titleContainer);
    titleContainer.className += 'location-title';
    var titleToInsert = document.createTextNode(element.name);
    titleContainer.append(titleToInsert);
    var studentNum = element.graduator.length;
    var studentInSameProvinceData = [];
    console.log("dddd"+studentNum);
    for (let i = 0; i < studentNum; i++) {
        studentInSameProvinceData.push(finalData[element.graduator[i]]);
    }
    console.log(studentInSameProvinceData);
    renderProvinceData(studentInSameProvinceData,divToInsert);
   // element.graduator.forEach(renderListData);
    targetNode.append(divToInsert);

}

function renderProvinceData(studentData,divToInsert) {   //将渲染出来的数据都append进div中
    divToInsert.className += ' display-style';
    divToInsert.className += ' student-data-style ';
    divToInsert.setAttribute("location",studentData[0].location);
    studentData.forEach(function(element) {
        var stringToInsert = document.createElement("p");
        stringToInsert.className += ' no-margin ';
        if (element.name.length === 2) {
            stringToInsert.innerHTML = element.name+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+element.school;
        } else {
            stringToInsert.innerHTML = element.name+'&nbsp;&nbsp;'+element.school;
        }
        divToInsert.appendChild(stringToInsert);
    });
    return divToInsert;
/*    var teacherDiv = document.createElement("div");
    teacherDiv.setAttribute('city','teacher');

    teacherDiv.className += ' display-style ';
    teacherDiv.className += ' teacher-data-style ';
    teacherData.forEach(function(element) {
        var stringToInsert = document.createElement("p");
        stringToInsert.className += ' no-margin ';
        if (element.name.length === 2) {
            var textToInsert = document.createTextNode(element.name+'  '+element.school);
        } else {
            var textToInsert = document.createTextNode(element.name+'   '+element.school);
        }
        stringToInsert.appendChild(textToInsert);
        teacherDiv.appendChild(stringToInsert);
    });
    return teacherDiv;
    */
}


function renderListData(element) {
    var stringToInsert = document.createElement("p");
    var studentNum = element.length;
    var studentInSameProvinceData = [];
    for (let i = 0; i < studentNum; i++) {
        studentInSameProvinceData.push(finalData[element[i]]);
    }

   // var textToInsert = document.createTextNode(element.name+' '+element.school);

}

function renderTeacher(finalData) {
    var teacherData = finalData.filter(getAllTeacherData);
    var teacherDiv = document.createElement("div");
    teacherDiv.setAttribute('city','teacher');

    teacherDiv.className += ' display-style ';
    teacherDiv.className += ' teacher-data-style ';
    teacherData.forEach(function(element) {
        var stringToInsert = document.createElement("p");
        stringToInsert.className += ' no-margin ';
        if (element.name.length === 2) {
            stringToInsert.innerHTML = element.name+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+element.school;
        } else {
            stringToInsert.innerHTML = element.name+'&nbsp;&nbsp;'+element.school;
        }
        teacherDiv.appendChild(stringToInsert);
    });
    return teacherDiv;
}

function renderOther(finalData) {
    var otherData = finalData.filter(getAllOtherData);
    var otherDiv = document.createElement("div");
    otherDiv.setAttribute('city','other');

    otherDiv.className += ' display-style ';
    otherDiv.className += ' other-data-style';
    otherData.forEach(function(element) {
        var stringToInsert = document.createElement('p');
        stringToInsert.className += ' no-margin ';
        if (element.name.length === 2) {
            stringToInsert.innerHTML = element.name+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+element.school;
        } else {
            stringToInsert.innerHTML = element.name+'&nbsp;&nbsp;'+element.school;
        }
        otherDiv.appendChild(stringToInsert);
    });
    return otherDiv;


}

