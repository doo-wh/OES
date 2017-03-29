/**
 * Created by Donghuating on 2017-03-26 下午 3:26.
 */

(function () {
    'use strict';
    var loginModule = angular.module('loginModule', ['ngDialog']);
    loginModule.controller('login-register-controller', function ($scope, $http, $location, ngDialog) {
        /**
         *以下为登录操作
         */
        $scope.role = ['ordinary', 'company', 'system'];
        $scope.reqData = {"name": "", "password": "", "role": ""};
        $scope.errorMsg = {isHide: true, text: ''};       //处理前端验证信息和服务器的返回信息
        $scope.submit = function () {
            var reqData = $.param($scope.reqData);
            $http({
                method: 'POST',
                url: '/login/in',
                data: reqData,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>登录成功，即将跳转至首页</div>',
                        plain: true,
                        width: 300,
                        height: 185});
                    var host = $location.host();
                    window.location.href = 'http://' + host;
                } else {
                    $scope.errorMsg.text = res.data.msg;
                    $scope.errorMsg.isHide = false;
                }
            }, function () {
                ngDialog.open({
                    template: '<div>登录失败</div>',
                    plain: true
                });
            });
        };

        /**
         * 以下为注册操作
         */
        $scope.userMsg = {"name": "", "password": "", "phone": "", "email": ""};
        $scope.register = function () {
            var userMsg = $.param($scope.userMsg);
            $http({
                method: 'POST',
                url: '/register/add',
                data: userMsg,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data === 'true') {
                    var host = $location.host();
                    window.location.href = 'http://' + host + '/login';
                } else {
                    $scope.errorMsg.text = res.data;
                    $scope.errorMsg.isHide = false;
                }
            }, function () {
                alert('注册请求失败');
            });
        };
    });
})();