// app.js
App({
  globalData: {
    userInfo: null
  },
  onLaunch() {
    wx.cloud.init({  
      env: '',  
      traceUser: true,
    })
    wx.cloud.callFunction({
      name: 'getConfig',
      complete: res => {
        wx.setStorageSync('openId', res.result.openid)
        wx.setStorageSync('appId', res.result.appid)
      }
    })
    const db = wx.cloud.database()
    

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  onHide() {
    const db = wx.cloud.database()
    const openId = wx.getStorageSync('openId')
    const favorList = wx.getStorageSync('settings').favorList
    db.collection('settings').where({
      _openid:openId
    }).update({
      data:{
        favorList:favorList
      }
    })
  },
})
