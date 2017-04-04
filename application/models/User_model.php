<?php
/**
 * Created by Donghuating.
 * Date: 2017-03-22
 * Time: 下午 9:03
 */
defined('BASEPATH') OR exit('No direct script access allowed');
include(dirname(__FILE__).'\Common_model.php');
class User_model extends Common_model
{
    public function login($table,$data)
    {
        $query = $this->db->get_where($table,array('name'=>$data['name'],'password'=>$data['password']),1);
        return $query->row_array();
    }


}