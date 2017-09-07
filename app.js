//app.js
const APP_ID = 'wx5bde5cb360ac979e';//输入小程序appid
const APP_SECRET = 'd2d8cbbba04f8346b958e42775e826f7';//输入小程序app_secret
var OPEN_ID = ''//储存获取到openid
var SESSION_KEY = ''//储存获取到session_key

App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.getUserInfo()

    wx.setEnableDebug({
      enableDebug: true
    })

  },
  getUserInfo:function(cb){

    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
      
          if(res.code){
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + APP_ID+ '&secret='+APP_SECRET+ '&js_code=' + res.code + '&grant_type=authorization_code',
              success:function(resopn){
               that.globalData.user_openid=resopn.data.openid
              }
            })
          }
          else{
            console.log('获取用户登录态失败！' + res.errMsg)
          }

          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
    user_openid:'dsffds'
  }
})