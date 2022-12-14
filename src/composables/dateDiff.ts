const dateDiff = (startDate:Date, endDate:Date) => {
  var datedif = endDate.getTime() - startDate.getTime();

  var days = Math.floor(datedif / (1000 * 60 * 60 * 24));
  var hours = Math.floor((datedif % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((datedif % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((datedif % (1000 * 60)) / 1000);

  var dateDiffString = days + 'd ' + hours + 'h '+ minutes + 'm ' + seconds + 's';

  return { days, hours, minutes, seconds, dateDiffString }
}

export default dateDiff;