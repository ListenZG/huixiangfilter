
var Paho = require('./dist/mqttws31.js');

(function(){
  var uuid = guid()
// console.log(uuid)
//443
var client = new Paho.MQTT.Client('filter-rfsmart.mqtt.iot.gz.baidubce.com',8884,uuid );
  
  function client_connection(toppic,result) {
    client.connect({
     
      userName: 'filter-rfsmart/device01',
    
      password: 'qADFH/nF1pKWPXpkPTLWfW2GiuhB5FElCSAdEnEp87E=',
      useSSL: true,
      cleanSession: false,
      keepAliveInterval: 10,
      reconnect: true,
      onSuccess: function (res) {

        result(true)

        client.subscribe(toppic, {
          qos: 1
        });
        

      },
      onFailure: function (error) {
        console.log(error)
        result(false)
      }

    }); 

    client.onConnectionLost = function (responseObject) {
      if (responseObject.errorCode !== 0) {
          result(false)
         console.log("onConnectionLost:" + responseObject.errorMessage);
      }
    }
  }

  function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
function rev_message(callback){
  client.onMessageArrived = function (msg) {
    // console.log(msg)
    callback(msg.topic,msg.payloadString)
  }
}
  function send_message(toptic,sendMsg){
  var message = new Paho.MQTT.Message(sendMsg);
  message.destinationName = toptic;
  client.send(message);
}

module.exports={
  client_connection: client_connection,
  rev_message: rev_message,
  send_message: send_message

}
})()















