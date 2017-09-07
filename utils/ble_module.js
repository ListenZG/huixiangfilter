
(function(){

  var littleEndian = (function () {
    var buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    return new Int16Array(buffer)[0] === 256;
  })();

var lishen = {}

  var num = (function () {
    var a = 0;
    return function (pare) {
      if(pare){
      a=0;
      }
      else{
        a++;
      }
      
      return a;
    }
  })()
  var BleList=(function(){
    var list=[]
    return function(dev){
      
      if(dev){
        list.unshift(dev)
      }
      return list
    }

  })()

var myDevice={

  available:false,
  deviceId: "15:0F:DE:7D:78:F5",
  primaryServiceUUID: '0000180A-0000-1000-8000-00805F9B34FB', 
  devices_data: [],
  devices_data_services: [],
  
  
  steps_uuid: '0000FFEE-0000-1000-8000-00805F9B34FB',
  steps_data: {},
  steps_data_count: '6521',
  //写入
  shock_uuid: '0000FFE9-0000-1000-8000-00805F9B34FB',
  shock_data: {},

  //read
  electricity_uuid: '0000FFE4-0000-1000-8000-00805F9B34FB',
  electricity_data: {},
  electricity_data_surplus: '80%',


  deviceInfo_data:false,
  deviceInfo_uuid:'00002A24-0000-1000-8000-00805F9B34FB',

}

 function create_ble(device){
   this.name=device.name
   
 }

  create_ble.prototype.connection=function(){

  }

  function ble_connection(device,callback) {
     myDevice.deviceId=device.deviceId;
  
     wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        console.log('停止搜索周边蓝牙设备');
      },
    })
    wx.createBLEConnection({
      deviceId: device.deviceId,
      success: function(res) {
        console.log('连接手环', device.name, res)
        wx.onBLEConnectionStateChange(function (res) {
          if(res.connected){
             wx.showToast({
               title: device.name + '已连接',
             })
          }
          else{
           wx.showToast({
             title: device.name+'已断开连接啦',
           })
          }
        })
        wx.getBLEDeviceServices({
          deviceId: myDevice.deviceId,
          success: function(res) {
    
            console.log('获取设备的服务', res.services, device.deviceId)
            var num = 0;
            res.services.forEach(function(item,index,array){
            // if(item.uuid == myDevice.primaryServiceUUID){
              wx.getBLEDeviceCharacteristics({
                deviceId: myDevice.deviceId,
                serviceId: item.uuid,
                success: function (res) {

                  console.log(res.characteristics.length, '获取设备服务特征值characteristic', res.characteristics)
                  array[index].characteristics = res.characteristics;
                  myDevice.devices_data_services = array;

                 
                },
                fail: function (er) {
                 
                  console.log('error', er)
                },
                complete: function () {
                  num++;
                  if(num == array.length){
                    console.log('complete')
                    select_characteristics()
                  }
                
                }
              })
            // }
            
            })


          },
        })

      },
    })
   

  }
  function select_characteristics() {


    var services_list = myDevice.devices_data_services;


    var deviceInfo = { service: false, characteristic: false };
    var steps = { service: false, characteristic: false };

    var shock = { service: false, characteristic: false };

    var electricity = { service: false, characteristic: false }

    console.log('封装好的服务，特征值列表', services_list)

    services_list.forEach(function (value, index, array) {
      if (value.characteristics){
        array[index].characteristics.forEach(function (values, indexs, arrays) {
          console.log('{{设备的特征值' + values.uuid, '}}')
          if (values.properties.notify) {
            wx.notifyBLECharacteristicValueChange({
              state: true, // 启用 notify 功能
              // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
              deviceId: myDevice.deviceId,
              // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取
              serviceId: value.uuid,
              // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取
              characteristicId: values.uuid,
              success: function (res) {
                console.log('notifyBLECharacteristicValueChange success', res.errMsg)
              }
            })
          }
          if (values.uuid == myDevice.steps_uuid) {
            console.log('找到步数特征值', values)
            steps.service = value;
            steps.characteristic = values;

            myDevice.steps_data = steps

          }
          if (values.uuid == myDevice.shock_uuid) {
            console.log('找到震动特征值', values)
            shock.service = value;
            shock.characteristic = values;
            myDevice.shock_data = shock

          }
          if (values.uuid == myDevice.electricity_uuid) {
            console.log('找到电量信息特征值', values)
            electricity.service = value;
            electricity.characteristic = values;

            myDevice.electricity_data = electricity

          }
          if (values.uuid == myDevice.deviceInfo_uuid) {
              deviceInfo.characteristic=values;
              deviceInfo.service=value;
              myDevice.deviceInfo_data=deviceInfo;
            console.log('找到一个未知的特征值')

          }


        })
      }
    


    })


  }
   function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }
  
  function ble_rev_message(callback) {
    // var deviceId='560A05D4-3E7A-4938-8CE2-1C5964A9E71F'
    // var serviceUUID='0000180F-0000-1000-8000-00805F9B34FB'
    // var charUUID='00002A19-0000-1000-8000-00805F9B34FB'

    var electricity_data = myDevice.electricity_data;
     console.log(myDevice.deviceId,'\n', electricity_data.service.uuid,'\n', electricity_data.characteristic.uuid)
     wx.onBLECharacteristicValueChange(function (res) {

       var dataViiew = new DataView(res.value);

       var array = new Uint8Array(res.value);
       console.log('收到的数据',array)
      //  console.log(dataViiew.byteLength)
      //  var v1 = dataViiew.getUint16(0)
      //  var v2 = dataViiew.getUint8(2)
      //  var v3 = dataViiew.getUint8(3);
      //  var v4 = dataViiew.getUint32(4,false)
      
      //  console.log('收到的数据',v1,v2,v3,v4);

    //   var data ={
    //     v1:v1,
    //     v2:v2,
    //     v3:v3,
    //     v4:v4,
    //   }
    //  callback(data)
      
    })
return;
    wx.readBLECharacteristicValue({

      deviceId: myDevice.deviceId,
      serviceId: electricity_data.service.uuid,
      characteristicId: electricity_data.characteristic.uuid,

      // deviceId:deviceId,
      // serviceId:serviceUUID,
      // characteristicId:charUUID,

      success: function (res) {
        console.log('读取电量成功readBLECharacteristicValue:', res.errMsg)
      },
      fail:function(er){
        console.log('readBLECharacterist--ERROR',er)
      }
    })
  }

  function ble_send_message(pare){

    console.log('start write' ,pare)

    var shockdata = myDevice.shock_data;

    // 向蓝牙设备发送一个0x00的16进制数据
    let buffer = new ArrayBuffer(16)
    // let dataView = new DataView(buffer)
    // dataView.setUint16(0, 253)
    // dataView.setUint8(2, pare)
    // dataView.setUint8(3, 1)
    // dataView.setUint32(4,15,false)
    var n =new Uint8Array(buffer);
    for(var i=0;i<n.length;i++)
    {
      n[i] = pare;
    }
     console.log(n);

    wx.writeBLECharacteristicValue({
      deviceId: myDevice.deviceId,
      serviceId: shockdata.service.uuid,
      characteristicId: shockdata.characteristic.uuid,
      // 这里的value是ArrayBuffer类型
      value: buffer,
      success: function (res) {
        console.log('writeBLECharacteristicValue success', res)
      }
      ,fail:function(err){
        console.log('writeBLECharacteristicValue err', err)
      }
      ,complete:function(){
        console.log('writeBLECharacteristicValue complate')
      }
    })
  }
  function ble_discoverList(callback){

    wx.openBluetoothAdapter({
      success: function(res) {
        
        wx.getBluetoothAdapterState({
          success: function(res) {
            myDevice.available = res.available;
            wx.onBluetoothAdapterStateChange(function (res) {
              
              if (res.available){
            
              }
              else{
            
              }
              myDevice.available = res.available;
            });
            wx.startBluetoothDevicesDiscovery({
              services: [],
              success: function(res) {
               
                wx.getBluetoothDevices({
                  success: function (res) {
                    res.devices.forEach(function (item, index, array) {

                      BleList(item)

                    })
                    console.log('一共发现蓝牙设备', BleList());
                    callback(BleList())

                  },
                })
                wx.onBluetoothDeviceFound(function(res){
                  // BleList(res.devices[0])
                  // console.log('新发现蓝牙设备列表', res);
                  res.devices.forEach(function (ite,index,array){
                    console.log('新发现蓝牙设备', ite);
                    BleList(ite)
                  })
                 
                  callback(BleList())
                  
                })



              },
            })
             
           
          },
          fail:function(err){
            device.available = res.available;
            // wx.showModal({
            //   title: 'error',
            //   content: err.errMsg,
            // })
          }
        })

      },
      fail:function(err){
        callback([])
        // wx.showModal({
        //   title: 'error',
        //   content: err.errMsg,
        // })
      }

    })
  }

module.exports = {
  ble_discoverList: ble_discoverList,
  ble_connection: ble_connection,
  ble_rev_message: ble_rev_message,
  ble_send_message: ble_send_message

}


})()