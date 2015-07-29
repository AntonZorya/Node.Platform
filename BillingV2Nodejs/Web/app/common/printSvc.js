billingApplication.service("printSvc", ["$q", printSvc]);

function printSvc($q) {
    this.printHtml = function (html) {
        var deferred = $q.defer();
        var hiddenFrame = $('<iframe style="display: none"></iframe>').appendTo('body')[0];
        hiddenFrame.contentWindow.printAndRemove = function() {
            hiddenFrame.contentWindow.print();
            $(hiddenFrame).remove();
        };
        var htmlContent = "<!doctype html>"+
            "<html>"+
            '<body onload="printAndRemove();">' +
            html +
            '</body>'+
            "</html>";
        var doc = hiddenFrame.contentWindow.document.open("text/html", "replace");
        doc.write(htmlContent);
        deferred.resolve();
        doc.close();
        return deferred.promise;
    };
}
