module.exports = {
  /*
   * Name: getFormatedHour
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: show hour with AM and PM
   * @param  req
   */
  getFormatedHour: function (timeString) {
    var h = timeString % 12 || 12;
    var ampm = timeString < 12 ? "AM" : "PM";
    return h + ampm;
  },


  /*
   * Name: getFormatedHour
   * Created By: A-SIPL
   * Created Date: 20-dec-2017
   * Purpose: get the time in hour, min
   * @param  req
   */
  timeSince : function(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.abs(Math.floor(seconds)) + " seconds";
}
}
