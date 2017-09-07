var MathClass = require("../../utils/commonJS/mathCommonJS.js")
//获取应用实例
var app = getApp()
Page({

  data: {
   button_text:'连接设备',
   button_type:'primary',
   button_status:false,
   devices_data:false,
   devices_data_services:false,


   steps_uuid:'FEE',
   steps_data:false,
   steps_data_count:'6521',


   shock_uuid:'00002a06-0000',
   shock_data:false,


   electricity_uuid:'00002A19-0000-1000-8000-00805F9B34FB',
   electricity_data:false,
   electricity_data_surplus:'80%'

  },
  startBle:function(){
    var that = this
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('初始化蓝牙适配器');
        wx.getBluetoothAdapterState({
          success: function (res) {
            console.log('获取本机蓝牙适配器状态', res)
            wx.onBluetoothAdapterStateChange(function (res) {
              console.log('蓝牙适配器状态发生变化', res);
            });
            wx.startBluetoothDevicesDiscovery({
              services: [],
              success: function (res) {
                console.log('开始搜索周边蓝牙', res)

                that.setData({
                  button_text: '正在连接...',
                  button_type: 'default',
                  button_status: true
                });
               wx.getBluetoothDevices({
                 success: function(res) {
                   console.log('一共发现蓝牙设备', res);
                   res.devices.forEach(function(item,index,array){
                     var device = item
                     console.log('123456789', device.name)
                     if (device.name == 'H60-L01') {
                       that.setData({
                         button_text: '断开连接',
                         button_type: 'warn',
                         devices_data: device
                       })
                       wx.stopBluetoothDevicesDiscovery({
                         success: function (res) {
                           console.log('停止搜索周边蓝牙设备')
                         },
                         fail: function (res) { },
                         complete: function (res) { },
                       })
                       that.link_ble_device()
                     }
                   })
                 }
               })
                wx.onBluetoothDeviceFound(function (devices_ls) {
                  console.log('新发现蓝牙设备', devices);
                   var device = devices_ls.devices[0]
                   console.log('123456789',device.name)
                   if(device.name == 'WeLoop Now2 D79D34')
                   {
                      that.setData({
                        button_text:'断开连接',
                        button_type:'warn',
                        devices_data:device
                      })
                      wx.stopBluetoothDevicesDiscovery({
                        success: function(res) {
                          console.log('停止搜索周边蓝牙设备')
                        },
                        fail: function(res) {},
                        complete: function(res) {},
                      })
                      that.link_ble_device()
                   }
                  

                })

                // wx.getConnectedBluetoothDevices({
                //   services: [],
                //   success: function(re) {
                //     console.log('当前连接蓝牙设备', re);

                //   },
                // })


              },
            })



          },
        })


      },
    })

  },

  onLoad: function () {
    // const base64 = 'CxYh'
    // const arrayBuffer = wx.base64ToArrayBuffer(base64)

    // console.log(arrayBuffer)

    const arrayBufferr = new Uint8Array([256, 22, 53])

    const base65 = wx.arrayBufferToBase64(arrayBufferr)
    // // var math = new MathClass();
    // console.log(base65,typeof(arrayBufferr))
  
  },
  link_ble_device:function(){
    var that = this
    var  deviceID = that.data.devices_data.deviceId
      wx.createBLEConnection({
                                       
       deviceId:deviceID ,
       success: function(res) {
         console.log('连接手环', that.data.devices_data.name,res)
          wx.onBLEConnectionStateChange(function(res){
            console.log('监听蓝牙连接',res)
          })
          wx.getBLEDeviceServices({
            deviceId: deviceID,
            success: function(res) {
              console.log('获取设备的服务',res)
              that.setData({
                devices_data_services:res.services
              });
              var services_list=that.data.devices_data_services;

              services_list.forEach(function(value,index,array){
                 wx.getBLEDeviceCharacteristics({
                   deviceId: deviceID,
                   serviceId: value.uuid,
                   success: function(characteristic) {
                    console.log(index,'获取设备服务特征值characteristic',characteristic)
                    array[index].characteristics = characteristic.characteristics
                    that.setData({
                      devices_data_services:services_list
                    })
                    if(index==array.length-1)
                    {
                    
                    }
                   },
                   fail:function(err){
                    console.log(err,'faild get char')
                   }
                 });

              })

            },
          })


       },
       fail: function(res) {},
       complete: function(res) {},
       })


  },

checkCurrentDevice:function(){
  wx.getConnectedBluetoothDevices({
    services: [],
    success: function(res) {
      console.log('已经连接', res);
    },
    fail: function(res) {},
    complete: function(res) {},
  })
  wx.getBluetoothDevices({
    success: function (res) {
      console.log('一共发现蓝牙设备', res);
    },
    fail:function(fail){
      console.log(fail)
    },
    complete:function(){

    }

  })
},

  select_characteristics:function(){
   var that = this;
   var services_list = that.data.devices_data_services;
   var steps = {service:false,characteristic:false};
   var shock ={service:false,characteristic:false};
   var electricity={service:false,characteristic:false}
   console.log('封装好的服务，特征值',services_list)
    services_list.forEach(function(value,index,array){
       array[index].characteristics.forEach(function(values,indexs,arrays){
        if(values.uuid == that.data.steps_uuid)
        {
          console.log('找到步数特征值',values)
          steps.service=value;
          steps.characteristic=values;
          that.setData({
            steps_data:steps
          })
        }
        if(values.uuid==that.data.shock_uuid)
        {
          console.log('找到震动特征值',values)
          shock.service = value;
          shock.characteristic=values;
          that.setData({
            shock_data :shock
          })
        }
        if(values.uuid == that.data.electricity_uuid)
        {
          console.log('找到电量信息特征值',values)
          electricity.service=value;
          electricity.characteristic=values;
          that.setData({
            electricity_data:electricity
          })
        }
        if(values.uuid=='')
        { 
          console.log('找到一个未知的特征值')

        }


      })


    })


  },

  steps_control:function(){
   var that=this 
   var steps_data = that.data.steps_data;

   wx.readBLECharacteristicValue({
     deviceId: that.data.devices_data.deviceId,
     serviceId: steps_data.service.uuid,
     characteristicId: steps_data.characteristic.uuid,
     success: function(res) {
       console.log('读取到步数信息',res)
     },
   })

  },
  steps_realtime_control:function(){
   var that = this
   var steps_data = that.data.steps_data;
   wx.notifyBLECharacteristicValueChange({
     deviceId: that.devices_data.deviceId,
     serviceId: steps_data.service.uuid,
     characteristicId: steps_data.characteristic.uuid,
     state: true,
     success: function(res) {
       console.log('步数在变化',res)
     },
   })
  },
  shock_control:function(attr){
   var that = this
   var shock_data = that.data.shock_data;
   let buffer = new ArrayBuffer(1);
   let dataView = new DataView(buffer);
   dataView.setUint8(0,attr.currentTarget.dataset.strength)
   wx.writeBLECharacteristicValue({
     deviceId: that.devices_data.deviceId,
     serviceId: shock_data.service.uuid,
     characteristicId: shock_data.characteristic.uuid,
     value: buffer,
     success: function(res) {
       console.log('发送数据成功')
     },
   })

  },
  electricity_control:function(){

   var that = this
   
   var electricity_data = that.data.electricity_data;

   wx.onBLECharacteristicValueChange(function (res) {

     const base64 = wx.arrayBufferToBase64(res.value)

     console.log(typeof (res.value), '6666666666', base64, String.fromCharCode.apply(null, new Uint8Array(res.value)))

     console.log(`characteristic ${res.characteristicId} has changed, now is ${base64}`)

   })
   wx.readBLECharacteristicValue({
     deviceId: that.data.devices_data.deviceId,
     serviceId: electricity_data.service.uuid,
     characteristicId: electricity_data.characteristic.uuid,
     success: function(res) {
       console.log('读取电量成功', that.data.devices_data.deviceId, electricity_data.service.uuid, electricity_data.characteristic.uuid)
       console.log('readBLECharacteristicValue:', wx.arrayBufferToBase64(res.characteristic.value))

     },
   })



  },

checkCharacterict:function(){
  this.select_characteristics()
}



})
