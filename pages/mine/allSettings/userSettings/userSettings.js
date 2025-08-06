// pages/mine/settings/settings.js
Page({
  data: {
    db:null,
    nickName:null,
    nickNamePrimary:null,
    isStudent:null,
    identityUpdateTime:null,
    canChangeIdentity:false,
    isStudentPrimary:null,
    region:null,
    isUploading:false,
  },

  dateFormated(identityDate){
    // 将输入的日期字符串转换为Date对象  
    const date = new Date(identityDate);  
  
    // 计算要添加的毫秒数（一天有86400000毫秒）  
    const millisecondsToAdd = 90 * 86400000;  
  
    // 创建一个新的Date对象，并添加毫秒数  
    const newDate = new Date(date.getTime() + millisecondsToAdd);  
  
    // 格式化日期为[YYYY, MM, DD]  
    // 注意月份是从0开始的，所以要+1，并且使用padStart来确保月份和日期是两位数  
    const formattedDate = [  
        newDate.getUTCFullYear(),  
        (newDate.getUTCMonth() + 1).toString().padStart(2, '0'),  
        newDate.getUTCDate().toString().padStart(2, '0')  
    ];  
  
    return formattedDate; 
  },
  checkTime(){
    const date = this.data.identityUpdateTime
    const currentDate = new Date()
    // 获取当前日期的天数  
    let currentDay = currentDate.getDate();  
    // 获取当前月份  
    let currentMonth = currentDate.getMonth()+1;  
    // 获取当前年份  
    let currentYear = currentDate.getFullYear();
    if(currentYear>date[0]||
        (currentYear===date[0]&&currentMonth>date[1])||
        (currentYear===date[0]&&currentMonth===date[1]&&currentDay>=date[2])){
      this.setData({
        canChangeIdentity:true
      })
    }  
  },

  toSubmit(){
    let settings = wx.getStorageSync('settings')
    settings.identityUpdateTime = new Date()
    settings.isStudent = this.data.isStudent
    settings.region = this.data.region
    settings.nickName = this.data.nickName
    const openId = wx.getStorageSync('openId')
    
    if(this.data.isUploading){
      wx.showToast({
        title: '上传信息中',
        duration: 2000,
        icon: 'loading'
      })
    }else{
      wx.cloud.callFunction({
        name:'changeSettings',
        data:{
          type:1,
          information:{
            _id:wx.getStorageSync('settings')._id,
            nickName:this.data.nickName,
            nickNamePrimary:this.data.nickNamePrimary,
            isStudent:this.data.isStudent,
            isStudentPrimary:this.data.isStudentPrimary,
            region:this.data.region,
          }
        },
        success:(e)=>{
          if(e.result.pass){
            wx.setStorageSync('settings', settings)
            wx.showToast({
              title: '修改成功',
              duration: 2000
            })
            wx.switchTab({
              url: '/pages/work/work',
            })
          }else{
            wx.showToast({
              title: '网络故障',
              duration: 2000,
              icon: 'error'
            })
            console.log(e)
            this.setData({
              isUploading:false
            })
          }
        },
        fail:(e)=>{
          wx.showToast({
            title: '网络故障',
            duration: 2000,
            icon: 'error'
          })
          this.setData({
            isUploading:false
          })
        }
      })



      // if(this.data.isStudent===this.data.isStudentPrimary){
      //   this.data.db.collection('settings').where({
      //   _openid:openId
      // }).update({
      //   data:{
      //     region:this.data.region,
      //   },
      //   success:()=>{
      //     wx.hideToast()
      //     wx.showToast({
      //       title: '修改成功',
      //       duration: 2000,
      //       icon: 'success'
      //     })
      //     wx.switchTab({
      //       url: '/pages/work/work',
      //     })
      //   },fail:(res)=>{
      //     wx.hideToast()
      //     wx.showToast({
      //       title: '网络故障',
      //       duration: 2000,
      //       icon: 'error'
      //     })
      //     this.setData({
      //       isUploading:false
      //     })
      //   }
      // })
      // }
      // else{
      //   wx.showToast({
      //     title: '上传中',
      //     icon: 'loading'
      //   })
      // this.data.db.collection('settings').where({
      //   _openid:openId
      // }).update({
      //   data:{
      //     identityUpdateTime:new Date(),
      //     isStudent:this.data.isStudent,
      //     region:this.data.region,
      //   },
      //   success:()=>{
      //     wx.hideToast()
      //     wx.showToast({
      //       title: '修改成功',
      //       duration: 2000,
      //       icon: 'success'
      //     })
      //     wx.switchTab({
      //       url: '/pages/work/work',
      //     })
      //   },fail:(res)=>{
      //     wx.hideToast()
      //     wx.showToast({
      //       title: '网络故障',
      //       duration: 2000,
      //       icon: 'error'
      //     })
      //     this.setData({
      //       isUploading:false
      //     })
      //   }
      // })
      // }
    }
  },

  onLoad(options) {
    const date = wx.getStorageSync('settings').identityUpdateTime

    this.setData({
      db:wx.cloud.database(),
      nickName:wx.getStorageSync('settings').nickName,
      nickNamePrimary:wx.getStorageSync('settings').nickName,
      region:wx.getStorageSync('settings').region,
      isStudent:wx.getStorageSync('settings').isStudent,
      identityUpdateTime:this.dateFormated(date),
      isStudentPrimary:wx.getStorageSync('settings').isStudent,
    })
  },
  onShow(){
    this.checkTime()
  }
})