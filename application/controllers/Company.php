<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/**
 * Created by Donghuating.
 * Date: 2017-03-26
 * Time: 下午 1:46
 */
class Company extends CI_Controller
{
    public function index()
    {
        $this->load->view('company_d.phtml');
    }
}