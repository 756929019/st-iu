//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js')
var db_api = require('../../utils/db_api.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    imgUrls: [
      { img: '../../images/temp_img8.jpg', txt1: '记录分享', txt2: '旅行中的点点滴滴', link: '../user/user' },
      { img: '../../images/temp_img2.jpg', txt1: 'xx旅行', txt2: '随时随地陪伴你', link: '../user/user'},
      { img: '../../images/temp_img4.jpg', txt1: '分享你的经验', txt2: '让更多的人爱上旅行', link: '../user/user' },
      { img: '../../images/temp_img5.jpg', txt1: '分享你的经验', txt2: '让更多的人爱上旅行', link:'../user/user' }
    ],
    addr: [],
    travels: [],
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      tag: "知名情感博主",
      answer: 134,
      listen: 2234
    }]
  },
  viewTrip: function (e) {
    console.log("/pages/travels/trip/trip?id=1&name=xxx");
    //const ds = e.currentTarget.dataset;
    wx.navigateTo({
      //url: `../trip/trip?id=${ds.id}&name=${ds.name}`,
      url: '/pages/travels/trip/trip?id=1&name=xxx',
    })
  },
  onReady: function () {
    //netUtil.getMusicList();
  },

  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 100;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
    db_api.getAddrList({
      where: {
        //_openid: this.data.openid
        type: '1'
      },
      success: (res) => {
       
        that.setData({
          addr: res.data,
        });
      },
      fail: (err) => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      },
    });
    
    db_api.getTravelsList({
      skip: 0,
      success: (res) => {
        res.data = that.data.travels.concat(res.data);
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].date = util.formatDate(res.data[i].date)
        }
        that.setData({
          travels: res.data//JSON.stringify(res.data, null, 2)
        })
      },
      fail: (err) => {
        wx.hideToast();
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      },
    });
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  onShow() {
  },

  error(e) {
    console.log(e.detail)
  },
  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  //点击图片触发事件
  swipclick: function (e) {
    console.log(this.data.swiperCurrent);
    wx.switchTab({
      url: this.data.imgUrls[this.data.swiperCurrent].link
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  }
})
