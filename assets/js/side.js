/**
 * Created by Donghuating on 2017-05-07 下午 1:22.
 */
'use strict';
(function () {
    oesModule.controller('send-controller', function ($scope, $http, ngDialog, $route) {
        $scope.sendMsg = {
            "express_code": "",
            "company": "",
            "recipient": "",
            "recipient_address": "",
            "recipient_phone": "",
            "sender": "",
            "sender_address": "",
            "sender_phone": ""
        };
        $scope.send = function () {
            $http({
                method: 'POST',
                url: '/send/send',
                data: $.param($scope.sendMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    return ngDialog.open({
                        template: '<div>信息提交成功</div>',
                        plain: true
                    });
                    $route.reload();
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>提交请求中断，无法提交</div>',
                    plain: true
                });
            });
        };
    });
    oesModule.controller('express-detail-controller', function ($scope, $http, $location, $routeParams, ngDialog) {
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
    oesModule.controller('company-controller', function ($scope, $http, ngDialog, $route) {

        //企业信息
        $scope.companyMsg = {"id": "", "name": "", "address": "", "telephone": "", "introduction": ""};

        $scope.submitCompany = function () {
            $http({
                method: 'POST',
                url: '/company/saveCompany',
                data: $.param($scope.companyMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>提交请求中断，无法提交</div>',
                    plain: true
                });
            });
        };

    });
    oesModule.controller('company-list-controller', function ($scope, $http, ngDialog, $route, companyList, listFactory) {
        //企业信息
        $scope.companyMsg = {"id": "", "name": "", "address": "", "telephone": "", "introduction": ""};
        $scope.companyList = companyList.list;

        $scope.deleteId = '';

        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(companyList.total / 8);

        $scope.submitCompany = function () {
            $http({
                method: 'POST',
                url: '/company/saveCompany',
                data: $.param($scope.companyMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>提交请求中断，无法提交</div>',
                    plain: true
                });
            });
        };

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList2('/company/getCompanyList', {keywords: $scope.keywords, page: currentPage});
            list.then(function (data) {
                $scope.companyList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.nextPage = function () {
            if (currentPage + 1 > $scope.totalPage || currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList2('/company/getCompanyList', {keywords: $scope.keywords, page: currentPage});
            list.then(function (data) {
                $scope.companyList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page) || $scope.page > $scope.totalPage) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList2('/company/getCompanyList', {keywords: $scope.keywords, page: currentPage});
            list.then(function (data) {
                $scope.companyList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.search = function () {
            var list = listFactory.getList2('/company/getCompanyList', {keywords: $scope.keywords, page: 1});
            list.then(function (data) {
                $scope.companyList = data.list;
                $scope.currentPage = 1;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        }

        $scope.update = function (index) {
            $scope.companyMsg.id = $scope.companyList[index].id;
            $scope.companyMsg.name = $scope.companyList[index].name;
            $scope.companyMsg.address = $scope.companyList[index].address;
            $scope.companyMsg.telephone = $scope.companyList[index].telephone;
        };

        $scope.submitCompany = function () {
            $http({
                method: 'POST',
                url: 'company/saveCompany',
                data: $.param($scope.companyMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                $('#edit_company').modal('hide');
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>修改成功</div>',
                        plain: true
                    });
                    return;
                }
                ngDialog.open({
                    template: '<div>修改失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>修改提交失败</div>',
                    plain: true
                });
            });
        };

        $scope.delete = function (index) {
            $('#confirm_modal').modal('show');
            $scope.deleteId = $scope.companyList[index].id;
        };

        $scope.confirmFn = function () {
            $('#confirm_modal').modal('hide');
            var data = {id: $scope.deleteId, power: 2};
            $http({
                method: 'POST',
                url: 'company/deleteCompany',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>删除请求中断</div>',
                    plain: true
                });
            });
        };

    });
    oesModule.controller('find-company-controller', function ($scope, $http, ngDialog) {
        $scope.companyMsg = '';
        $scope.showCompany = false;

        /**
         * 查询企业详情
         */
        $scope.findCompany = function () {
            $http({
                method: 'GET',
                url: '/company/getCompanyInfo',
                params: {name: $scope.companyName}
            }).then(function (res) {
                if (res.data.state) {
                    $scope.companyMsg = res.data.list;
                    if($scope.companyMsg == ''){
                        ngDialog.open({
                            template: '<div>未匹配到结果</div>',
                            plain: true
                        });
                        return;
                    }
                }
            }, function () {
                ngDialog.open({
                    template: '<div>查询请求失败</div>',
                    plain: true
                });
            });
        };

        $scope.showDetail = function (index) {
            $scope.detailMsg = $scope.companyMsg[index];
            $scope.showCompany = true;
        };

        $scope.closeArea = function () {
            $scope.companyMsg = '';
            $scope.showCompany = false;
        };
    });
    oesModule.controller('center-controller', function ($scope, $http, $location, $timeout, ngDialog) {
        $scope.user = {"id": "", "password": "", "email": "", "phone": "", "power": 1};
        $scope.userCompany = {"id": "", "password": "", "phone": "", "power": 2};
        $scope.userSystem = {"id": "", "password": "", "power": 3};
        $scope.errorMsg = {isHide: true, text: ''};       //存放前端验证信息和服务器的返回信息
        var host = $location.host();                      //获取当前host
        /**
         * 提交用户的个人信息
         */
        $scope.submitPersonal = function (power) {
            var reqData = '';
            if (power === 1) {
                reqData = $scope.user;
            }
            if (power === 2) {
                reqData = $scope.userCompany;
            }
            if (power === 3) {
                reqData = $scope.userSystem;
            }
            var checkResult = checkMsg(power);
            if (checkResult) {
                reqData = $.param(reqData);
                $http({
                    method: 'POST',
                    url: '/user/updateUser',
                    data: reqData,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then(function (res) {
                    if (res.data.state) {
                        ngDialog.open({
                            template: '<div>' + res.data.msg + ',即将跳转至首页' + '</div>',
                            plain: true
                        });
                        $timeout(function () {
                            window.location.href = 'http://' + host;
                        }, 1500);
                    } else {
                        $scope.errorMsg.text = res.data.msg;
                        $scope.errorMsg.isHide = false;
                    }
                }, function () {
                    ngDialog.open({
                        template: '<div>修改信息提交失败</div>',
                        plain: true
                    });
                });
            }
        };

        /**
         * 校验个人信息的格式
         * @returns {boolean}
         */
        function checkMsg(power) {
            var pwd = '';
            var phone = '';
            var email = '';
            var regPhone = /^1[3|4|5|7|8][0-9]{9}$/;
            var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
            var userPhone1 = regPhone.test($scope.user['phone']);
            var userEmail = regEmail.test($scope.user['email']);
            var userPhone2 = regPhone.test($scope.userCompany['phone']);
            switch (power) {
                case 1 :
                    pwd = $scope.user['password'];
                    if (!userPhone1 || !userEmail) {
                        $scope.errorMsg.text = '手机号或邮箱格式不正确';
                        return false;
                    }
                    break;
                case 2 :
                    pwd = $scope.userCompany['password'];
                    if (!userPhone2) {
                        $scope.errorMsg.text = '手机号格式不正确';
                        return false;
                    }
                    break;
                case 3 :
                    pwd = $scope.userSystem['password'];
                    break;
            }
            if (pwd.length > 0 && pwd.length < 6) {
                $scope.errorMsg.text = '修改后的密码长度不得少于6位';
                $scope.errorMsg.isHide = false;
                return false;
            }
            return true;
        }
    });
    oesModule.controller('msg-controller', function ($scope, $http, $route, $timeout, $location, ngDialog, messageList, listFactory) {
        messageList = angular.fromJson(messageList);
        $scope.messageList = messageList.list;
        //总页数
        $scope.totalPage = Math.ceil(messageList.total / 8);
        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        /**
         * 修改阅读状态
         * @param index
         */
        $scope.readMsg = function (index) {
            $scope.content = $scope.messageList[index].content;
            $scope.title = $scope.messageList[index].title;
            $scope.messageList[index].viewed = 1;
            $http({
                method: 'GET',
                url: '/message/updateMsg?t=' + new Date().getTime(),
                params: {id: $scope.messageList[index].id, viewed: 1}
            }).then(function (res) {
                if (res.data.state) {
                    return;
                }
            });
        };

        /**
         * 删除消息
         * @param index
         */
        $scope.deleteMsg = function (index) {
            $http({
                method: 'GET',
                url: '/message/deleteMsg',
                params: {id: $scope.messageList[index].id}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                }
            });
        };

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList1('/message/msgList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.messageList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.nextPage = function () {
            if (currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList1('/message/msgList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.messageList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page)) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList1('/message/msgList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.messageList = data.list;
                $scope.currentPage = currentPage;
            });
        };
    });
    oesModule.controller('record-controller', function ($scope, $http, $timeout, $route, ngDialog) {
        $scope.errorMsg = {isHide: true, text: ''};       //存放前端验证信息和服务器的返回信息
        $scope.record = {"express_code": "", "site": "", "remarks": ""};
        $scope.submitRecord = function () {
            var record = $.param($scope.record);
            $http({
                method: 'POST',
                url: '/status/updateStatus',
                data: record,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true,
                    });
                    $timeout(function () {
                        $route.reload();
                    }, 1500);
                } else {
                    $scope.errorMsg.text = res.data.msg;
                    $scope.errorMsg.isHide = false;
                }
            }, function () {
                ngDialog.open({
                    template: '<div>信息提交失败</div>',
                    plain: true
                });
            });
        };
    });
    oesModule.controller('personal-log-controller', function ($scope, expressList, listFactory, ngDialog) {
        //员工个人的所有物流
        $scope.expressList = expressList.list;
        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(expressList.total / 8);

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList1('/status/personalList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.expressList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.nextPage = function () {
            if (currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList1('/status/personalList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.expressList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page)) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList1('/status/personalList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.expressList = angular.fromJson(data).list;
                $scope.currentPage = currentPage;
            });
        };
    });
    oesModule.controller('company-log-controller', function ($scope, $location, expressList, listFactory, ngDialog) {
        // 企业所有物流
        $scope.expressList = expressList.list;

        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(expressList.total / 8);

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList1('/status/companyList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.expressList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.nextPage = function () {
            if (currentPage + 1 > $scope.totalPage || currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList1('/status/companyList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.expressList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page) || $scope.page > $scope.totalPage) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList1('/status/companyList?t=' + new Date().getTime(), currentPage);
            list.then(function (data) {
                $scope.expressList = data.list;
                $scope.currentPage = currentPage;
            });
        };

        $scope.viewDetail = function (index) {
            var code = $scope.expressList[index].expressCode;
            var host = $location.host();
            window.location.href = 'http://' + host + '#/express?code=' + code;
        };

    });
    oesModule.controller('add-c-user-controller', function ($scope, $http, $route, ngDialog) {
        $(":file").filestyle({buttonText: "选择文件", placeholder: "当前未选择任何文件", size: "sm"});
        $scope.roleMsg = ["普通员工", "企业管理员"];
        $scope.userMsg = {"id": "", "name": "", "password": "", "phone": "", "role": "", "company": ""};

        $scope.submitUser = function () {
            $http({
                method: 'POST',
                url: '/user/saveCompanyUser',
                data: $.param($scope.userMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>添加用户成功</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>添加用户失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>提交请求中断，无法提交</div>',
                    plain: true
                });
            });
        };

        /**
         * 批量上传
         */
        $scope.batchAdd = function () {
            var fd = new FormData();
            var file = document.querySelector('input[type=file]').files[0];
            fd.append('userFile', file);
            $http({
                method: 'POST',
                url: '/user/importUser',
                data: fd,
                headers: {'Content-type': undefined},
                transformRequest: angular.identity
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    })
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                })
            }, function () {
                ngDialog.open({
                    template: '<div>文件提交失败</div>',
                    plain: true
                })
            })
        };
    });
    oesModule.controller('list-c-user-controller', function ($scope, $http, $route, ngDialog, userList, listFactory) {
        $scope.userList = userList.list;
        $scope.sessionId = $('tbody').attr('data-sessionId');
        //搜索的关键字
        $scope.keywords = '';
        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(userList.total / 8);

        //修改的用户信息
        $scope.userMsg = {"id": "", "name": "", "phone": "", "role": ""};
        $scope.roleMsg = ["普通员工", "企业管理员"];

        $scope.deleteId = '';

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList2('/user/getUserList', {
                power: 2,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.nextPage = function () {
            if (currentPage + 1 > $scope.totalPage || currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList2('/user/getUserList', {
                power: 2,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page) || $scope.page > $scope.totalPage) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList2('/user/getUserList', {
                power: 2,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.search = function () {
            var list = listFactory.getList2('/user/getUserList', {power: 2, keywords: $scope.keywords, page: 1});
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = 1;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        }

        $scope.update = function (index) {
            $scope.userMsg.id = $scope.userList[index].id;
            $scope.userMsg.name = $scope.userList[index].name;
            $scope.userMsg.phone = $scope.userList[index].phone;
            $scope.userMsg.role = $scope.userList[index].role;
        };

        $scope.submitUser = function () {
            $http({
                method: 'POST',
                url: 'user/saveCompanyUser',
                data: $.param($scope.userMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                $('#edit_user').modal('hide');
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>修改用户成功</div>',
                        plain: true
                    });
                    return;
                }
                ngDialog.open({
                    template: '<div>修改用户失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>修改提交失败</div>',
                    plain: true
                });
            });
        };

        $scope.delete = function (index) {
            $('#confirm_modal').modal('show');
            $scope.deleteId = $scope.userList[index].id;
        };

        $scope.confirmFn = function () {
            $('#confirm_modal').modal('hide');
            var data = {id: $scope.deleteId, power: 2};
            $http({
                method: 'POST',
                url: 'user/deleteUser',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                $('#edit_user').modal('hide');
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>删除请求中断</div>',
                    plain: true
                });
            });
        };

    });
    oesModule.controller('list-o-user-controller', function ($scope, $http, $route, ngDialog, userList, listFactory) {
        $scope.userList = userList.list;
        //搜索的关键字
        $scope.keywords = '';
        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(userList.total / 8);

        //修改的用户信息
        $scope.userMsg = {"id": "", "name": "", "phone": "", "email": ""};

        $scope.deleteId = '';

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList2('/user/getUserList', {
                power: 1,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.nextPage = function () {
            if (currentPage + 1 > $scope.totalPage || currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList2('/user/getUserList', {
                power: 1,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page) || $scope.page > $scope.totalPage) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList2('/user/getUserList', {
                power: 1,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.search = function () {
            var list = listFactory.getList2('/user/getUserList', {power: 1, keywords: $scope.keywords, page: 1});
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = 1;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        }

        $scope.update = function (index) {
            $scope.userMsg.id = $scope.userList[index].id;
            $scope.userMsg.name = $scope.userList[index].name;
            $scope.userMsg.phone = $scope.userList[index].phone;
            $scope.userMsg.role = $scope.userList[index].role;
        };

        $scope.submitUser = function () {
            $http({
                method: 'POST',
                url: 'user/saveCompanyUser',
                data: $.param($scope.userMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                $('#edit_user').modal('hide');
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>修改用户成功</div>',
                        plain: true
                    });
                    return;
                }
                ngDialog.open({
                    template: '<div>修改用户失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>修改提交失败</div>',
                    plain: true
                });
            });
        };

        $scope.delete = function (index) {
            $('#confirm_modal').modal('show');
            $scope.deleteId = $scope.userList[index].id;
        };

        $scope.confirmFn = function () {
            $('#confirm_modal').modal('hide');
            var data = {id: $scope.deleteId, power: 1};
            $http({
                method: 'POST',
                url: 'user/deleteUser',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>删除请求中断</div>',
                    plain: true
                });
            });
        };
    });
    oesModule.controller('list-s-user-controller', function ($scope, $http, ngDialog, $route, userList, listFactory) {
        $scope.userList = userList.list;
        $scope.userMsg = {"id": "", "name": "", "password": "", "remarks": ""};
        $scope.sessionId = $('tbody').attr('data-sessionId');
        //搜索的关键字
        $scope.keywords = '';
        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(userList.total / 8);

        $scope.deleteId = '';

        $scope.submitUser = function () {
            $http({
                method: 'POST',
                url: '/user/saveSystemUser',
                data: $.param($scope.userMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>提交请求中断，无法提交</div>',
                    plain: true
                });
            });
        };

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList2('/user/getUserList', {
                power: 3,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.nextPage = function () {
            if (currentPage + 1 > $scope.totalPage || currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList2('/user/getUserList', {
                power: 3,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page) || $scope.page > $scope.totalPage) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList2('/user/getUserList', {
                power: 3,
                keywords: $scope.keywords,
                page: currentPage
            });
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.search = function () {
            var list = listFactory.getList2('/user/getUserList', {power: 3, keywords: $scope.keywords, page: 1});
            list.then(function (data) {
                $scope.userList = data.list;
                $scope.currentPage = 1;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        }

        $scope.delete = function (index) {
            $('#confirm_modal').modal('show');
            $scope.deleteId = $scope.userList[index].id;
        };

        $scope.confirmFn = function () {
            $('#confirm_modal').modal('hide');
            var data = {id: $scope.deleteId, power: 3};
            $http({
                method: 'POST',
                url: 'user/deleteUser',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>删除请求中断</div>',
                    plain: true
                });
            });
        };
    });
    oesModule.controller('add-notice-controller', function ($scope, $http, $route, ngDialog) {
        //公告信息
        $scope.noticeMsg = {"id": "", "title": "", "content": ""};

        $scope.addNotice = function () {
            $http({
                method: 'POST',
                url: 'notice/saveNotice',
                data: $.param($scope.noticeMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>添加公告成功</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>添加公告失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>提交请求失败</div>',
                    plain: true
                });
            });
        };

    });
    oesModule.controller('notice-controller', function ($scope, $http, $route, ngDialog, noticeList, listFactory) {
        $scope.noticeList = noticeList.list;
        //搜索的关键字
        $scope.keywords = '';
        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(noticeList.total / 8);

        //公告信息
        $scope.noticeMsg = {"id": "", "title": "", "content": "", "create_time": "", "creator": ""};

        $scope.deleteId = '';

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList2('/notice/getNoticeList', {keywords: $scope.keywords, page: currentPage});
            list.then(function (data) {
                $scope.noticeList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.nextPage = function () {
            if (currentPage + 1 > $scope.totalPage || currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList2('/notice/getNoticeList', {keywords: $scope.keywords, page: currentPage});
            list.then(function (data) {
                $scope.noticeList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page) || $scope.page > $scope.totalPage) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList2('/notice/getNoticeList', {keywords: $scope.keywords, page: currentPage});
            list.then(function (data) {
                $scope.noticeList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.search = function () {
            var list = listFactory.getList2('/notice/getNoticeList', {keywords: $scope.keywords, page: currentPage});
            list.then(function (data) {
                $scope.noticeList = data.list;
                $scope.currentPage = 1;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        }

        $scope.update = function (index) {
            $scope.noticeMsg.id = $scope.noticeList[index].id;
            $scope.noticeMsg.title = $scope.noticeList[index].title;
            $scope.noticeMsg.content = $scope.noticeList[index].content;
        };

        $scope.submitNotice = function () {
            var data = {
                "id": $scope.noticeMsg.id,
                "title": $scope.noticeMsg.title,
                "content": $scope.noticeMsg.content
            };
            $http({
                method: 'POST',
                url: 'notice/saveNotice',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                $('#edit_notice').modal('hide');
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>修改公告成功</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>修改公告失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>修改提交失败</div>',
                    plain: true
                });
            });
        };

        $scope.delete = function (index) {
            $('#confirm_modal').modal('show');
            $scope.deleteId = $scope.noticeList[index].id;
        };

        $scope.confirmFn = function () {
            $('#confirm_modal').modal('hide');
            var data = {id: $scope.deleteId};
            $http({
                method: 'POST',
                url: 'notice/deleteNotice',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>删除请求中断</div>',
                    plain: true
                });
            });
        };

        $scope.view = function (index) {
            $scope.viewId = index;
        };

    });
    oesModule.controller('add-slide-controller', function ($scope, $http, $route, ngDialog) {
        $(":file").filestyle({buttonText: "选择图片", placeholder: "当前未选择任何图片"});
        $scope.adMsg = {"content": "", "company": "", "image": "", "start_time": "", "stop_time": ""};
        $("#start_time,#stop_time").jeDate({
            isinitVal: true,
            ishmsVal: false,
            minDate: $.nowDate({DD: 0}),
            format: "YYYY-MM-DD hh:mm:ss",
            zIndex: 3000
        });
        $scope.submitAd = function () {
            uploadImage();
        };

        function uploadImage() {
            var fd = new FormData();
            var file = document.querySelector('input[type=file]').files[0];
            fd.append('userFile', file);
            $http({
                method: 'POST',
                url: '/slideshow/saveImg',
                data: fd,
                headers: {'Content-type': undefined},
                transformRequest: angular.identity
            }).then(function (res) {
                if (res.data.state) {
                    $scope.adMsg.image = res.data.msg;
                    submitAdMsg();
                } else {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                }
            }, function () {
                ngDialog.open({
                    template: '<div>图片请求提交失败</div>',
                    plain: true
                });
            })
        };

        function submitAdMsg() {
            $scope.adMsg.start_time = $('#start_time').val();
            $scope.adMsg.stop_time = $('#stop_time').val();
            $http({
                method: 'POST',
                url: '/slideshow/saveSlide',
                data: $.param($scope.adMsg),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>添加广告成功</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>添加广告失败</div>',
                    plain: true
                })
            }, function () {
                ngDialog.open({
                    template: '<div>信息提交失败</div>',
                    plain: true
                })
            });
        }
    });
    oesModule.controller('slide-controller', function ($scope, $http, $route, ngDialog, slideList, listFactory) {
        $("#start_time,#stop_time").jeDate({
            isinitVal: true,
            ishmsVal: false,
            minDate: $.nowDate({DD: 0}),
            format: "YYYY-MM-DD hh:mm:ss",
            zIndex: 3000
        });
        $scope.slideList = slideList.list;
        //记录要获取的页码
        $scope.page = '';
        //当前页数
        var currentPage = 1;
        $scope.currentPage = 1;
        //总页数
        $scope.totalPage = Math.ceil(slideList.total / 8);

        //广告信息
        $scope.adMsg = {"id" : "", "content": "", "company": "", "image": "", "start_time": "", "stop_time": ""};

        $scope.deleteId = '';

        $scope.previousPage = function () {
            if (currentPage <= 1) {
                return ngDialog.open({
                    template: '<div>当前已是第一页</div>',
                    plain: true
                });
            }
            currentPage--;
            var list = listFactory.getList2('/slideshow/getSlideList', {page: currentPage});
            list.then(function (data) {
                $scope.slideList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.nextPage = function () {
            if (currentPage + 1 > $scope.totalPage || currentPage == $scope.totalPage) {
                return ngDialog.open({
                    template: '<div>当前已是最后一页</div>',
                    plain: true
                });
            }
            currentPage++;
            var list = listFactory.getList2('/slideshow/getSlideList', {page: currentPage});
            list.then(function (data) {
                $scope.slideList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };

        $scope.goPageList = function () {
            var reg = /^[0-9]*$/;
            if ($scope.page == '' || !reg.test($scope.page) || $scope.page > $scope.totalPage) {
                return;
            }
            if (currentPage == $scope.page) {
                return ngDialog.open({
                    template: '<div>当前已是第' + $scope.page + '页</div>',
                    plain: true
                });
            }
            currentPage = $scope.page;
            var list = listFactory.getList2('/slideshow/getSlideList', {page: currentPage});
            list.then(function (data) {
                $scope.slideList = data.list;
                $scope.currentPage = currentPage;
                $scope.totalPage = Math.ceil(data.total / 8);
            });
        };


        $scope.update = function (index) {
            $scope.adMsg.id = $scope.slideList[index].id;
            $scope.adMsg.content = $scope.slideList[index].content;
            $scope.adMsg.company = $scope.slideList[index].company;
            $scope.adMsg.start_time = $scope.slideList[index].start_time;
            $scope.adMsg.stop_time = $scope.slideList[index].stop_time;
            $('#start_time').val($scope.slideList[index].start_time);
            $('#stop_time').val($scope.slideList[index].stop_time);
        };

        $scope.submitAd = function () {
            var data = {
                "id": $scope.adMsg.id,
                "content": $scope.adMsg.content,
                "company": $scope.adMsg.company,
                "start_time": $('#start_time').val(),
                "stop_time": $('#stop_time').val()
            };
            $http({
                method: 'POST',
                url: '/slideshow/saveSlide',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                $('#edit_ad').modal('hide');
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>修改广告成功</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>修改广告失败</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>修改提交失败</div>',
                    plain: true
                });
            });
        };

        $scope.delete = function (index) {
            $('#confirm_modal').modal('show');
            $scope.deleteId = $scope.slideList[index].id;
        };

        $scope.confirmFn = function () {
            $('#confirm_modal').modal('hide');
            var data = {id: $scope.deleteId};
            $http({
                method: 'POST',
                url: '/slideshow/deleteSlide',
                data: $.param(data),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function (res) {
                if (res.data.state) {
                    ngDialog.open({
                        template: '<div>' + res.data.msg + '</div>',
                        plain: true
                    });
                    $route.reload();
                    return;
                }
                ngDialog.open({
                    template: '<div>' + res.data.msg + '</div>',
                    plain: true
                });
            }, function () {
                ngDialog.open({
                    template: '<div>删除请求中断</div>',
                    plain: true
                });
            });
        };

        $scope.view = function (index) {
            $scope.viewId = index;
        };

    });
})();