/**
 * Created by Donghuating on 2017-05-10 下午 7:24.
 */
'use strict';
(function () {
    oesModule.controller('main-controller', function ($scope, $http, $location, $routeParams, ngDialog, noticeList, slideList) {
        //快递单号
        $scope.code = '';

        $scope.express = '';
        var host = $location.host();

        $scope.noticeList = noticeList.list;
        $scope.slideList = slideList.list;
        $scope.cursor =[];
        for(var i=0; i<$scope.slideList.length; i++) {
            $scope.cursor.push(i);
        }

        $('#index_carousel').carousel({
            interval: 2000
        });

        /**
         * 查询快递详情
         */
        $scope.findExpress = function (code) {
            window.location.href = 'http://' + host + '#/express?code=' + code;
        };
        var code = $routeParams.code;
        if(code) {
            $http({
                method:'GET',
                url:'/status/getExpress?t='+new Date().getTime(),
                params : {code :code}
            }).then(function (res) {
                if(!res.data.state){
                    return ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                }
                $scope.express = res.data.list;
            },function () {
                ngDialog.open({
                    template: '<div>查询请求失败</div>',
                    plain: true
                });
            })
        }

        $scope.view = function (index) {
            $scope.viewId = index;
            $('#notice_index').modal('show');
        };
    });
})();