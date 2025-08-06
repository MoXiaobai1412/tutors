// pages/mine/allSettings/allSettings.js
Page({
  data: {
    db:null,
    // 个人设置
    showUserSettings:false,
    nickName:null,
    nickNameCheck:null,
    region:null,
    isStudent:"",
    isAdminster:false,
    // 指引
    showDirect:false,
    tempFilePathArray:[],
    openid:null,
    // 反馈
    showComplaint:false,
    complaintThings:null,
    isUploading:false,
    // 分享
    showSharing:false,
    codePath:null,
    // 隐私协议
    showDeal:false,
    // 认证码
    showPermission:false,
    permissionCode:null,
    hasPermission:false
  },

  // 用户信息
  showUserSettings(){
    const show = this.data.showUserSettings
    this.setData({
      showUserSettings:!show
    })
  },
  toChangeUserSettings(){
    wx.navigateTo({
      url: './userSettings/userSettings',
    })
  },

  // 使用指引
  showDirect(){
    if(this.data.tempFilePathArray.length===0&&(!this.data.showDirect)){
      wx.showToast({
        title: '加载中',
        icon: 'loading',
      })
      const show = this.data.showDirect
      const urlList = [
        "cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/direct/1.jpg",
        "cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/direct/2.jpg",
        "cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/direct/3.jpg",
        "cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/direct/4.jpg",
        "cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/direct/5.jpg",
        "cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/direct/6.jpg"
      ] 
      this.downloadImages(urlList).then(imagePaths => {  
        this.setData({
          tempFilePathArray:imagePaths,
          showDirect:!show,
        })
        wx.hideToast()
      }).catch(error => {  
        wx.showToast({
          title: '加载失败',
          duration: 2000,
          icon: 'error'
        })
      })
    }
    else if(this.data.showDirect){
      this.setData({
        showDirect:false
      })
    }else if(this.data.tempFilePathArray.length!==0){
      this.setData({
        showDirect:true
      })
    }
    

  },
  downloadImage(url) {  
    return new Promise((resolve, reject) => {
      wx.cloud.downloadFile({  
        fileID: url,
        success: (res) => {  
          resolve(res.tempFilePath);  
        },  
        fail: (err) => {  
          // 下载失败  
          reject(err);  
        }  
      });  
    });  
  },
  async downloadImages(imageUrls) {
    try {  
      const imagePaths = await Promise.all(imageUrls.map(url => this.downloadImage(url)));  
      return imagePaths;  
    } catch (error) {  
      console.error('下载图片时发生错误:', error);  
      return []; // 或者抛出错误，根据你的需求决定  
    }  
  },

  // 反馈
  showComplaint(){
    const show = this.data.showComplaint
    this.setData({
      showComplaint:!show,
    })
  },
  clearComplaint(){
    if(this.data.complaintThings){
    wx.showModal({
      title: '提示',
      content: '是否清空反馈内容',
      complete: (res) => {
        if (res.cancel) {
          
        }
    
        if (res.confirm) {
          this.setData({
            complaintThings:null
          })
        }
      }
    })
    }else{
      wx.showToast({
        title: '您还未输入反馈内容',
        duration: 2000
      })      
    }
  },
  postComplaint(){
    const content = this.data.complaintThings
    if(!content){
      wx.showToast({
        title: '请输入反馈内容',
        duration: 2000
      })
    }
    else if(content.length<=5){
      wx.showToast({
        title: '反馈内容过短',
        duration:2000
      })
    }
    else{
      if(this.data.isUploading){
        wx.showToast({
          title: '正在上传',
          icon: 'loading'
        })
      }else{
        this.setData({
          isUploading:true
        })      
        this.data.db.collection('feedback').add({
          data:{
            content:content,
            isStudent:wx.getStorageSync('settings').isStudent
          },success:()=>{
            wx.hideToast()
            wx.showModal({
              title: '反馈成功',
              content: '反馈成功，请等待管理员处理',
              showCancel:false,
              complete: (res) => {
                if (res.confirm) {
                  this.setData({
                    isUploading:false,
                    showComplaint:false,
                    complaintThings:null
                  })
                }
              }
            })
          },fail:()=>{
            wx.showToast({
              title: '上传失败',
              duration: 2000,
              icon: 'error'
            })
            this.setData({
              isUploading:false
            })
          }
      })
      }



    }

  },

  // 分享
  showSharing(){
    if(this.data.showSharing){
      const show = this.data.showSharing
      this.setData({
        showSharing:!show
      })
    }else{
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
      wx.cloud.downloadFile({
      fileID:"cloud://scuttutor-guangdong1-1bf905cb6c6.7363-scuttutor-guangdong1-1bf905cb6c6-1328587375/direct/gh_7d40ad54fb87_430.jpg",
      success:(e)=>{
        wx.hideToast()
        this.setData({
          codePath:e.tempFilePath,
          showSharing:true
        })
      }
      })
    }



    
  },

  // 协议
  showDeal(){
    const show = this.data.showDeal
    this.setData({
      showDeal:!show,
    })
  },

  // 获权
  toPermission(){
    const show = this.data.showPermission
    this.setData({
      showPermission:!show,
    })
  },
  postPermission(){
    wx.cloud.callFunction({
      name:"permission",
      data:{
        action:0,
        information:{
          _id:this.data.permissionCode
        }
      },
      success:(e)=>{
        const pass = e.result.pass
        if(pass){
          wx.showToast({
            title: '已获取权限',
            duration: 2000,
            icon: 'success'
          })
          this.setData({permissionCode:null})
        }else{
          const err = e.result.err
          wx.showToast({
            title: err,
            icon: 'error',
            duration: 2000
          })
          this.setData({permissionCode:null})
        }
      }
    })
  },
  // 管理页
  toAdmin(){
    wx.navigateTo({
      url: './admin/navigator/navigator',
    })
  },
  // 注销
  toDeleteAll(){
    wx.showModal({
      title: '注销账号',
      content: '此操作会清除你发布的所有信息即配置，包含发布的师生信息与注册记录，是否继续？',
      complete: (res) => {
        if (res.cancel) {
          wx.showToast({
            title: '已取消',
            duration:2000,
            icon:'none'
          })
        }
    
        if (res.confirm) {
          const openid = wx.getStorageSync('openId')
          this.data.db.collection('teacherInformation').where({
            _openid:openid
          }).remove({
            success:()=>{
              wx.showToast({
                title: '成功删除教师信息',
              })
            },fail:()=>{
              wx.showToast({
                title: '网络故障',
              })
            }
          })

          this.data.db.collection('studentInformation').where({
            _openid:openid
          }).remove({
            success:()=>{
              wx.showToast({
                title: '成功删除学生信息',
              })
            },fail:()=>{
              wx.showToast({
                title: '网络故障',
              })
            }
          })

          this.data.db.collection('settings').where({
            _openid:openid
          }).remove({
            success:()=>{
              wx.showToast({
                title: '成功删除个人设置信息',
              })
            },fail:()=>{
              wx.showToast({
                title: '网络故障',
              })
            }
          })

          wx.switchTab({
            url: '/pages/work/work',
          })



        }
      }
    })
  },

  onLoad(){
    this.setData({
      db:wx.cloud.database(),
      openid:wx.getStorageSync('openId')
    })
  },
  onShow(){
    this.setData({
      nickName:wx.getStorageSync('settings').nickName,
      nickNameCheck:wx.getStorageSync('settings').nickNameCheck,
      region:wx.getStorageSync('settings').region,
      isStudent:wx.getStorageSync('settings').isStudent,
      isAdminster:wx.getStorageSync('settings').isAdminster
    })
    wx.cloud.callFunction({
      name:"permission",
      data:{
        action:1
      },
      success:(e)=>{
        this.setData({
          hasPermission:e.result.pass
        })
      }
    })
  },

  // 管理员
  // toInvestigate(){
  //   wx.navigateTo({
  //     url: './investigate/investigate',
  //   })
  // },
})