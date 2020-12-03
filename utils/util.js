import webConfig from "./../configs/config"
import "./fix"
import _ from "lodash";

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const http = {
  get: function (options, cb) {
    const app = getApp();
    const { cmd, method = "GET", data = {}, header = { uid: app && app.globalData.userId },
      success = () => { }, fail = () => { wx.showToast({ title: '操作失败', icon: 'error', duration: 2000 }) },
      complete = () => { wx.hideLoading() } } = options;
    try {
      let url = "";
      if (webConfig.port) {
        url = webConfig.protocol + "://" + webConfig.host + ":" + webConfig.port + `${cmd}`;
      } else {
        url = webConfig.protocol + "://" + webConfig.host + `${cmd}`;
      }
      if (app.globalData.userId) {
        wx.request({ url, method, header, data, success, fail, complete, });
      } else {
        wx.request({ url, method, data, success, fail, complete });
      }
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none', duration: 2000 })
    }
  },
  post: function (options, cb) {
    const app = getApp();
    const { cmd, method = "POST", header = { uid: app && app.globalData.userId }, data = {}, success = () => { }, fail = () => { wx.showToast({ title: '操作失败', icon: 'error', duration: 2000 }) }, complete = () => { wx.hideLoading() } } = options;
    try {
      let url = "";
      if (webConfig.port) {
        url = webConfig.protocol + "://" + webConfig.host + ":" + webConfig.port + `${cmd}`;
      } else {
        url = webConfig.protocol + "://" + webConfig.host + `${cmd}`;
      }
      if (app.globalData.userId) {
        wx.request({ url, method, header, data, success, fail, complete });
      } else {
        wx.request({ url, method, data, success, fail, complete });
      }
    } catch (e) {
      wx.showToast({ title: '操作失败', icon: 'none', duration: 2000 })
    }
  },
}

const returnFloat = value => {
  var v = Math.round(parseFloat(value) * 100) / 100;
  var x = v.toString().split(".");
  if (x.length == 1) {
    v = v.toString() + ".00";
    return v;
  }
  if (x.length > 1) {
    if (x[1].length < 2) {
      v = v.toString() + "0";
    }
  }
  return v;
}

module.exports = {
  formatTime: formatTime,
  http: http,
  returnFloat: returnFloat,
}
