var CronJob = require("cron").CronJob;
var sleep = require("sleep");

module.exports=new CronJob('* * * * * *', function() {
  console.log('Started Прувэт111111'+new Date());
  console.log('finished1111111'+new Date());
}, null, true, 'Asia/Almaty');

