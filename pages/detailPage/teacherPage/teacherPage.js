// pages/detailPage/teacherPage/teacherPage.js
Page({

  data: {
    _id:null,
    db:null,
    allWeek:["一","二","三","四","五","六","日"],

    // 喜欢
    isFavor:false,
    // 真人检验
    showIdentifyWindows:false,
    isRealPeople:false,
    checkFile:null,
    userInput:null,
    schoolName:null,

    // 举报
    showComplaintBlock:false,
    complaint:null,

    // 加载
    isUploading:false
  },
  // 举报
  showComplaint(){
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    this.data.db.collection('complaint').where({
      post_openid:wx.getStorageSync('openId'),
      complainted_openid:this.data.information._openid,
      doc_id:this.data.information._id,
    }).get({
      success:(e)=>{
        wx.hideToast()
        if(e.data.length>0){
          wx.showToast({
            title: '不可重复举报',
            icon: 'error',
            duration: 2000
          })
        }else{
          this.setData({
            showComplaintBlock:true
          })
        }
      },
      fail:()=>{
        wx.showToast({
          title: '网络故障',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },
  closeComplaint(){
    this.setData({
      showComplaintBlock:false
    })
  },
  toComplaint(){
    if(this.data.isUploading){
      wx.showToast({
      title: '正在上传',
      icon: 'loading',
      duration: 2000
    })
  }else{
    wx.showToast({
      title: '上传中',
      icon: 'loading'
    })
    this.setData({
      isUploading:true
    })
    this.data.db.collection('complaint').add({
      data:{
        complainted_openid:this.data.information._openid,
        doc_id:this.data.information._id,
        post_openid:wx.getStorageSync('openId'),
        isStudent:false,
        reason:this.data.complaint,
        information:this.data.information,
        step:0
      },
      success:()=>{
        wx.hideToast()
        wx.showToast({
          title: '已举报',
          duration: 2000,
          icon: 'success'
        })
        this.closeComplaint()
      },
      fail:()=>{
        wx.hideToast()
        wx.showToast({
          title: '网络故障',
          duration: 2000,
          icon: 'error'
        })
      }
    })}
  },
  // 真人检验
  realPersonIdentity(){
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    wx.cloud.callFunction({
      name:'realPersonIdentity',
      complete: e =>{
        const fileID = e.result.fileID
        const school = e.result.schoolName
        wx.cloud.downloadFile({
          fileID:fileID,
          success:(e)=>{
            wx.hideToast()
            this.setData({
              checkFile:e.tempFilePath,
              schoolName:school,
              showIdentifyWindows:true
            })
          }
        })
      }
    })
  },
  checkRealPeople(){
    if(this.data.userInput===this.data.schoolName){
      this.setData({
        showIdentifyWindows:false,
        isRealPeople:true,
      })
      wx.showToast({
        title: '检验通过',
        duration:2000,
        icon:'success'
      })
    }
    else{
      this.setData({
        showIdentifyWindows:false,
        userInput:null
      })
      wx.showToast({
        title: '检验失败',
        duration: 2000
      })
    }
  },

  // 收藏
  inFavor(){
    const favor = this.data._id
    this.pushFavor(favor)
    this.checkFavor(favor)
  },
  outFavor(){
    const favor = this.data._id
    this.deleteFavor(favor)
    this.checkFavor(favor)
  },
  checkFavor(e){
    const favor = wx.getStorageSync('favorList').teacher
    if(favor.includes(e)){
      this.setData({
        isFavor:true
      })
    }else{
      this.setData({
        isFavor:false
      })
    }
  },
  pushFavor(e) {
    let favorList = wx.getStorageSync('favorList')
    let list = favorList.teacher
    list.push(e)
    favorList.teacher = list
    wx.setStorageSync('favorList', favorList)
  },
  deleteFavor(e){
    let favorList = wx.getStorageSync('favorList')
    let list = favorList.teacher
    let listNew = list.filter(item => item !== e)
    favorList.teacher = listNew
    wx.setStorageSync('favorList', favorList)
  },
  
    // 建立聊天总函数
    toChat(){
      if(this.data.isRealPeople){
        this.creatChat()
      }else{
        this.realPersonIdentity()
      }
    },
    creatChat(){
      let information = {
        _openid:wx.getStorageSync('openId'),
        op_openid:this.data.information._openid,
        opNickName:this.data.information.name
      }
      if(wx.getStorageSync('settings').nickNameCheck===2){
        information.nickName=wx.getStorageSync('settings').nickName
      }else{
        information.nickName=null
      }


      wx.cloud.callFunction({
        name:'creatChat',
        data:{
          type:1,
          information:information
        }
      }).then(e => {
        console.log(e)
        if(e.result.pass){
          wx.navigateTo({
            url: `/pages/message/chat/chat?id=${e.result._id}`,
          })
        }else{
          wx.showToast({
            title: '服务器故障',
            icon: 'error',
            duration:2000
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '网络故障',
          icon: 'error',
          duration:2000
        })
      })
  
    },


  onLoad(e) {
    this.setData({
      _id:e.id,
      db:wx.cloud.database()
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    this.data.db.collection('teacherInformation').where({
      _id:e.id
    }).get({
      success:(res)=>{
        wx.hideToast()
        this.setData({
          information:res.data[0]
        })
      },fail:()=>{
        wx.hideToast()
        wx.showToast({
          title: '网络故障',
          duration: 2000,
          icon: 'error'
        })
      }
    })
    
  },
  onShow(){
    this.checkFavor(this.data._id)
  },
})