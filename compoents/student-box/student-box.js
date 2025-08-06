// pages/work/student-box/student-box.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    information:{
      type:Object,
      value:null,
      observer:function(e) {
        this.formatDate(e.postDate)
        this.formatTimes(e.time.time.times)
      }
    }
  },

  data: {
    allWeek:["一","二","三","四","五","六","日"],
    formatedDate: null,
    timesFormat:null
  },
  lifetimes:{
    attached:function(){
      
    },
  },
  methods: {  
    formatDate: function(date) {  
      this.setData({  
        formatedDate: date.slice(0,10)  
      });  
    },
    formatTimes: function(times) {
      let timesFormat = []
      for(let i=0;i<4;i++){
        timesFormat.push(this.formatTime(times[i]))
      }
      this.setData({timesFormat:timesFormat})
    },
    formatTime:function convertToTime(minutes) {  
      let hours = Math.floor(minutes / 60);  
      let remainingMinutes = minutes % 60;  
      return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;  
  }
  }  
})