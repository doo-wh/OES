<?php
/**
 * Created by Donghuating.
 * Date: 2017/3/20
 * Time: 16:13
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Login extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
    }

    /*载入登录页面*/
    public function index()
    {
        $this->load->view('login.phtml');
    }

    /*登录*/
    public function in(){
        if(empty($_POST)) {
            return;
        }
        $role = $_POST['role'];
        switch ($role) {
            case 'ordinary':
                $table = 'users';
                $power = 1;
                break;
            case 'company':
                $table = 'company_users';
                $power = 2;
                break;
            case 'system':
                $table = 'system_users';
                $power = 3;
                break;
        }
        $name = $_POST['name'];
        $password = md5($_POST['password']);
        $code = $_SESSION['code'];
        if ($_POST['code'] != $code) {
            $arr = array('state' => false, 'msg' => '验证码不正确');
            echo json_encode($arr);
            return;
        }
        $data = array('name' => $name, 'password' => $password);
        $result = $this->user_model->login($table, $data);

        $messageNum = '';
        if ($role == 'ordinary') {
            $messageNum = $this->user_model->getUnreadMsgCount($result['id']);
        }

        if (is_null($result)) {
            $arr = array('state' => false, 'msg' => '用户名和密码不匹配');
            echo json_encode($arr);
            return;
        }

        $data = array('user' => $result, 'num' => $messageNum, 'power' => $power);
        if ($power != 1) {
            unset($data['num']);
        }
        $this->session->set_userdata($data);
        $arr = array('state' => true);
        $this->output->set_output(json_encode($arr));
    }

    /*退出登录*/
    public function out()
    {
        $this->session->sess_destroy();
        echo json_encode(array('state' => true));
    }
}