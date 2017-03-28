<?php

/**
 * Created by Donghuating.
 * Date: 2017-03-26
 * Time: 下午 2:01
 */
class Home extends CI_Controller
{
    public function index(){
        $this->load->view('home.phtml');
    }
}