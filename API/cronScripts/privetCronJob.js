var CronJob = require("cron").CronJob;

module.exports=new CronJob('30 * * * * *', function() {
  console.log('Прувэт!!!!'+new Date());
}, null, true, 'Asia/Almaty');

