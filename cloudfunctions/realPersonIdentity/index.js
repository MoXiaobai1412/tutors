// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event,context) => {
  let school = null
  const n =Math.floor(Math.random() * 30) + 1
  switch(n) {
    case 1:
    case 2:
    case 3: school = "华南理工大学";break;
    case 4: 
    case 5: school = "中山大学";break;
    case 6: school = "中央民族大学";break;
    case 7: school = "重庆大学";break;
    case 8: school = "中南大学";break;
    case 9: school = "中国人民大学";break;
    case 10: school = "中国科学技术大学";break;
    case 11: school = "中国海洋大学";break;
    case 12: school = "浙江大学";break;
    case 13: school = "西北农林科技大学";break;
    case 14: school = "西北工业大学";break;
    case 15: school = "武汉大学";break;
    case 16: school = "同济大学";break;
    case 17: school = "天津大学";break;
    case 18: school = "四川大学";break;
    case 19: school = "上海交通大学";break;
    case 20: school = "山东大学";break;
    case 21: school = "厦门大学";break;
    case 22: school = "清华大学";break;
    case 23: school = "吉林大学";break;
    case 24: school = "华中科技大学";break;
    case 25: school = "国防科技大学";break;
    case 26: school = "东南大学";break;
    case 27: school = "东北大学";break;
    case 28: school = "大连理工大学";break;
    case 29: school = "北京理工大学";break;
    case 30: school = "北京航空航天大学";break;
  } 
  const fileID = `cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/identityLogo/${school}.jpg`
  console.log([school,fileID])

  return {
    schoolName:school,
    fileID:fileID
  }
}