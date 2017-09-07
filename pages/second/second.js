var wxCharts = require('../../utils/dist/wxcharts.js');
var client = require('../../utils/mqtt_module.js');

var ble = require('../../utils/ble_module.js');

var app = getApp()
var columnChart = {};
var chartData = {
  main: {
    title: '总成交量',
    data: [15, 20, 87, 99,25],
    categories: ['1号', '2号', '3号', '4号'],
    date: ['2015.02.14', '2017.09.14', '2016.12.21', '2017.02.24']
  }
};

var datas = [
  [{
    name: '成交量1',
    data: 20,
  },
  {
    name: '成交量2',
    data: 80,
    }],
     [{
      name: '成交量1',
      data: 20,
    },
    {
      name: '成交量2',
      data: 80,
    }],
     [{
      name: '成交量1',
      data: 20,
    },
    {
      name: '成交量2',
      data: 80,
    }]

];

var pieCanvasData = [{
  name: '滤芯1',
  data: 20,
},
  {
    name: '滤芯2',
    data: 10,
  },
  {
    name: '滤芯3',
    data: 55,
  },
  {
    name: '滤芯4',
    data: 15,
  }];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chartTitle: '滤芯使用寿命',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    wx.setNavigationBarTitle({
      title: '净水器滤芯',
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var windowWidth = 320;

    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;

    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

      columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: chartData.main.categories,
      series: [{
        name: '使用量',
        
        data: chartData.main.data,

        format: function (val, name) {

          return val + '%';
        }
      }],
      yAxis: {
        format: function (val) {
          return val + '%';
        },
        
        title: '',
        min: 0
      },
      xAxis: {
        // gridColor:'green',
        // fontColor:'red',
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth-36,
      height: 200,
    });
   var pieChart = new wxCharts({
        animation: true,
        canvasId: 'pieCanvas',
        type: 'pie',
        series: pieCanvasData,
        width: (windowWidth - 36),
        height: 200,
        dataLabel: false,
      });

  
    // datas.forEach(function(index,array){
    //   console.log(index,array,array[index].name);
    //   pieChart = new wxCharts({
    //     animation: true,
    //     canvasId: String(index),
    //     type: 'pie',
    //     series: array[index],
    //     width: (windowWidth - 36),
    //     height: 100,
    //     dataLabel: false,
    //   });
    // })
  
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
  touchHandler:function(e){
    var index = columnChart.getCurrentDataIndex(e);
    var title = chartData.main.date[index];
    if(index<0){
      return;
    }
    wx.showModal({
      title:'滤芯' + String(index),
      content:'生产日期:' +  String(title)+'\n\n\n'+"净水量" + '06L'
      
      ,
    })

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
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
  shopClick: function () {
    wx.navigateTo({
      url: '../shop/index',
    })
  }
})