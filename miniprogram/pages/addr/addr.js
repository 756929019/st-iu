// pages/addr/addr.js
const app = getApp()
var util = require('../../utils/util.js')
var db_api = require('../../utils/db_api.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addr: [],
    cpage: 1,
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
    db_api.getAddrList({
      skip: skip,
      success: (res) => {
        res.data = that.data.addr.concat(res.data);
        that.setData({
          cpage: that.data.cpage + 1,
          addr: res.data//JSON.stringify(res.data, null, 2)
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

//多显示几条
    this.getDataList();

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
    this.setData({
      cpage: 1,
      addr: []
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

  }
})