var app = getApp();

var client =require('../../utils/mqtt_module.js');

var ble = require('../../utils/ble_module.js');

Page({
  data:{
    isConnection:false,
     list:[],
     inputValue:'',
     item:{
       name:'lishen'
     },
     bleInfo:'null'
  },
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  onLoad: function () {
    
    ble.ble_discoverList(function(res){
    // console.log(res)
      res.forEach(function(item,index,array){
      
        if (item.name =='BLE-SPS')
        {
          ble.ble_connection(item,function(){

          })
        }
      })
    });
    var that=this

    client.client_connection('filterPubSub/a',function(result){
      
      wx.setNavigationBarTitle({
        title: result?'已连接':'未连接',
      })
      that.setData({
        isConnection:result
      })
    })
    client.rev_message(function(mes,ms){

      var list = that.data.list

      list.unshift(ms)

      console.log(list)

      that.setData({
        list: list
      })
    
   })

  },
  publishMessage:function(){
    var data = this.data.inputValue;
    client.send_message('filterPubSub/a',data)
  },
  
readBleCilck:function(){

    var that=this
    ble.ble_rev_message(function(res){
      console.log(res)
    that.setData({
     bleInfo:String(res)
   })
  })
},
  onPullDownRefresh:function(){

    wx.stopPullDownRefresh()

    ble.ble_discoverList(function (res) {
      console.log('下拉刷新',res)
      res.forEach(function(item,index,array){
        if (item.name == "BLE-SPS") {
          ble.ble_connection(item, function () {

          })
        }
      })
     
    })
  },
  writeValue:function(){
    var data = this.data.inputValue;

    ble.ble_send_message(parseInt(data))
  }

  

});