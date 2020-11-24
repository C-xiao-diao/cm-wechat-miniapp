//registerTwo.js
Page({
  data: {
    address: '长沙市',
    schoolName: '',
    IDcard: '',
    realName: ''
  },
  onLoad: function () {
    
  },
  bindPickerChange: function(e){
    const value = e.detail.value;
    this.setData({ address: value[2]});
  },
  bindSchoolHandle: function(e){
    let schoolName = e.detail.value;
    this.setData({ schoolName });
  },
  bindIdCardHandle: function(e){
    let IDcard = e.detail.value;
    this.setData({ IDcard });
  },
  bindRealNameHandle: function(e){
    let realName = e.detail.value;
    this.setData({ realName });
  },
})