module.exports = {
  getFormatedHour: function (timeString) {
	var h = timeString % 12 || 12;
	var ampm = timeString < 12 ? "AM" : "PM";
	return  h + ampm;
  }
}  