// pages/work/register/register.js
Page({
  data: {
    db:null,

    nickName:null,
    isStudent:true,
    region:["广东省","广州市","天河区"],
    isInformationChecked:false,
    isUploading:false,
    showDeal:true,
    showDaily:false,

  },
  closeDeal(){
    this.setData({showDeal:false})
  },
  showDeal(){
    this.setData({showDeal:true})
  },
  toSubmit(){
  // 创建记录
    if(this.data.isUploading){
      wx.showToast({
        title: '正在上传',
        icon: 'loading',
        duration: 2000
      })
    }else{
      this.setData({
        isUploading:true
      })
      wx.cloud.callFunction({
        name:'changeSettings',
        data:{
          type:0,
          information:{
            isStudent:this.data.isStudent,
            region:this.data.region,
            nickName:this.data.nickName
          }
        },
        success:(e)=>{
          if(e.result.pass){
          wx.getStorageSync('settings',e)
          wx.navigateTo({
            url: '/pages/post/post',
          })
          }else{
            wx.showToast({
              title: '网络故障',
              icon: 'error',
              duration: 2000
            })
            this.setData({
              isUploading:false
            })
          }
        },fail:()=>{
          wx.showToast({
            title: '网络故障',
            icon: 'error',
            duration: 2000
          })
          this.setData({
            isUploading:false
          })
        }
      })
      // this.data.db.collection('settings').add({
      //   data:{
      //     isAdminster:false,
      //     isStudent:this.data.isStudent,
      //     identityUpdateTime:new Date(),
      //     isNew:false,
      //     maxNumber:{
      //       student:5,teacher:2,
      //     },
      //     region:this.data.region,
      //     registerTime:new Date()
      //   },success:(e)=>{
      //     wx.getStorageSync('settings',e)
      //     wx.switchTab({
      //       url: '../work',
      //     })
      //   },fail:()=>{
      //     wx.showToast({
      //       title: '网络故障',
      //       icon: 'error',
      //       duration: 2000
      //     })
      //     this.setData({
      //       isUploading:false
      //     })
      //   }
      // })
    }
  },
  onLoad(){
    this.setData({
      db:wx.cloud.database()
    })
  }
})