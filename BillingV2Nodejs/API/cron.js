var mongoose   = require('mongoose');
mongoose.connect('mongodb://192.168.66.27/toxakz');
var CronJob = require("cron").CronJob;
_ = require('underscore');
errorBuilder = require('./helpers/mongoose/errorBuilder').buildError;
operationResultBuilder = require('./helpers/common/operationOutcome').buildOperationOutcome;


cronJobs = [];

//for(var i=0; i<100000; i++){
//    console.log('added task'+i);
//contextArray.push(new CronJob({
//
//    cronTime: '*/30 * * * * *',
//    onTick: function() {
//        var cron = this;
//        this.stop();
//        console.log('Started Прувэт!!!!'+new Date());
//
//        var RenterRepo = require('./dataLayer/repositories/renter/renterRepo');
//        RenterRepo.add(
//            {
//                name: "vasya",
//                surname: "pupkin",
//                fatherName: "alibabaevich",
//                birthDate: Date.parse("11/30/2011"),
//                homeAddress: "muhosransk",
//                registrationAddress: "magadan",
//                idDocument: "55744f62c5f0273018df0275"
//            }, function (data) {
//                console.log(data);
//                setTimeout(function() {
//                    console.log('Finished');
//                    cron.start();
//                }, 2000);
//            });
//    },
//    start: true,
//    timeZone: 'Asia/Almaty'}));
//}

//Добавление таска
addTask = function(cronJob){
    cronJobs.push(cronJob);
    console.log('добавили таск '+cronJob.taskName+' для объекта '+cronJob.obj);
    cronJob.start();
}

//Удаление таска
removeTask = function(taskName, obj){
    var deleted = false;
    var tmpCollection = _.filter(cronJobs, function(elem){return ((elem.taskName == taskName) && (elem.obj == obj))})
        _.each(tmpCollection, function(elem){
        elem.isDeleted = true;
        elem.stop();
        console.log('Остановили таск '+taskName+' для объекта '+obj);
        deleted = true;
    });
    if(deleted) {
        cronJobs = _.reject(cronJobs, function (elem) {
            return elem.isDeleted == true;
        });
        console.log('Удалили таск ' + taskName + ' для объекта ' + obj);

    }
}

//Функция начисления денюжки
acruelFunction = function(){
    var cron = this;
    var object = cron.obj;
    cron.stop();
   // console.log('Началось начисление для объекта '+object);
    require('./dataLayer/repositories/identity/organizationRepo').add({organizationName: cron.obj}, function(data){
        //console.log('Закончилось начисление для объекта '+object);
       // console.log(data.operationResult);
        if(!cron.isDeleted)
            cron.start();
    });
    //setTimeout(function() {
    //
    //
    //}, 2000);
}



//Добавляем таска вот так!
removeTask("Начисления", "Автомойка");
for(var i=0; i<10000; i++) {


    var someTask = new CronJob({
        cronTime: '*/5 * * * * *',
        onTick: acruelFunction,
        start: true,
        timeZone: 'Asia/Almaty',
    });
    someTask['taskName'] = 'Начисления';
    someTask['obj'] = "Автомойка";
    someTask['isDeleted'] = false;
    addTask(someTask);
}


////ПРосто для того чтобы проверить
//setTimeout(function() {
//    removeTask("Начисления", "Автомойка");
//    console.log(cronJobs);
//}, 120000);







