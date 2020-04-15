// pages/travels/travels.js
const app = getApp()
var util = require('../../utils/util.js')
var db_api = require('../../utils/db_api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    travels:[],
    cpage:1,
    selectPost: false,
    mengShow: false,//蒙层的显示与否
    aniStyle: true    //动画效果，默认slideup     
  },
  postCilck:function(e)
  {
    var selectPost = this.data.selectPost;
    if (selectPost)
    {
      
      this.outbtn();
    }
    else{
      this.setData({
        selectPost: true,
      });
      this.showMeng();
    }
  },
  inbtn: function (e) {          //这个事件必须有，就算不做什么事情也要写上去，因为这个事件是为了防止事件冒泡，导致点击in-list这里面的元素时，点击事件冒泡到list-fix触发它的slidedown事件。
    console.log("in")
  },  
  outbtn: function (e) {           //这是list-fix的点击事件，给它绑定事件，是为了实现点击其它地方隐藏蒙层的效果
    var that = this;
    this.setData({
      selectPost: false,
      aniStyle: false//设置动画效果为slidedown
    })
    setTimeout(function () {       //延时设置蒙层的隐藏，这个定时器的时间，就是slidedown在css动画里设置的时间，这样就能实现slidedown动画完成后，蒙层才消失的效果。不设置定时器会导致动画效果看不见
      that.setData({
        mengShow: false
      })
    }, 150)
  },
  //蒙层的显示
  showMeng: function (e) {         //这是“确认下单”这整个购物车导航栏的点击事件
    this.setData({
      mengShow: true,           //蒙层显示
      aniStyle: true　　　　　　　　//设置动画效果为slideup
    })
  },
  
  viewTrip: function(e) {
    console.log("/pages/travels/trip/trip?id=1&name=xxx");
    //const ds = e.currentTarget.dataset;
    wx.navigateTo({
      //url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
      url: '/pages/travels/trip/trip?id=1&name=xxx',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getDataList: function () {
    var that = this;
    var skip = (that.data.cpage - 1) * app.pages;
    skip = 0;
    db_api.getTravelsList({
      skip: skip,
      success: (res) => {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].date = util.formatDate(res.data[i].date)
        }
        res.data = that.data.travels.concat(res.data);
        that.setData({
          cpage: that.data.cpage+1,
          travels: res.data//JSON.stringify(res.data, null, 2)
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: (err) => {
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      },
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getDataList();
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
    //wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      cpage: 1,
      travels: []
    })
    this.getDataList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getDataList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '分享标题',
      desc: '分享描述',
      path: '/page/travels/travels'
    }
  }
})