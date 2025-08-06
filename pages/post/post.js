// pages/post/post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  onShow(){    
    const settings = wx.getStorageSync('settings')
    const db = wx.cloud.database()
    // 学生找老师
    if(settings.isStudent){
      db.collection('studentInformation').where({
        _openid:wx.getStorageSync('openId')
      }).get({
        success:(e)=>{
          if(e.data.length<settings.maxNumber.student){
            wx.showModal({
            title: '提示',
            content: '即将填写学生信息',
            complete: (res) => {
              if (res.cancel) {
                wx.switchTab({
                  url: '/pages/work/work',
                })
              }
              if (res.confirm) {
                this.toFindTeacher()
              }
            }
          })
        }else{
          wx.showModal({
            title: '超过数量限制',
            content: `最多可填写${settings.maxNumber.student}个学生信息，请删除部分已填写的学生信息或联系管理员添加更多学生信息`,
            showCancel:false,
            complete: (res) => {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/work/work',
                })
              }
            }
          })
        }},fail:()=>{
          wx.showToast({
            title: '网络不佳',
            icon: 'error',
            duration: 2000
          })
          wx.switchTab({
            url: '../work/work',
          })
        }
      })


      
    }
    // 老师找学生
    else{
      db.collection('teacherInformation').where({
        _openid:wx.getStorageSync('openId')
      }).get({
        success:(e)=>{
          if(e.data.length<settings.maxNumber.teacher){
            wx.showModal({
              title: '提示',
              content: '即将填写老师信息',
              complete: (res) => {
                if (res.cancel) {
                  wx.switchTab({
                    url: '/pages/work/work',
                  })
                }
                if (res.confirm) {
                  this.toFindStudent()
                }
              }
            })
          }else{
            wx.showModal({
              title: '超过数量限制',
              content: `最多可填写${settings.maxNumber.teacher}个老师信息，请删除部分已填写的老师信息或联系管理员添加更多老师信息`,
              showCancel:false,
              complete: (res) => {
                if (res.confirm) {
                  wx.switchTab({
                    url: '/pages/work/work',
                  })
                }
              }
            })
          }
        },fail:()=>{
          wx.showToast({
            title: '网络不佳',
            icon: 'error',
            duration: 2000
          })
          wx.switchTab({
            url: '../work/work',
          })
        }
      })
    }
  },

  toFindStudent(){
    wx.navigateTo({
      url: './teacher-info/teacher-info',
    })
  },
  toFindTeacher(){
    wx.navigateTo({
      url: './student-info/student-info',
    })
  },
})