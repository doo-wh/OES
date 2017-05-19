/**
 * Created by Donghuating on 2017-03-26 下午 3:24.
 */
(function () {
    var oesModule = angular.module('oesModule', ['ngRoute', 'ngDialog']);
    oesModule.factory('listFactory', function ($q, $http) {
        var service = {};
        service.getList1 = function (url, params) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: url,
                params: {page: params}
            }).then(function (res) {
                if (res.data.state) {
                    defer.resolve(res.data.list);
                }
            });
            return defer.promise;
        };
        service.getList2 = function (url, params) {
            var defer = $q.defer();
            $http({
                method: 'POST',
                url: url,
                data: $.param(params),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    defer.resolve(res.data.list);
                }
            });
            return defer.promise;
        };
        return service;
    });
    oesModule.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/home', {
                templateUrl: 'index.php/home',
                controller : 'main-controller',
                resolve : {
                    noticeList : function (listFactory) {
                        return listFactory.getList2('/notice/getNoticeList', {keywords: '', page: 1,current : 'index'})
                    },
                    slideList : function (listFactory) {
                        return listFactory.getList2('/slideshow/getSlideList', {limit : 4});
                    }
                }
            })
            .when('/company', {
                templateUrl: 'index.php/company',
                controller: 'find-company-controller'
            })
            .when('/send', {
                templateUrl: 'index.php/send',
                controller: 'send-controller'
            })
            .when('/center', {
                templateUrl: 'index.php/user/loadCenter',
                controller: 'center-controller'
            })
            .when('/message', {
                templateUrl: 'index.php/message/loadMsg',
                controller: 'msg-controller',
                resolve: {
                    messageList: function (listFactory) {
                        return listFactory.getList1('/message/msgList?t=' + new Date().getTime(), 1);
                    }
                }
            })
            .when('/record', {
                templateUrl: 'index.php/status/loadStatus',
                controller: 'record-controller'
            })
            .when('/personal_logistics', {
                templateUrl: 'index.php/status/loadPerLog',
                controller: 'personal-log-controller',
                resolve: {
                    expressList: function (listFactory) {
                        return listFactory.getList1('/status/personalList?t=' + new Date().getTime(), 1);
                    }
                }
            })
            .when('/all_logistics', {
                templateUrl: 'index.php/status/loadCompanyLog',
                controller: 'company-log-controller',
                resolve: {
                    expressList: function (listFactory) {
                        return listFactory.getList1('/status/companyList?t=' + new Date().getTime(), 1);
                    }
                }
            })
            .when('/add_company', {
                templateUrl: 'index.php/company/loadCompany',
                controller: 'company-controller'
            })
            .when('/add_company_user', {
                templateUrl: 'index.php/user/loadCompanyUser',
                controller: 'add-c-user-controller'
            })
            .when('/company_user_list', {
                templateUrl: 'index.php/user/loadCompanyUserList',
                controller: 'list-c-user-controller',
                resolve: {
                    userList: function (listFactory) {
                        return listFactory.getList2('/user/getUserList', {power: 2, keywords: '', page: 1});
                    }
                }
            })
            .when('/user_list', {
                templateUrl: 'index.php/user/loadUserList',
                controller: 'list-o-user-controller',
                resolve: {
                    userList: function (listFactory) {
                        return listFactory.getList2('/user/getUserList', {power: 1, keywords: '', page: 1});
                    }
                }
            })
            .when('/company_list', {
                templateUrl: 'index.php/company/loadList',
                controller: 'company-list-controller',
                resolve: {
                    companyList: function (listFactory) {
                        return listFactory.getList2('/company/getCompanyList', {keywords: '', page: 1});
                    }
                }
            })
            .when('/add_system_user', {
                templateUrl: 'index.php/user/loadSystemUser',
                controller: 'list-s-user-controller'
            })
            .when('/list_system_user', {
                templateUrl: 'index.php/user/loadSystemUserList',
                controller: 'list-s-user-controller',
                resolve: {
                    userList: function (listFactory) {
                        return listFactory.getList2('/user/getUserList', {power:3 ,keywords: '', page: 1});
                    }
                }
            })
            .when('/notice_list', {
                templateUrl: 'index.php/notice/loadNoticeList',
                controller: 'notice-controller',
                resolve : {
                    noticeList : function (listFactory) {
                        return listFactory.getList2('/notice/getNoticeList', {keywords: '', page: 1})
                    }
                }
            })
            .when('/add_notice', {
                templateUrl: 'index.php/notice/loadNotice',
                controller: 'add-notice-controller'
            })
            .when('/add_ad', {
                templateUrl: 'index.php/Slideshow/loadSlide',
                controller: 'add-slide-controller'
            })
            .when('/ad_list', {
                templateUrl: 'index.php/Slideshow/loadSlideList',
                controller: 'slide-controller',
                resolve : {
                    slideList : function (listFactory) {
                        return listFactory.getList2('/slideshow/getSlideList', {page : 1});
                    }
                }
            })
            .when('/express', {
                templateUrl: 'index.php/home/loadExpress',
                controller: 'express-detail-controller'
            })
            .otherwise({
                redirectTo: '/home'
            })
    }]);
    window.oesModule = oesModule;
})();