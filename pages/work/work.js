// pages/work/work.js
Page({
  
  data: {
    db:null,
    // 左一导航栏
    isFindTeacher:false,
    // 右一导航栏
    region:["广东省","广州市","天河区"],
    // 左二导航栏
    showSalaryControl:false,
    topSalary:500,
    salaryType:"时",
    salary:null,
    // 右二导航栏
    allNum:["一","二","三","四","五","六","日"],
    weekDay:[false,false,false,false,false,false,false],
    // 学科导航栏
    subjects:["数学","物理","英语","语文","化学","生物","政治","历史","地理","数竞","物竞","化竞","生竞","信竞","艺术","其他"],
    chosenSubjects:[false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    showSubjectBox:false,

    // 学生模块信息
    studentInformation:[],
    // 老师模块信息
    teacherInformation:[],

    // 展示信息
    nowInformation:null,
    nowId:null,
    showBlock:false,

    // 页面懒加载
    pageSize:0,
    end:null
  },

  // 分页
  pageUp(){
    const num = this.data.pageSize
    if(num===0){
      wx.showToast({
        title: '已经是第一页了',
        duration: 1000,
        icon: 'none'
      })
    }else{
      this.setData({
        pageSize:num-1
      })
      this.getInformation()
    }
  },
  pageDown(){
    const num = this.data.pageSize
    if(this.data.end){
      wx.showToast({
        title: '已经是最后一页了',
        duration: 1000,
        icon:'none'
      })
    }else{
      this.setData({
        pageSize:num+1
      })
      this.getInformation()
    }
  },
  // 展示信息页
  showBlock(e){
    const index = e.currentTarget.dataset.index
    // 学生端，显示老师
    if(this.data.isFindTeacher){
      this.setData({
        nowInformation:this.data.teacherInformation[index],
        nowId:e.currentTarget.dataset.infoid,
        showBlock:true
      })
    }
    else{
      this.setData({
        nowInformation:this.data.studentInformation[index],
        nowId:e.currentTarget.dataset.infoid,
        showBlock:true
      })
    }
  },
  // 展示筛选框
  toShowSubjectBox(){
    const show = this.data.showSubjectBox
    this.setData({
      showSubjectBox:!show
    })
    if(show){
      this.refresh()
    }
  },
  closeBlock(){
    this.setData({
      showBlock:false
    })
  },
  toCloseSubjectBox(){
    this.setData({
      showSubjectBox:false
    })
  },
  // 改变筛选条件
  regionToAll0(e){
    this.setData({
        region:["全部省","全部市","全部区县"]
      })
  },
  regionToAll1(){
    const region = this.data.region
      this.setData({
        region:[region[0],"全部市","全部区县"]
      })
  },
  regionToAll2(){
    const region = this.data.region
      this.setData({
        region:[region[0],region[1],"全部区县"]
      })
  },
  toChangeSalary(){
    if(!this.data.salary){
      this.setData({
        salaryType:"时",
        salary:100,
      })
    }
    this.setData({
      showSalaryControl:true
    })
  },
  toChangeSalaryType(e){
    const type = e.detail.value
    if(type==="时"){
      this.setData({
        topSalary:"1000",
        salaryType:"时"
      })
    }
    else if(type==="日"){
      this.setData({
        topSalary:"2000",
        salaryType:"日"
      })
    }
    else{
      this.setData({
        topSalary:"100000",
        salaryType:"总"
      })
    }
  },
  overChangeSalary(){
    this.setData({
      showSalaryControl:false
    })
  },
  salaryToAll(){
    this.setData({
      salary:null
    })
  },
  toChangeWeek(e){
    const n = e.currentTarget.dataset.weekid
    const arr = this.data.weekDay
    arr[n] = !arr[n]
    this.setData({
      weekDay:arr
    })
  },
  weekToAll(){
    this.setData({
      weekDay:[false,false,false,false,false,false,false],
    })
  },
  toChangeSubject(e){
    const n = e.currentTarget.dataset.subjectid
    const arr = this.data.chosenSubjects
    arr[n] = !arr[n]
    this.setData({
      chosenSubjects:arr
    })
  },
  subjectToAll(){
    this.setData({
      chosenSubjects:[false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    })
  },

  // 跳转到详细信息页面
  detailToTeacherPage(){
    const id = this.data.nowId
    wx.navigateTo({
      url: `../detailPage/teacherPage/teacherPage?id=${id}`,
    })
  },
  detailToStudentPage(){
    const id = this.data.nowId
    wx.navigateTo({
      url: `../detailPage/studentPage/studentPage?id=${id}`,
    })
  },
  toTeacherPage(e){
    const id = e.currentTarget.dataset.infoid
    wx.navigateTo({
      url: `../detailPage/teacherPage/teacherPage?id=${id}`,
    })
  },
  toStudentPage(e){
    const id = e.currentTarget.dataset.infoid
    const select = {
      region:this.data.region,
      salary:this.data.salary,
      salaryType:this.data.salaryType,
      weekDay:this.data.weekDay,
      chosenSubjects:this.data.chosenSubjects,
    }
    wx.setStorageSync('select', select)
    wx.navigateTo({
      url: `../detailPage/studentPage/studentPage?id=${id}`,
    })
  },

  // 筛选函数
  getInformation(){
    const salaryType = this.data.salaryType
    const weekDay = this.data.weekDay
    const subjectChosen = this.data.chosenSubjects
    
    // 薪资类型
    let type = null
    switch(salaryType){
      case '时':type = 'h';break;
      case '日':type = 'd';break;
      case '总':type = 'a';break;
    }

    // 周时
    let week = []
    for(let i=0;i<7;i++){
      if(weekDay[i]){
        week.push(i)
      }
    }

    // 学科类
    let subject = []
    for(let i=0;i<15;i++){
      if(subjectChosen[i]){
        subject.push(this.data.subjects[i])
      }
    }
    const isStudent = this.data.isFindTeacher
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.cloud.callFunction({
        name: 'select',
        data: {
          region:this.data.region,
          salaryAmount:this.data.salary,
          type:type,
          week:week,
          subject:subject,
          isStudent:this.data.isFindTeacher,
          pageSize:this.data.pageSize
        },
        success:(res) => {
          wx.hideToast()
          const {data,end} = res.result
          if(data.length===0){
            wx.showToast({
              title: '无筛选结果',
              duration: 2000,
              icon: 'none'
            }) 
          }else{
          this.setData({
            end:end
          })
          if(end){
            if(isStudent){
              this.setData({
                teacherInformation:data
              })
            }else{
              this.setData({
                studentInformation:data
              })
            }
          }else{
            if(isStudent){
              this.setData({
                teacherInformation:data.slice(0,10)
              })
            }else{
              this.setData({
                studentInformation:data.slice(0,10)
              })
            }
          }
          }
        },
        fail:()=>{
          wx.showToast({
            title: '加载失败',
          })
        }
      })
  },
  firstRefresh(){
    this.setData({
      region:wx.getStorageSync("settings").region,
      salaryType:"时",
      salary:null,
      weekDay:[false,false,false,false,false,false,false],
      chosenSubjects:[false,false,false,false,false,false,false,false,false,false,false,false,false,false],
    })
    this.getInformation()
  },
  refresh(){
    this.setData({
      pageSize:0
    })
    this.getInformation()
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

  onLoad(e){
    console.log(e)
    this.setData({
      db:wx.cloud.database(),
    })
    this.newerCheck()
  },

  newerCheck(){
    this.data.db.collection('settings').where({
      _openid:wx.getStorageSync('openId')
    }).get({
      success:(res)=>{
        if(res.data.length!==0){
          if(!wx.getStorageInfoSync().keys.includes("favorList")){
            wx.setStorageSync('favorList', {teacher:[],student:[]})
          }
          // 读取记录
          let data = res.data[0]
          wx.setStorageSync('settings', data)
          this.setData({
            region:data.region,
            isFindTeacher:data.isStudent
          })
          this.firstRefresh()
        }else{
          wx.setStorageSync('favorList', {teacher:[],student:[]})
          wx.navigateTo({
            url: './register/register',
          })
        }
      },
      fail:()=>{
        wx.navigateTo({
          url: '../logs/logs',
        })
      }
    })

  },
})