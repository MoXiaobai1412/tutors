Page({
  data: {
    db:null,
    code:'',
  // 任务详情
    // 时间
    currentDate:"",
    endDate:"",
    endDate1:"",
    date0:"",
    date1:"",
    allNum:["一","二","三","四","五","六","日"],
    weekDay:[false,false,false,false,false,false,false],
    timeNum:1,
    time0s:"06:00",
    time0e:"22:00",
    time1s:"06:00",
    time1e:"22:00",
    // 地点
    region:["广东省","广州市","天河区","五山街道"],
    detailPosition:"",    


  // 学生详情
    // 姓名
    studentName:null,
    // 年级
    grade:{
      type:["高中","初中","小学","学前","其他"],
      grades:[["高一","高二","高三","复读","竞赛"],["初一","初二","初三","竞赛"],["一年级","二年级","三年级","四年级","五年级","六年级"]],
    },
    gradeType:null,
    gradeYear:null,
    otherGrade:null,
    // 科目
    subjects:["数学","物理","英语","语文","化学","生物","政治","历史","地理","数竞","物竞","化竞","生竞","信竞","艺术"],
    choosenSubject:[],
    isSubjectChosen:[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,],
    hasOtherSubject:false,
    otherSubject:null,
    // 学生情况
    studentDetails:null,

    
  // 老师要求
    teacherGender:"无要求",
    teacherGenderN:true,
    teacherGenderM:false,
    teacherGenderF:false,
    teacherSchool:"无要求",
    teacherSchoolN:true,
    teacherSchool9:false,
    teacherSchool2:false,
    teacherSchoolS:false,
    teacherSchoolY:false,
    teacherSchoolE:false,
    teacherAcademic:"无要求",
    teacherAcademicN:true,
    teacherAcademicB:false,
    teacherAcademicY:false,
    teacherExperience:"无要求",
    teacherExperienceN:true,
    teacherExperienceY:false,
    teacherNeed:null,


  // 待遇
    isSalaryFaceTalk:false,
    salary:null,
    salaryType:"h",
    hasCar:false,
    hasSubwayTip:false,
    hasOtherBenefit:false,
    otherBenefit:null,

  // 检查
    isInformationChecked:false,
    isDataRight:true,
    isWeekRight:true,
    isTimeRight:true,
    isGradeRight:true,
    isSubjectReady:true,
    isSalaryReady:true,
    isRegionRight:true,
    
  // 加载
    isUploading:false,
  },

  // 数据初始化
  // 加载函数
  onLoad(e){
    const now = new Date();  
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const currentDate = `${year}-${month}-${day}`; 
    const endDate = `${year+1}-${month}-${day}`;  
    const endDate1 = `${year+2}-${month}-${day}`; 
    this.setData({
      db:wx.cloud.database(),
      currentDate: currentDate,
      endDate: endDate,
      date0:currentDate,
      date1:endDate,
      endDate1:endDate1,
      _id:e.id
    })
    this.dataGet(e.id)
    
  },
  // 数据获取函数
  async dataGet(teacherId){
    this.data.db.collection('studentInformation').where({
      _id:teacherId
    }).get({
      success:(e)=>{
        const data = e.data[0]
        // 年级同步到页面
        const gradeTypeName = data.grade[0]
        const gradeYearName = data.grade[1]
        let otherGrade = null
        let gradeType = null
        let gradeYear = null
        if(gradeTypeName==="高中"){
           gradeType = 0
          if(gradeYearName==="高一"){
             gradeYear = 0
          }else if(gradeYearName==="高二"){
             gradeYear = 1
          }else if(gradeYearName==="高三"){
             gradeYear = 2
          }else if(gradeYearName==="复读"){
             gradeYear = 3
          }else{
             gradeYear = 4
          }
        }else if(gradeTypeName==="初中"){
           gradeType = 1
          if(gradeYearName==="初一"){
             gradeYear = 0
          }else if(gradeYearName==="初二"){
             gradeYear = 1
          }else if(gradeYearName==="初三"){
             gradeYear = 2
          }else{
             gradeYear = 3
          }
        }else if(gradeTypeName==="小学"){
           gradeType = 2
          if(gradeYearName==="一年级"){
             gradeYear = 0
          }else if(gradeYearName==="二年级"){
             gradeYear = 1
          }else if(gradeYearName==="三年级"){
             gradeYear = 2
          }else if(gradeYearName==="四年级"){
             gradeYear = 3
          }else if(gradeYearName==="五年级"){
             gradeYear = 4
          }else{
             gradeYear = 5
          }
        }else if(gradeTypeName==="学前"){
           gradeType = 3
           gradeYear = null
        }else{
           gradeType = 4
           gradeYear = null
           otherGrade = data.otherGrade
        }
        this.setData({
          gradeType:gradeType,
          gradeYear:gradeYear,
          otherGrade:otherGrade
        })       
        // 科目同步到页面
        // 性别
        switch(data.teacherGender) {
          case "无要求":this.setData({teacherGenderN:true});break;
          case "男":this.setData({teacherGenderM:true});break;
          case "女":this.setData({teacherGenderF:true});break;
        }
        // 学校
        switch(data.teacherSchool) {
          case "无要求":this.setData({teacherSchoolN:true});break;
          case "985":this.setData({teacherSchool9:true});break;
          case "211":this.setData({teacherSchool2:true});break;
          case "双一流":this.setData({teacherSchoolS:true});break;
          case "一本":this.setData({teacherSchoolY:true});break;
          case "二本":this.setData({teacherSchoolE:true});break;
        }
        // 学历
        switch(data.teacherAcademic) {
          case "无要求":this.setData({teacherAcademicN:true});break;
          case "本科":this.setData({teacherAcademicB:true});break;
          case "研究生":this.setData({teacherAcademicY:true});break;
        }
        switch(data.teacherExperience) {
          case "无要求":this.setData({teacherExperienceN:true});break;
          case "有经验":this.setData({teacherExperienceY:true});break;
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
          // 时间
          date0:data.time.date[0],
          date1:data.time.date[1],
          weekDay:data.time.week,
          timeNum:data.time.time.number,
          time0s:this.minutesSwitch(data.time.time.times[0]),
          time0e:this.minutesSwitch(data.time.time.times[1]),
          time1s:this.minutesSwitch(data.time.time.times[2]),
          time1e:this.minutesSwitch(data.time.time.times[3]),
          // 地点
          region:[data.position[0],data.position[1],data.position[2],data.position[3]],
          detailPosition:data.position[4],    
        // 学生详情
          // 姓名
          studentName:data.name,
          otherGrade:data.otherGrade,
          // 科目
          choosenSubject:data.subject,
          otherSubject:data.otherSubject,
          isSubjectChosen:isSubjectChosen,
          // 学生情况
          studentDetails:data.studentDetail,
        // 老师要求
          teacherGender:data.teacherGender,
          teacherSchool:data.teacherSchool,
          teacherAcademic:data.teacherAcademic,
          teacherExperience:data.teacherExperience,
          teacherNeed:data.teacherNeed,
        // 待遇
          isSalaryFaceTalk:data.salary.faceTalk,
          salaryType:data.salary.type,
          hasCar:data.salary.treatment.hasCar,
          hasSubwayTip:data.salary.treatment.hasSubwayTip,
          hasOtherBenefit:data.salary.treatment.hasOtherBenefit,
          otherBenefit:data.salary.otherBenefit,
        })
        if(data.salary.amount){
          this.setData({
            salary:data.salary.amount.toString()
          })
        }
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

  // 数据更改
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
    else{
      this.setData({
        time1e:time
      })
    }
  },
  toPushTime(){
    this.setData({
      timeNum:2
    })
  },
  toDeleteTime(){
    this.setData({
      timeNum:1
    })
  },
  // 年级操作函数
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
  // 老师要求操作函数
  toChangeTeacherGender(e){
    this.setData({
      teacherGender:e.detail.value
    })
  },
  toChangeTeacherSchool(e){
    this.setData({
      teacherSchool:e.detail.value
    })
  },
  toChangeTeacherAcademic(e){
    this.setData({
      teacherAcademic:e.detail.value
    })
  },
  toChangeTeacherExperience(e){
    this.setData({
      teacherExperience:e.detail.value
    })
  },
  // 薪资操作函数
  toChangeSalaryType(e){
    this.setData({
      salaryType:e.detail.value
    })
  },

  // 检查上传 
  // 上传函数
  toSubmit(){
    if(this.check){
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
            type:3,
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
    // 日期检查
    let dateCheck = new Date(this.data.date1)>new Date(this.data.date0)
    // 星期检查
    let weekCheck = !this.data.weekDay.every(element => element === false)
    // 时间检查
    let timeCheck = this.timeCheck(this.data.time0e,this.data.time1s,this.data.timeNum)
    // 地点检查
    let regionCheck = (this.data.region.length===4)
    // 年级检查
    let gradeCheck = false
    if(gradeType>2&&(gradeType<3&&gradeYear!==null)){gradeCheck = true}
    // 科目检查
    let subjectCheck = JSON.stringify(this.data.choosenSubject) !== '[]'
    // 薪资检查
    let salaryCheck = this.salaryCheck()
    // 反馈检查
    this.setData({
      isDataRight:dateCheck,
      isWeekRight:weekCheck,
      isTimeRight:timeCheck,
      isRegionRight:regionCheck,
      isGradeRight:gradeCheck,
      isSubjectReady:subjectCheck,
      isSalaryReady:salaryCheck,
    })
    if(dateCheck&&weekCheck&&timeCheck&&regionCheck&&gradeCheck&&subjectCheck&&salaryCheck){return true}
    else{return false}
  },
  // 时间正确检测函数
  timeCheck(time0e,time1s,num){
    if(num===1){
      return true
    }else{
      const [hour0, minute0] = time0e.split(':').map(Number);
      const time0 = hour0 * 60 + minute0
      const [hour1, minute1] = time1s.split(':').map(Number);
      const time1 = hour1 * 60 + minute1
        return time0 < time1
    }
  },
  // 薪资检验函数
  salaryCheck(salary){
    if(salary>0){
      return true
    }
    else{return false}
  },

  // 打包
  package(){
    // 年级打包
    const type = this.data.gradeType
    const year = this.data.gradeYear
    const grade = [this.data.grade.type[type]]
    if(type<3){
      grade.push(this.data.grade.grades[type][year])
    }else if(type===3){
      grade.push("")
    }else{
      grade.push(this.data.otherGrade)
    }
    // 时间打包
    const times = [this.timeToNum(this.data.time0s),this.timeToNum(this.data.time0e),this.timeToNum(this.data.time1s),this.timeToNum(this.data.time1e)]
    // 地点打包
    const position = this.data.region
    if (position===null){position.push(' ')}
    else{position.push(this.data.detailPosition)}

    // 反馈打包
    return {
      time:{
        date:[this.data.date0,this.data.date1],
        week:this.data.weekDay,
        time:{
          number:this.data.timeNum,
          times:times
        }

      },
      position:position,
      name:this.data.studentName,
      grade:grade,
      subject:this.data.choosenSubject,
      otherSubject:this.data.otherSubject,
      studentDetail:this.data.studentDetails,
      teacherGender:this.data.teacherGender,
      teacherSchool:this.data.teacherSchool,
      teacherAcademic:this.data.teacherAcademic,
      teacherExperience:this.data.teacherExperience,
      teacherNeed:this.data.teacherNeed,
      salary:{
        faceTalk:this.data.isSalaryFaceTalk,
        amount:Number(this.data.salary),
        type:this.data.salaryType,
        treatment:{
          hasCar:this.data.hasCar,
          hasSubwayTip:this.data.hasSubwayTip,
          hasOtherBenefit:this.data.hasOtherBenefit
        },
        otherBenefit:this.data.otherBenefit
      },
      week:this.weekdayToWeeks(this.data.weekDay),
      checked:0,
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