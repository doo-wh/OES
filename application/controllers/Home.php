<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Created by Donghuating.
 * Date: 2017-03-26
 * Time: 下午 2:01
 */
class Home extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
    }

    public function index()
    {
        $this->load->view('home.phtml');
    }

    public function loadExpress()
    {
        $this->load->view('logistics.phtml');
    }
}