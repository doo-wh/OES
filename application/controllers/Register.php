<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Created by Donghuating.
 * Date: 2017/3/27
 * Time: 9:52
 */
class Register extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
    }

    public function index()
    {
        $this->load->view('register.phtml');
    }

    public function add()
    {
        if (!empty($_REQUEST)) {
            $name = $_REQUEST['name'];
            $password = md5($_REQUEST['password']);
            $phone = $_REQUEST['phone'];
            $email = $_REQUEST['email'];
            $data = array('name' => $name, 'password' => $password, 'phone' => $phone, 'email' => $email);
            $result = $this->user_model->insert('users', $data);
            if ($result === 'true') {
                echo 'true';
            } else {
                echo $result;
            }
        }
    }
}