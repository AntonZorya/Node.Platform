var dbmodule = angular.module('indexDBSample', []);

dbmodule.service('indexedDBDataSvc', function($window, $q){
  var indexedDB = $window.indexedDB;
  var db=null;
  var lastIndex=0;
  
  var open = function(){
    var deferred = $q.defer();
    var version = 1;
    var request = indexedDB.open("DbData", version);
  
    request.onupgradeneeded = function(e) {
      db = e.target.result;
  
      e.target.transaction.onerror = indexedDB.onerror;
  
      if(db.objectStoreNames.contains("collection")) {
        db.deleteObjectStore("collection");
      }
  
      var store = db.createObjectStore("collection",
        {keyPath: "id"});
    };
  
    request.onsuccess = function(e) {
      db = e.target.result;
      deferred.resolve();
    };
  
    request.onerror = function(){
      deferred.reject();
    };
    
    return deferred.promise;
  };
  
  var getDefiniteObject = function(id){
	  var deferred = $q.defer();
	  
	  if(db === null){
		  deferred.reject("IndexDB is not opened yet");
	  }
	  else{
		  var trans = db.transaction(["collection"], "readwrite");
		  var store = trans.objectStore("collection");
		  var defObjects = [];
		  
		  var keyRange = IDBKeyRange.lowerBound(0);
		  var cursorRequest = store.openCursor(keyRange);
		  
		  cursorRequest.onsuccess = function(e){
			  var result = e.target.result;
			  if(result === null || result === undefined){
				  deferred.resolve(defObjects);
			  }
			  else{
				  if(result.value.id == id){
					  defObjects.push(result.value);
				  }
				  if(result.value.id > lastIndex){
					  lastIndex = result.value.id;
				  }
				  result.continue();
			  }
		  };
		  
		  cursorRequest.onerror = function(e){
			  console.log(e.value);
			  deferred.reject("Something went wrong");
		  };
	  }
	  
	  return deferred.promise;
  };
  
  var getObjects = function(){
    var deferred = $q.defer();
    
    if(db === null){
      deferred.reject("IndexDB is not opened yet!");
    }
    else{
      var trans = db.transaction(["collection"], "readwrite");
      var store = trans.objectStore("collection");
      var objects = [];
    
      // Get everything in the store;
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);
    
      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;
        if(result === null || result === undefined)
        {
          deferred.resolve(objects);
        }
        else{
          objects.push(result.value);
          if(result.value.id > lastIndex){
            lastIndex=result.value.id;
          }
          result.continue();
        }
      };
    
      cursorRequest.onerror = function(e){
        console.log(e.value);
        deferred.reject("Something went wrong!!!");
      };
    }
    
    return deferred.promise;
  };
  
  var deleteObject = function(id){
    var deferred = $q.defer();
    
    if(db === null){
      deferred.reject("IndexDB is not opened yet!");
    }
    else{
      var trans = db.transaction(["collection"], "readwrite");
      var store = trans.objectStore("collection");
    
      var request = store.delete(id);
    
      request.onsuccess = function(e) {
        deferred.resolve();
      };
    
      request.onerror = function(e) {
        console.log(e.value);
        deferred.reject("User couldn't be deleted");
      };
    }
    
    return deferred.promise;
  };
  
  var addReadingToObject = function(id, serial, reading){
	  var deferred = $q.defer();
	  
	  if(db === null){
		  deferred.reject("IndexDB is not opened yet");
	  }
	  else{
		  var trans = db.transaction(["collection"], "readwrite");
		  var store = trans.objectStore("collection");
		  var obj;
		  
		  store.get(id).onsuccess = function(e){
			  obj = e.target.result;
			  
			  for(var i=0;i<obj.counters.length;i++){
				  if(obj.counters[i].serial == serial){
					  obj.counters[i].readings.push({
						  "reading": reading,
						  "readingDate": new Date(),
						  "wasOnline": false
					  });
					  break;
				  }
			  }
			  
			  var request = store.put(obj);
			  
			  request.onsuccess = function(e){
				  deferred.resolve();
			  };
			  
			  request.onerror = function(e){
				  console.log(e.value);
				  deferred.reject("Reading couldn't be inserted");
			  };
		  };
	  }
	  
	  return deferred.promise;
  };
  
  var addObject = function(object){
    var deferred = $q.defer();
    
    if(db === null){
      deferred.reject("IndexDB is not opened yet!");
    }
    else{
      var trans = db.transaction(["collection"], "readwrite");
      var store = trans.objectStore("collection");
      lastIndex++;
      var request = store.put({
        "id": lastIndex,
        "contractNum": object.contractNum,
		"objName": object.objName,
		"objAddress": object.objAddress,
		"counters": object.counters
      });
    
      request.onsuccess = function(e) {
        deferred.resolve();
      };
    
      request.onerror = function(e) {
        console.log(e.value);
        deferred.reject("Object couldn't be added!");
      };
    }
    return deferred.promise;
  };
  
  return {
    open: open,
    getObjects: getObjects,
    addObject: addObject,
    deleteObject: deleteObject,
	addReadingToObject: addReadingToObject,
	getDefiniteObject: getDefiniteObject
  };
  
});