// pages/more/more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    db:null
  },

  test(){
    const db=wx.cloud.database()
    db.collection('chat').add({  
        data: {
          user:['information._openid','information.op_openid',''],
          name:['information.nickName','information.opNickName',''],
          top:false,
          updateTime:new Date(),
          message:[{
            content:"已建立联系，请注意隐私安全，谨防被骗",
            type:4,
            time:new Date()
          }]
        },success:(e)=>{console.log(e)},
        fail:(e)=>{console.log(e)}
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },
})