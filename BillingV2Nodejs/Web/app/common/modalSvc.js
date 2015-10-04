billingApplication.service('modalSvc', ['$http', '$q', '$location', '$window', '$cookieStore', 'API_HOST', '$compile', modalSvc]);

function modalSvc($http, $q, $location, $window, $cookies, API_HOST, $compile) {

    var self = this;

    this.modals = [];

    this.resolveModal = function (modalName) {
        _.find(this.modals, function (modal) {
            return modal.modalName == modalName
        }).isResolved = true;
    }

    this.isResolved = function (modalName) {
        return _.find(this.modals, function (modal) {
            return modal.modalName == modalName
        }).isResolved;
    }

    this.isOkClicked = function (modalName) {
        return _.find(this.modals, function (modal) {
            return modal.modalName == modalName
        }).okClicked;
    }

    this.closeModal = function (modalName) {
        _.find(this.modals, function (modal) {
            return modal.modalName == modalName
        }).okClicked = true;
        $(_.find(this.modals, function (modal) {
            return modal.modalName == modalName
        }).elem).modal('hide');
    }

    this.removeModal = function (modalName) {
        $(_.find(this.modals, function (modal) {
            return modal.modalName == modalName
        }).elem).remove();
        this.modals = _.reject(this.modals, function (modal) {
            return modal.modalName == modalName
        });
    }

    this.yesNoModal = function (icon, header, text, noText, yesText, $scope) {
        var deferred = $q.defer();
        $scope.modalHeader = header;
        $scope.modalIcon = icon;
        $scope.modalText = text;
        $scope.modalNoText = noText;
        $scope.modalYesText = yesText;
        this.showModal("/app/Common/modals/yesNoModal.html", "yesNoModal", $scope).then(function (data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    this.elementScope = {};

    this.showModal = function (url, modalName, $scope) {
        self.elementScope = $scope;
        var deferred = $q.defer();
        var that = this;
        $http.get(url).then(function (data) {
            var elem = $(data.data);
            var compiledElem = $compile(elem);
            var element = compiledElem($scope);

            that.modals.push({elem: element, isResolved: false, modalName: modalName, okClicked: false});

            element.modal({
                closable: false, onDeny: function () {
                    return that.isResolved(modalName);
                }, onApprove: function () {
                    return that.isResolved(modalName);
                }, onHidden: function () {
                    deferred.resolve(that.isOkClicked(modalName));
                    that.removeModal(modalName);
                },
                onVisible: function () {
                    element.modal("refresh");
                }
            }).modal('show');
        });

        return deferred.promise;
    }


}