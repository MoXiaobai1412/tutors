// pages/mine/mine.js
Page({
  data: {
    db:null,
    isFindTeacher:true,
    // 学生模块信息
    studentInformation:[],
    // 老师模块信息
    teacherInformation:[],
    teacherNum:0,
    studentNum:0,
    studentMaxNum:5,
    teacherMaxNum:2
  },
  
  // 删除发布
  toDeleteTeacher(e) {
    const _id = e.currentTarget.dataset.infoid
    this.data.db.collection('teacherInformation').doc(_id).remove({  
        success: () => {  
            wx.showToast({  
                title: '已删除',
                duration: 2000,
                icon: 'success'
            });
            this.refresh();  
        },  
        fail: (err) => {  
            wx.showToast({  
                title: '网络故障',  
                icon: 'none',
                duration:2000
            });  
        }  
    });  
  },
  toDeleteStudent(e) {
    const _id = e.currentTarget.dataset.infoid
    this.data.db.collection('studentInformation').doc(_id).remove({  
        success: () => {  
            wx.showToast({  
                title: '已删除',
                icon:'success',
                duration:2000 
            });  
            this.refresh();  
        },  
        fail: (err) => {
            wx.showToast({  
                title: '网络故障',  
                icon: 'error',
                duration: 2000
            });  
        }  
    });  
  },  

  // 跳转
  toSettings(){
      wx.navigateTo({
        url: './allSettings/allSettings',
      })
  },
  toTeacherPage(e){
      const id = e.currentTarget.dataset.infoid
      wx.navigateTo({
        url: `./teacherUpdatePage/teacherUpdatePage?id=${id}`,
      })
  },
  toStudentPage(e){
      const id = e.currentTarget.dataset.infoid
      wx.navigateTo({
        url: `./studentUpdatePage/studentUpdatePage?id=${id}`,
      })
  },

  // 调用数据函数
  async getCollectionData(collection, query) {  
    return new Promise((resolve, reject) => {  
      collection.where(query).get({  
        success: (res) => {  
          if (res.data && res.data.length > 0) {  
            resolve(res.data);  
          } else {  
            resolve([]); // 或者你可以根据需要处理空结果  
          }  
        },  
        fail: (err) => {  
          reject(err);  
        }  
      });  
    });  
  },
  async refresh() {
      const data0 = await this.getCollectionData(this.data.db.collection('studentInformation'), { _openid: wx.getStorageSync('openId') })
      this.setData({
        studentInformation:data0,
        studentNum:data0.length,
        studentMaxNum:wx.getStorageSync('settings').maxNumber.student
      })
      const data1 = await this.getCollectionData(this.data.db.collection('teacherInformation'), { _openid: wx.getStorageSync('openId') })
      this.setData({
        teacherInformation:data1,
        teacherNum:data1.length,
        teacherMaxNum:wx.getStorageSync('settings').maxNumber.teacher
      })

  },
  // 监视
  startWatcher(){
    wx.cloud.database().collection('studentInformation').where({_openid:wx.getStorageSync('openId')}).watch({
      onChange:()=>{this.refresh()},
      onError:()=>{
        wx.showToast({
          title: '网络故障',
          duration: 2000,
          icon: 'error'
        })
      }
    })
    wx.cloud.database().collection('teacherInformation').where({_openid:wx.getStorageSync('openId')}).watch({
      onChange:(e)=>{this.refresh();console.log(e)},
      onError:()=>{
        wx.showToast({
          title: '网络故障',
          duration: 2000,
          icon: 'error'
        })
      }
    })
  },
  // 获取认证码
  getTeacherCode(e){
    const code = e.currentTarget.dataset.infoid+'tt'
    wx.setClipboardData({
      data: code,
      success:()=>{
        wx.showModal({
          title: '老师认证码',
          content: `${code}，认证码已复制到粘贴板，请发送给管理员进行认证`,
          showCancel:false,
          complete: (res) => {
            if (res.confirm) {
              
            }
          }
        })
      },
      fail:()=>{
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  getStudentCode(e){
    const code = e.currentTarget.dataset.infoid+'ss'
    wx.setClipboardData({
      data: code,
      success:()=>{
        wx.showModal({
          title: '学生认证码',
          content: `${code}，认证码已复制到粘贴板，请发送给管理员进行认证`,
          showCancel:false,
          complete: (res) => {
            if (res.confirm) {
              
            }
          }
        })
      },
      fail:()=>{
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  onLoad() {
    this.setData({
      db:wx.cloud.database()
    })
  },
  onShow() {
    this.setData({
      isFindTeacher:wx.getStorageSync('settings').isStudent,
      maxNumber:wx.getStorageSync('settings').maxNumber
    })
    this.refresh()
    this.startWatcher()
  },
})