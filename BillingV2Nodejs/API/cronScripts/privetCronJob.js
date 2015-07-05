var CronJob = require("cron").CronJob;
var sleep = require("sleep");

module.exports=new CronJob({

  cronTime: '*/30 * * * * *',
  onTick: function() {
    var cron = this;
    this.stop();
  console.log('Started Прувэт!!!!'+new Date());
    setTimeout(function() {
      console.log('Finished');
      cron.start();
    }, 2000);
  },
  start: true,
  timeZone: 'Asia/Almaty'});

