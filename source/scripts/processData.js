//用于获取所有录取学校的省份
/* locationOfSchool =
 */

//获取非老师、非毕业、毕业学生的数组序号
/* jobStatistic = {
    teacher: [1,2],
    graduation: [5,6,7],
    other: [4]
}
 */
//将在同一个省份的学生放进一个数组
/* inSameProvince = [
    {
        name: "shanghai",
        student: [];
     }
]*/

import {finalData} from './importXLSX.js';
import render from './renderData.js';
export function processData() {
    var allData = finalData.concat();
    allData.forEach(pushJobStatistic);
    //只获取毕业生（非出国）的省份
    var graduatorData = allData.filter(getAllGraduatorData);
    //console.log("下面是毕业生的信息");
    //console.log(graduatorData);
    graduatorData.forEach(getAllGraduatorProvince);
    //console.log("所有的省份为："+allProvince);
    allData.forEach(pushSameProvince);
    //console.log("同一个省份的学生的编号");
    //console.log(isSameProvince);
    //console.log("老师的编号"+jobStatistic.teacher);
    //console.log("毕业生的编号"+jobStatistic.graduator);
    //console.log("其他学生的编号"+jobStatistic.other);
    render();

};
export var jobStatistic = {
    teacher: [],
    graduator: [],
    other: [],
};
function pushJobStatistic(element,index) {
    switch (element.job) {
        case "教师": jobStatistic.teacher.push(index);
            break;
        case "毕业": jobStatistic.graduator.push(index);
            break;
        default: jobStatistic.other.push(index);
    }
}

export var allProvince = [];
export var isSameProvince = [];

function getAllGraduatorProvince(element,index) {
    var newProvinceData = {};
    if (allProvince.indexOf(element.location) < 0) {
        allProvince.push(element.location);
        newProvinceData.name = element.location;
        newProvinceData.graduator = [];
        isSameProvince.push(newProvinceData);
    }
}
/*
module.exports = {
    getAllGraduatorData: getAllGraduatorData,
    getAllTeacherData: getAllTeacherData,
    getAllOtherData: getAllOtherData,

}
*/

export function getAllGraduatorData(element,index) {
    return (jobStatistic.graduator.indexOf(index) >= 0);
}
export function getAllTeacherData(element, index) {
    return (jobStatistic.teacher.indexOf(index) >= 0);
}
export function getAllOtherData(element, index) {
    return (jobStatistic.other.indexOf(index) >= 0);
}

function pushSameProvince(element, index) {  //获得的是所有人的数据
    if (jobStatistic.graduator.indexOf(index) >= 0) {
        var length = isSameProvince.length;
        for (let i = 0; i < length; i++) {
            if (element.location === isSameProvince[i].name) {
                isSameProvince[i].graduator.push(index);
            }
        }
    }
}





