const db = wx.cloud.database();
const app = getApp()

const wx_Db = (params,tab) => {
  var _query = db.collection(tab);
  if (params.where)
  {
    _query = _query.where(params.where);
  }
  if (params.skip) {
    _query = _query.skip(params.skip);
  }
  _query = _query.limit(app.pagesize);
  _query.get({
  success: res => {
    if (params.success) {
      params.success(res);
    }
    console.log('[数据库] [查询记录] 成功: ', res)
  },
  fail: err => {
    if (params.fail) {
      params.fail(err);
    }
    console.error('[数据库] [查询记录] 失败：', err)
  }
  })
};
const getAddrList = (params) => {
  wx_Db(params, 'addr');
};
const getTravelsList = (params) => {
  wx_Db(params, 'travels');
};

module.exports = {
  getAddrList,
  getTravelsList,
};
