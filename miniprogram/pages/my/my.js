var app = getApp();

Page({
  	data: {
  		userInfo: {},
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      mode: ['我的游记','我的账本','我喜欢的','设置','关于我们']
  	},
    onGotUserInfo: function (e) {
      console.log(e.detail.errMsg)
      console.log(e.detail.userInfo)
      console.log(e.detail.rawData)
    },
  	onLoad: function() {
    	var that = this;
  	},
 
})