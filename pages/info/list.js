// pages/info/info.js

// 获取服务器接口地址
const api = require('../../config/config.js');
// 获取app应用实例
const app = getApp();

Page({

  /**
   * Page initial data
   */
  data: {
    is_init: 0,
    categoryAndInfo: [],
    infoListBycategory: [],
    navList: [],
    goodsList: [],
    id: 11,
    scrollLeft: 0,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    size: 10000

  },

  /**
   * 获取分类和资讯
   */
  getCategoryAndInfo: function() {

    let that = this;

    wx.request({
      url: api.getInfosUrl,
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 20
      },
      success: function(res) {
        let data = res.data;
        console.log(data);

        let categories = data.categories

        if (data.code === '200') {
          that.setData({
            categoryAndInfo: categories,
            navList: categories,
            is_init: 1
          });
        }

      },
      error: function(err) {
        console.log(err);
      }
    });
  },

  /**
 * 根据分类获取资讯列表
 */
  getinfoListBycategory: function () {

    let that = this;

    console.log(this.data.id);

    wx.request({
      url: api.getInfoListByCategoryUrl,
      method: 'GET',
      data: {
        category_id: this.data.id + "",
        pageNum: 1,
        pageSize: 20
      },
      success: function (res) {
        let data = res.data;
        // console.log(data);

        console.log(data.category.articles)

        if (data.code === '200') {
          that.setData({
            goodsList: data.category.articles,
            infoListBycategory: data.category.articles,
          });

          //nav位置
          let currentIndex = 0;
          let navListCount = that.data.navList.length;
          for (let i = 0; i < navListCount; i++) {
            currentIndex += 1;
            if (that.data.navList[i].id == that.data.id) {
              break;
            }
          }
          if (currentIndex > navListCount / 2 && navListCount > 5) {
            that.setData({
              scrollLeft: currentIndex * 60
            });
          }

        }

      },
      error: function (err) {
        console.log(err);
      }
    });
  },

  switchCate: function (event) {

    console.log(event)
    if (this.data.id == event.currentTarget.dataset.id) {
      return false;
    }
    var that = this;
    var clientX = event.detail.x;
    var currentTarget = event.currentTarget;
    if (clientX < 60) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft - 60
      });
    } else if (clientX > 330) {
      that.setData({
        scrollLeft: currentTarget.offsetLeft
      });
    }
    this.setData({
      id: event.currentTarget.dataset.id
    });

    this.getinfoListBycategory();
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {

    var that = this;
    if (options.id) {
      that.setData({
        id: parseInt(options.id)
      });
    }

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    
    that.getCategoryAndInfo();
    that.getinfoListBycategory();

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {
    console.log('current page is onReady');

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {
    console.log('current page is onShow');

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})