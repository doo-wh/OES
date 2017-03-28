<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Created by Donghuating.
 * Date: 2017/3/24
 * Time: 17:10
 */
class Nav extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
    }
    public function index(){
        $user = $this->session->userdata('user');
        $this->load->view('nav.phtml',array('user'=>$user));
    }
}