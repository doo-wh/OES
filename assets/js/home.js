/**
 * Created by Donghuating on 2017-03-26 下午 3:26.
 */
(function () {
    /**
     * 退出登录
     */
    oesModule.controller('home-controller', function ($scope, $http, $location) {
        $scope.logOut = function () {
            $http({
                method: 'GET',
                url: '/login/out'
            }).then(function (res) {
                if (res.data === 'true') {
                    var host = $location.host();
                    window.location.href = 'http://' + host;
                } else {
                    alert('退出失败');
                }
            }, function () {
                alert('请求中断');
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
    });
})();