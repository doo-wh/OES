/**
 * Created by Donghuating on 2017-03-26 下午 3:24.
 */
(function () {
    var oesModule = angular.module('oesModule', ['ngRoute']);
    oesModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl:'index.php/home/index'
            })
            .when('/company', {
                templateUrl: 'index.php/company/index'
            })
            .when('/send', {
                templateUrl: 'index.php/send/index'
            })
            .otherwise({
                redirectTo: '/home'
            })
    }]);
    window.oesModule = oesModule;
})();