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
        $scope.reqData = {"name": "", "password": "", "role": "", "code": ""};
        $scope.errorMsg = {isHide: true, text: ''};       //存放前端验证信息和服务器的返回信息
        var host = $location.host();                      //获取当前host
        var address = 'http://' + host + '/code?t=';      //验证码地址

        //更新验证码
        $scope.updateCode = function (event) {
            event.target.src = address + new Date().getTime();
        };

        //登录提交
        $scope.submit = function () {
            var checkResult = checkLoginMsg();
            if (checkResult) {
                var reqData = $.param($scope.reqData);
                $http({
                    method: 'POST',
                    url: '/login/in',
                    data: reqData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (res) {
                    if (res.data === 'true') {
                        ngDialog.open({
                            template: '<div>登录成功，即将跳转至首页</div>',
                            plain: true,
                            width: 300,
                            height: 100
                        });
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
            }
        };

        /**
         * 以下为注册操作
         */
        $scope.userMsg = {"name": "", "password": "", "phone": "", "email": ""};

        //注册提交
        $scope.register = function () {
            var checkResult = checkRegisterMsg();
            if(checkResult){
                var userMsg = $.param($scope.userMsg);
                $http({
                    method: 'POST',
                    url: '/register/add',
                    data: userMsg,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (res) {
                    if (res.data === 'true') {
                        ngDialog.open({
                            template: '<div>注册成功，即将跳转至登录页面</div>',
                            plain: true,
                            width: 300,
                            height: 100
                        });
                        window.location.href = 'http://' + host + '/login';
                    } else {
                        $scope.errorMsg.text = res.data;
                        $scope.errorMsg.isHide = false;
                    }
                }, function () {
                    alert('注册请求失败');
                });
            }
        };

        //校验登录信息
        function checkLoginMsg() {
            for (var key in  $scope.reqData) {
                if ($scope.reqData[key] == '') {
                    $scope.errorMsg.text = '请填写所有信息，并选择登录身份';
                    $scope.errorMsg.isHide = false;
                    return false;
                }
            }
            return true;
        }

        //校验注册信息
        function checkRegisterMsg() {
            for (var key in $scope.userMsg) {
                if ($scope.userMsg[key] == '') {
                    $scope.errorMsg.text = '请将所有信息填写完整';
                    $scope.errorMsg.isHide = false;
                    return false;
                }
            }
            var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
            var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
            var flagPhone = regPhone.test($scope.userMsg['phone']);
            var flagEmail = regEmail.test($scope.userMsg['email']);
            if(!flagPhone && !flagEmail){
                $scope.errorMsg.text = '手机号和邮箱格式不正确';
                $scope.errorMsg.isHide = false;
                return false;
            }
            if(!flagPhone || !flagEmail){
                $scope.errorMsg.text = '手机号或邮箱格式不正确';
                $scope.errorMsg.isHide = false;
                return false;
            }
            return true;
        }
    });
})();