/**
 * Created by Donghuating on 2017-03-26 下午 3:26.
 */
'use strict';
(function () {
    oesModule.controller('home-controller', function ($scope, $http, $location, ngDialog) {
        //控制侧边导航的显示
        $scope.opened = false;

        //获取当前host
        var host = $location.host();
        /**
         * 退出登录
         */
        $scope.logOut = function () {
            $http({
                method: 'GET',
                url: '/login/out'
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>退出成功</div>',
                        plain: true
                    });
                    var host = $location.host();
                    window.location.href = 'http://' + host;
                    return;
                }
                ngDialog.open({
                    template: '<div>退出失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>请求退出中断</div>',
                    plain: true
                });
            })
        };

        //控制nav的选中样式
        $scope.selectArr = [false, false, false];
        $scope.changeStyle = function (num) {
            for (var i = 0; i < $scope.selectArr.length; i++) {
                if (num == i) {
                    $scope.selectArr[num] = true;
                } else {
                    $scope.selectArr[i] = false;
                }
            }
        };

        /**
         * 打开侧边导航
         */
        $scope.openNav = function () {
            $scope.opened = true;
        };

        /**
         * 关闭侧边导航
         */
        $scope.closeNav = function () {
            $scope.opened = false;
        };

        /**
         * 路由跳转
         */
        $scope.goPage = function (path) {
            window.location.href = 'http://' + host + path;
        }
    });
})();