// pages/favor/favor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db:null,
    isFindTeacher:true,

    // 学生模块信息
    studentInformation:[],
    // 老师模块信息
    teacherInformation:[]
  },
  // 删除收藏  
  toDeleteStudent(e){
    const id = e.currentTarget.dataset.infoid
    let favorList = wx.getStorageSync('favorList')
    let list = favorList.student
    let listNew = list.filter(item => item !== id)
    favorList.student = listNew
    wx.setStorageSync('favorList',favorList)
    this.refresh()
  },
  toDeleteTeacher(e){
    const id = e.currentTarget.dataset.infoid
    let favorList = wx.getStorageSync('favorList')
    let list = favorList.teacher
    let listNew = list.filter(item => item !== id)
    favorList.teacher = listNew
    wx.setStorageSync('favorList', favorList)
    this.refresh()
  },

  onLoad() {
    this.setData({
      db:wx.cloud.database()
    })
  },

  onShow() {
    this.setData({
      isFindTeacher:wx.getStorageSync('settings').isStudent,
    })
    this.refresh()
  },

  // 跳转
    // 跳转教师页面
    toTeacherPage(e){
      const id = e.currentTarget.dataset.infoid
      wx.navigateTo({
        url: `../detailPage/teacherPage/teacherPage?id=${id}`,
      })
    },
    // 跳转到学生页面
    toStudentPage(e){
      const id = e.currentTarget.dataset.infoid
      wx.navigateTo({
        url: `../detailPage/studentPage/studentPage?id=${id}`,
      })
    },


  // 调用数据函数
  async getCollectionData(collection, query,field) {  
    return new Promise((resolve, reject) => {  
      collection.where(query).field(field).get({  
        success: (res) => {  
          if (res.data && res.data.length > 0) {  
            resolve(res.data[0]);  
          } else {  
            resolve(null); // 或者你可以根据需要处理空结果  
          }  
        },  
        fail: (err) => {  
          reject(err);  
        }  
      });  
    });  
  },
  async refresh() {  
    const favorList = wx.getStorageSync('favorList')
    if(wx.getStorageSync('settings').isStudent){
      const teacherList = favorList.teacher
      let teacherInformation = []
      for(let i = 0;i < teacherList.length;i++ ){
        let id = teacherList[i];
        let data = await this.getCollectionData(this.data.db.collection('teacherInformation'), { _id: id,checked:2 },{
          _id:true,
          grade:true,
          subject:true,
          group:true,
          introduction:true,name:true,
          otherObject:true,
          position:true,
          postDate:true,
          salary:true,
          school:true,
          time:true,
          week:true
        });
        if(data){
          teacherInformation.push(data)
        }
      }
      this.setData({  
        teacherInformation: teacherInformation,
      }); 
    }else{
      const studentList = favorList.student
      let studentInformation = []
      for(let i = 0;i < studentList.length;i++ ){
        let id = studentList[i];
        let data = await this.getCollectionData(this.data.db.collection('studentInformation'), { _id: id,checked:2 },{
          grade:true,
          name:true,
          otherGrade:true,
          otherSubject:true,
          position:true,
          postDate:true,
          salary:true,
          showName:true,
          studentDetail:true,
          subject:true,
          teacherAcademic:true,
          teacherExperience:true,
          teacherGender:true,
          teacherNeed:true,
          teacherSchool:true,
          time:true,
          week:true,
          _id:true
        });
        if(data){
        studentInformation.push(data)
        }
      }
      this.setData({   
        studentInformation: studentInformation  
      }); 
    } 
  },

})