<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Created by Donghuating.
 * Date: 2017/3/20
 * Time: 16:13
 */
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
    public function in()
    {
        if (!empty($_REQUEST)) {
            $role = $_REQUEST['role'];
            switch ($role) {
                case 'ordinary':
                    $table = 'users';
                    break;
                case 'company':
                    $table = 'company_users';
                    break;
                case 'system':
                    $table = 'system_users';
                    break;
            }
            $name = $_REQUEST['name'];
            $password = md5($_REQUEST['password']);
            $code = $_SESSION['code'];
            if( $_REQUEST['code'] != $code){
                $arr = array('state' => false, 'msg' => '验证码不正确');
                echo json_encode($arr);
                exit();
            }
            $data = array('name' => $name, 'password' => $password);
            $result = $this->user_model->login($table, $data);
            if($table == 'users'){
                $message = $this->user_model->getMore($table,$result['id']);
                $num = count($message);
            }
            if (!empty($result) && !empty($message)) {
                $arr = array('user'=>$result,'num'=>$num);
                $this->session->set_userdata($arr);
                echo 'true';
            } else {
                $arr = array('state' => false, 'msg' => '用户名和密码不匹配');
                echo json_encode($arr);
            }
        }
    }

    /*退出登录*/
    public function out()
    {
        $this->session->sess_destroy();
        echo 'true';
    }
}