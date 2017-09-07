// ble.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  devices:[

  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.initBLE()
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.initBLE()
   wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  checkAllDevices:function(){
    var that = this
    wx.getBluetoothDevices({

      success: function(res) {
       that.setData({
         devices:res.devices

       })
      },
    })
  },
  connectBleDevice:function(options){
    wx.showLoading({
      title: '连接中...',
    })



    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
       
      },
    });
   var device = options.currentTarget.dataset.device;
   wx.createBLEConnection({
     deviceId: device.deviceId,
     success: function(res) {
       wx.getConnectedBluetoothDevices({
         services: [],
         success: function(res) {
         console.log(res.devices)
        

         },
       })
       wx.navigateTo({
         url: '../second/second',
       })
      wx.showToast({
        title: res.errMsg,
      })
     },
   })
 

  },

  initBLE:function(){
 
    var that = this
    wx.openBluetoothAdapter({
      success: function (res) {
  
        wx.onBluetoothAdapterStateChange(function (res) {
          if (!res.available) {
            wx.showModal({
              title: '警告',
              content: '当前蓝牙不可用',
            })
          }
        });
        wx.startBluetoothDevicesDiscovery({
          success: function (res) {
            wx.onBluetoothDeviceFound(function (res) {
              that.checkAllDevices()
  
            })


          },
        });




      },
      fail:function(respon){

        wx.showToast({
          title: respon.errMsg ,
        })
      }
    })

  }


})