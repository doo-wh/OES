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
            $data = array('name' => $name, 'password' => $password);
            $result = $this->user_model->login($table, $data);
            if (!empty($result)) {
                $this->session->set_userdata('user', $result);
                $arr = array('state' => true);
                echo json_encode($arr);
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
        $arr = array('state' => true);
        echo json_encode($arr);
    }
}