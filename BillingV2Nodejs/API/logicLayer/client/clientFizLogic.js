var ClientFizRepo = require('../../dataLayer/repositories/client/clientFizRepo');
var clientFizValidator = require(_helpersMongoosePath + 'validator');
var clientFizDefinition = require(_modelsPath + 'client/fizical/clientFiz');
var async = require('async');

var BalanceLogic = require('../../logicLayer/balance/balanceLogic');
var CalculationLogic = require('../../logicLayer/calculations/calculationLogic');
var TariffLogic = require('../../logicLayer/tariff/tariffLogic');
var mongoose = require('mongoose');
var _ = require('underscore');

exports.add = function (clientFiz, orgId, done) {

	clientFiz.organizationId = orgId;
	clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
		if (validationRes.operationResult == 0) {
			ClientFizRepo.add(clientFiz, function (data) {
				done(data);
			});
		}
		else {
			done(validationRes);
		}
	});
};

exports.getAll = function (orgId, done) {
	ClientFizRepo.getAll(orgId, function (data) {
		done(data);
	});
};

exports.getAllByControllerId = function (ctrlId, done) {
	ClientFizRepo.getAllByCtrlId(ctrlId, function (data) {
		done(data);
	});
};

exports.get = function (id, done) {
	ClientFizRepo.get(id, function (data) {
		return done(data);
	});
};

exports.update = function (clientFiz, done) {
	clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
		if (validationRes.operationResult == 0) {

			for (var i = 0; i < clientFiz.pipelines.length; i++)
				for (var j = 0; j < clientFiz.pipelines[i].counters.length; j++) {
					if (clientFiz.pipelines[i].counters[j].isCounterNew)
						clientFiz.pipelines[i].counters[j].isCounterNew = false;
				}

			ClientFizRepo.update(clientFiz, function (res) {
				return done(res);
			});
		}
		else {
			done(validationRes);
		}
	});
};

exports.sync = function (clientFizArr, done) {
	async.each(clientFizArr, function (clientFiz, callback) {
		clientFizValidator('clientFiz', clientFizDefinition, clientFiz, function (validationRes) {
			if (validationRes.operationResult == 0) {
				ClientFizRepo.update(clientFiz, function (res) {
					return callback();
				});
			}
			else {
				callback();
			}
		});
	}, function () {
		done({operationResult: 0});
	});
};

exports.delete = function (id, done) {
	ClientFizRepo.delete(id, function (res) {
		return done(res);
	});
};

exports.search = function (searchTerm, done) {
	ClientFizRepo.search(searchTerm, function (res) {
		return done(res);
	});
};

exports.updateClientCounter = function (body, userId, done) {

	var clientFiz = body.client;
	var pipeline = body.pipeline;
	var counter = body.counter;
	var period = body.period;

	var tariff = {
		water: 0,
		canal: 0
	};

	TariffLogic.getById(clientFiz.clientType.tariffId, function (tariffResp) {

		if (tariffResp.operationResult === 0)
			tariff = tariffResp.result;

		var waterCalcCubicMeters = 0;
		var canalCalcCubicMetersCount = 0;

		waterCalcCubicMeters = (counter.currentCounts - counter.lastCounts) * (pipeline.waterPercent / 100);
		canalCalcCubicMetersCount = (counter.currentCounts - counter.lastCounts) * (pipeline.canalPercent / 100);

		var waterSum = 0;
		var canalSum = 0;
		//if (counter.currentCounts > 0) {
		waterSum = waterCalcCubicMeters * tariff.water * -1;
		canalSum = canalCalcCubicMetersCount * tariff.canal * -1;
		//}

		var balanceId = mongoose.Types.ObjectId();
		var balanceTypeId = '55cdf641fb777624231ab6d9'; // начисление
		var balance = {
			_id: balanceId,
			balanceTypeId: balanceTypeId,
			clientFizId: clientFiz._id,
			sum: (waterSum + canalSum) * -1,
			period: period,
			//аудит
			date: new Date(),
			userId: userId
		};
		var balanceAvg = {};

		//добор/недобор
		var isShortage = false;
		var isShortageAvg = false;
		var shortageCubicMeters = 0;
		var shortageSum = 0;

		var calculation = {
			clientFizId: clientFiz._id,
			pipelineId: pipeline._id,
			counterId: counter._id,
			balanceId: balanceId,
			waterCubicMetersCount: waterCalcCubicMeters,
			canalCubicMetersCount: canalCalcCubicMetersCount,
			tariff: tariff,
			waterSum: waterSum,
			canalSum: canalSum,

			//считаем от минимума
			isShortage: isShortage, //добор/недобор,
			shortageCubicMeters: shortageCubicMeters, //недобор м3,
			shortageSum: shortageSum, //недобор тг

			period: period,
			//аудит
			date: new Date(),
			userId: userId
		};
		var calculationAvg = {};

		//находим предыдущие показания в этом периоде
		CalculationLogic.getByCounterId(counter._id, period, function (calcByCounterResp) {
			//если показания есть, то обновляем
			if (calcByCounterResp.operationResult === 0 && calcByCounterResp.result) {
				var calcRes = calcByCounterResp.result._doc;
				balance._id = calcRes.balanceId;
				calculation._id = calcRes._id;
				calculation.balanceId = calcRes.balanceId;

				BalanceLogic.update(balance, function (balanceResp) {
					CalculationLogic.update(calculation, function (calcResp) {
						clientFizRepo.update(clientFiz, function (counterResp) {
							done(counterResp);
						});
					});
				});

			} else {//иначе добавляем новые показания

				//расчет по "среднему" - когда старый счетчик снимался и "ввод" был без счетчика определенное кол-во времени
				var previousCounterIndex = pipeline.counters.length - 2;

				if (previousCounterIndex > 0 && !counter.isPrevAvgCalculated) {

					for (var i = 0; i < clientFiz.pipelines.length; i++)
						for (var j = 0; j < clientFiz.pipelines[i].counters.length; j++) {
							if (clientFiz.pipelines[i].counters[j]._id === counter._id) {
								clientFiz.pipelines[i].counters[j].isPrevAvgCalculated = true;
							}
						}

					var prevDate = pipeline.counters[previousCounterIndex].dateOfCurrentCounts;
					var currentDate = counter.dateOfCurrentCounts;
					//кол-во дней без счетчика
					var daysDifferenceCount = 0;
					if (currentDate && prevDate) {
						currentDate = new Date(currentDate);
						prevDate = new Date(prevDate);
						daysDifferenceCount = currentDate.getDate() - prevDate.getDate();
						var avgCountsPerMonth = pipeline.avg;

						var year = prevDate.getFullYear();
						var month = prevDate.getMonth() + 1;
						//узнаем кол-во дней в месяце, найдя последний день месяца
						var lastDayOfMonth = new Date(year, month, 0).getDate();
						//среднее за день (м3)
						var avgCountsPerDay = avgCountsPerMonth / lastDayOfMonth;
						var avgCountsByPeriod = avgCountsPerDay * daysDifferenceCount;
						var waterCount = avgCountsByPeriod * (pipeline.waterPercent / 100); //м3
						var canalCount = avgCountsByPeriod * (pipeline.canalPercent / 100); //м3
						var avgWaterSum = avgCountsByPeriod * waterCount * tariff.water * -1;
						var avgCanalSum = avgCountsByPeriod * canalCount * tariff.canal * -1;

						//
						var balanceIdForAvg = mongoose.Types.ObjectId();
						balanceAvg = _.extend(balanceAvg, balance);
						balanceAvg._id = balanceIdForAvg;
						balanceAvg.sum = (avgWaterSum + avgCanalSum) * -1;

						calculationAvg = _.extend(calculationAvg, calculation);
						calculationAvg.counterId = null; //без счетчика
						calculationAvg.balanceId = balanceIdForAvg;
						calculationAvg.waterCubicMetersCount = waterCount;
						calculationAvg.canalCubicMetersCount = canalCount;
						calculationAvg.waterSum = avgWaterSum;
						calculationAvg.canalSum = avgCanalSum;
					}
				}

				var minConsumption = clientFiz.clientType.minConsumption;
				if (minConsumption) {

					isShortage = calculation.waterCubicMetersCount < calculation.minConsumption;
					if (isShortage) {
						calculation.shortageCubicMeters = minConsumption ? minConsumption - calculation.waterCubicMetersCount : 0;
						calculation.shortageSum = calculation.shortageCubicMeters * tariff.water;
					}

					isShortageAvg = calculationAvg.waterCubicMetersCount < calculationAvg.minConsumption;
					if (isShortageAvg) {
						calculationAvg.shortageCubicMeters = minConsumption ? minConsumption - calculationAvg.waterCubicMetersCount : 0;
						calculationAvg.shortageSum = calculationAvg.shortageCubicMeters * tariff.water;
					}

				}
				BalanceLogic.addMany([balanceAvg, balance], function (balanceAvgResp) {
					CalculationLogic.addMany([calculationAvg, calculation], function (calculationAvgResp) {
						clientFizRepo.update(clientFiz, function (counterResp) {
							done(counterResp);
						});
					});
				});
			}

		});


	});

};

