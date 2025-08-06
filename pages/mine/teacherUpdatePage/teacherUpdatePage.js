// pages/work/teacher-info/teacher-info.js
const QRlogo = '../../../pics/button/QRlogo.png'
Page({
  data: {
    
    db:null,
    code:null,
    _id:null,
  // 自我介绍    
    // 姓名
    teacherName:null,
    // 学校
    teacherSchool:"华南理工大学",
    schoolNamePlus:null,
    allSchool:[
      "华南理工大学",
      "中山大学", 
      "暨南大学",  
      "华南师范大学",  
      "清华大学",  
      "北京大学",  
      "浙江大学",  
      "复旦大学",  
      "上海交通大学",  
      "南京大学",  
      "中国科学技术大学",  
      "哈尔滨工业大学",
      "哈尔滨工业大学(深圳)",  
      "西安交通大学",  
      "华中科技大学",  
      "武汉大学",  
      "四川大学",  
      "电子科技大学",  
      "南开大学",  
      "天津大学",  
      "山东大学",  
      "中国海洋大学",  
      "中南大学",  
      "湖南大学",  
      "厦门大学",
      "其他"
    ],
    isChangingSchool:false,
    // 年级
    grade:{
      type:["本科生","研究生","博士生","高中生","其他"],
      grades:[["大一","大二","大三","大四"],["研一","研二","研三","其他"],["博士在读","博士后"],["高一","高二","高三","竞赛"]],
    },
    gradeType:null,
    gradeYear:null,
    otherGrade:null,
    // 大类
    group:null,
    groupLG:false,
    groupWS:false,
    groupQT:false,
    // 科目
    subjects:["数学","物理","英语","语文","化学","生物","政治","历史","地理","数竞","物竞","化竞","生竞","信竞","艺术"],
    choosenSubject:[],
    isSubjectChosen:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,],
    hasOtherSubject:false,
    otherSubject:null,
    // 地区
    region:["广东省","广州市","天河区"],
    // 自我介绍
    teacherDetails:null,
  // 薪资待遇
    // 待遇
    salary:null,
    salaryType:"h",
    salaryH:false,
    salaryD:false,
    salaryA:false,
    // 时间    
    allNum:["一","二","三","四","五","六","日"],
    weekDay:[false,false,false,false,false,false,false],
    timeNum:1,
    time0s:"06:00",
    time0e:"22:00",
    time1s:"06:00",
    time1e:"22:00",
    time2s:"06:00",
    time2e:"22:00",

    // 检查
    isInformationChecked:false,
    isWeekRight:true,
    isTimeRight:true,
    isGradeRight:true,
    isSubjectReady:true,
    isSalaryReady:true,
    isGroupRight:true,
    isSchoolRight:true,

  // 加载
    isUploading:false,
  },

  // 数据初始化
  // 加载函数
  onLoad(e){
    const code = wx.login({
      success: (res) => {
        this.setData({
          code:res.code
        })
      },
    })
    this.setData({
      db:wx.cloud.database(),
      _id:e.id
    })
    this.dataGet(e.id)
  },
  // 数据获取函数
  async dataGet(teacherId){
    this.data.db.collection('teacherInformation').where({
      _id:teacherId
    }).get({
      success:(e)=>{
        const data = e.data[0]
        // 年级同步到页面
        const gradeType = this.data.grade.type.indexOf(data.grade[0])
        this.setData({gradeType:gradeType})
        if(gradeType<4) {
          const gradeYear = this.data.grade.grades[gradeType].indexOf(data.grade[1])
          this.setData({gradeYear:gradeYear})
        }
        // 大类
        switch(data.group) {
          case "理工":this.setData({groupLG:true});break;
          case "文史":this.setData({groupWS:true});break;
          case "其他":this.setData({groupQT:true});break;
        }
        // 薪资单位
        switch(data.salary.type){
          case "h":this.setData({salaryH:true});break;
          case "d":this.setData({salaryD:true});break;
          case "a":this.setData({salaryA:true});break;
        }
        // 科目
        let isSubjectChosen = this.data.isSubjectChosen
        const subjects = data.subject
        const length = subjects.length
        for(let i=0;i<length;i++){
          isSubjectChosen[this.data.subjects.indexOf(subjects[i])]=true
        }
        // 其他同步到页面
        this.setData({
          // 姓名
          teacherName:data.name,
          // 学校
          teacherSchool:data.school,
          // 大类
          group:data.group,
          // 科目
          isSubjectChosen:isSubjectChosen,
          choosenSubject:data.subject,
          // 地区
          region:data.position,
          // 自我介绍
          teacherDetails:data.introduction,
        // 薪资待遇
          // 待遇
          salary:data.salary.amount.toString(),
          salaryType:data.salary.type,
          // 时间
          weekDay:data.time.week,
          timeNum:data.time.time.number,
          time0s:this.minutesSwitch(data.time.time.times[0]),
          time0e:this.minutesSwitch(data.time.time.times[1]),
          time1s:this.minutesSwitch(data.time.time.times[2]),
          time1e:this.minutesSwitch(data.time.time.times[3]),
          time2s:this.minutesSwitch(data.time.time.times[4]),
          time2e:this.minutesSwitch(data.time.time.times[5]),
        })
      }
    })
  },
  // 时间转置器
  minutesSwitch(minutes) {  
    // 计算小时数和分钟数  
    let hours = Math.floor(minutes / 60);  
    let mins = minutes % 60;  
  
    // 将小时数和分钟数格式化为两位数  
    hours = hours.toString().padStart(2, '0');  
    mins = mins.toString().padStart(2, '0');  
  
    // 返回格式化的字符串  
    return `${hours}:${mins}`;  
  },

  // 操作函数
  // 学校选择函数
  toChangeSchool(){
    this.setData({
      isChangingSchool:true
    })
  },
  changeSchool(e){
    this.setData({
      teacherSchool:e.currentTarget.dataset.schoolname,
      isChangingSchool:false
    })
  },
  // 年级选择函数
  toChangeGradeType(){
    wx.showActionSheet({
      itemList: this.data.grade.type,
      success:(e) => {
        this.setData({
          gradeType:e.tapIndex,
          gradeYear:null
        })
      }
    })
  },
  toChangeGradeYear(){
      wx.showActionSheet({
        itemList: this.data.grade.grades[this.data.gradeType],
        success:(e)=>{
          this.setData({
            gradeYear:e.tapIndex
          })
        }
      })
  },
  // 大类选择函数
  toChangeGroup(e){
    this.setData({
      group:e.detail.value
    })
  },
  // 科目操作函数
  toChooseSubject(e){
    const subjectChosen = e.detail.value
    const subjectAll = this.data.subjects
    let choseArray = []
    for(let i=0;i<subjectAll.length;i++){
      if(subjectChosen.includes(subjectAll[i])){
        choseArray.push(true)
      }else{
        choseArray.push(false)
      }
    }
    this.setData({
      choosenSubject:e.detail.value,
      isSubjectChosen:choseArray
    })
  },
  // 薪资操作函数
  toChangeSalaryType(e){
    this.setData({
      salaryType:e.detail.value
    })
  },
  // 时间操作函数
  toChangeWeek(e){
      const n = e.currentTarget.dataset.weekid
      const arr = this.data.weekDay
      arr[n] = !arr[n]
      this.setData({
        weekDay:arr
      })
  },
  toChangeTime(e){
    const timeid = e.target.dataset.timeid
    const time = e.detail.value
    if(timeid==="0s"){
      this.setData({
        time0s:time
      })
    }
    else if(timeid==="0e"){
      this.setData({
        time0e:time
      })
    }
    else if(timeid==="1s"){
      this.setData({
        time1s:time
      })
    }
    else if(timeid==="1e"){
      this.setData({
        time1e:time
      })
    }
    else if(timeid==="2s"){
      this.setData({
        time2s:time
      })
    }
    else{
      this.setData({
        time2e:time
      })
    }
  },
  toPushTime(){
    const n = this.data.timeNum+1
    this.setData({
      timeNum:n
    })
  },
  toDeleteTime(){
    const n = this.data.timeNum-1
    this.setData({
      timeNum:n
    })
  },

  // 上传检查
  // 总上传函数
  toSubmit(){
    if(this.check()){
      if(this.data.isUploading){
        wx.showToast({
          title: '提交中',
          icon: 'loading',
          duration: 2000
        })
      }else{
        this.setData({isUploading:true})
        wx.cloud.callFunction({
          name:'uploadInformation',
          data:{
            type:2,
            information:this.package(),
            _id:this.data._id
          },
          success:()=>{
            wx.showToast({
              title: '上传成功',
              icon: 'none',
              duration: 2000
            })
            wx.switchTab({
              url: '/pages/work/work',
            })
          },fail:()=>{
            wx.showToast({
              title: '上传失败',
              icon: 'error',
              duration: 2000
            })
            this.setData({isUploading:false})
          }
        })
      }
    }else{
      wx.showToast({
        title: '填写有误',
        icon: 'error',
        duration:2000
      })
    }
  },
  // 检查函数
  check(){
    // 检查姓名
    let nameCheck = false
    if(this.data.teacherName){nameCheck=true}
    // 检查学校
    let schoolCheck = false
    if(this.data.teacherSchool){schoolCheck=true}
    // 检查年级
    let gradeCheck = false
    if(this.data.gradeType===4||(this.data.gradeType<4&&this.data.gradeYear!==null)){gradeCheck=true}
    // 检查大类
    let groupCheck = false
    if(this.data.group){groupCheck=true}
    // 检查科目
    let subjectCheck = JSON.stringify(this.data.choosenSubject)!=='[]'
    // 检查薪资
    let salaryCheck = false
    if(this.data.salary){
      if(this.data.salary>0&&this.data.salaryType){
        salaryCheck = true
      }
    }
    // 检查星期
    let weekCheck = !this.data.weekDay.every(element => element === false)
    // 检查时间
    let timeCheck = this.timeCheck(this.data.time0e,this.data.time1s,this.data.time1e,this.data.time2s,this.data.timeNum)
    // 检查回馈
    this.setData({
      isNameRight:nameCheck,
      isSchoolRight:schoolCheck,
      isGradeRight:gradeCheck,
      isGroupRight:groupCheck,
      isSubjectReady:subjectCheck,
      isSalaryReady:salaryCheck,
      isWeekRight:weekCheck,
      isTimeRight:timeCheck,
    })
    // 函数回馈
    if(nameCheck&&schoolCheck&&gradeCheck&&groupCheck&&subjectCheck&&salaryCheck&&weekCheck&&timeCheck){
      return true
    }
    else{
      return false
    }
  },
  // 时间正确检测函数
  timeCheck(time0e,time1s,time1e,time2s,num){
    const [hour0, minute0] = time0e.split(':').map(Number);
    const time0 = hour0 * 60 + minute0
    const [hour1, minute1] = time1s.split(':').map(Number);
    const time1 = hour1 * 60 + minute1
    const [hour2, minute2] = time1e.split(':').map(Number);
    const time2 = hour2 * 60 + minute2
    const [hour3, minute3] = time2s.split(':').map(Number);
    const time3 = hour3 * 60 + minute3
    if(num===1){
      return true
    }else if(num===2){
        return time0 < time1
    }else{
        return time0 < time1 && time2 < time3
    }
  },
  // 打包
  package(){
    // 年级信息打包
    let grade = []
    const gradeType = this.data.gradeType
    const gradeYear = this.data.gradeYear
    grade.push(this.data.grade.type[gradeType])
    if(gradeType!==4){
      grade.push(this.data.grade.grades[gradeType][gradeYear])
    }else{
      grade.push(this.data.otherGrade)
    }
    // 时间信息打包
    const times = [this.timeToNum(this.data.time0s),this.timeToNum(this.data.time0e),this.timeToNum(this.data.time1s),this.timeToNum(this.data.time1e),this.timeToNum(this.data.time2s),this.timeToNum(this.data.time2e)]
    return {
      name:this.data.teacherName,
      school:this.data.teacherSchool,
      grade:grade,
      group:this.data.group,
      subject:this.data.choosenSubject,
      otherSubject:this.data.otherSubject,
      position:this.data.region,
      introduction:this.data.teacherDetails,
      salary:{
        amount:Number(this.data.salary),
        type:this.data.salaryType
      },
      time:{
        week:this.data.weekDay,
        time:{
          number:this.data.timeNum,
          times:times
        }
      },
      week:this.weekdayToWeeks(this.data.weekDay),
      postDate:new Date(),
      checked:0,
      postDateFormated:this.getCurrentYYMMDDNumber()
    }
  },
  getCurrentYYMMDDNumber() {  
    // 获取当前时间  
    const now = new Date();  
  
    // 分别获取年、月（加1）、日  
    const year = now.getFullYear();  
    const month = now.getMonth() + 1;  
    const day = now.getDate();  
  
    // 截取年份的最后两位  
    const yearLastTwoDigits = parseInt(year.toString().slice(-2), 10);  
  
    // 组合成YYMMDD格式的数值  
    // 注意：这里我们使用了位运算（左移）和加法来组合数值，但在这个简单的场景下，直接乘法也是可以的  
    // 但为了清晰起见，这里使用简单的数学运算  
    const yyMmDdNumber = yearLastTwoDigits * 10000 + month * 100 + day;  
  
    // 返回结果  
    return yyMmDdNumber;  
  },
  weekdayToWeeks(boolArray) {  
    const trueIndices = [];  
    for (let i = 0; i < 7; i++) {  
      if (boolArray[i]) {  
        trueIndices.push(i);  
      }  
    }  
    return trueIndices;  
  },
  timeToNum(e){
    const [hours, minutes] = e.split(':').map(Number);   
    const totalMinutes = hours * 60 + minutes;  
      return totalMinutes;  
  },
})