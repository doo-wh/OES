<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-11 上午 10:51
 */
defined('BASEPATH') OR exit('No direct script access allowed');
include(dirname(__FILE__) . '\Common_model.php');

class Company_model extends Common_model
{
    public function getList($keywords, $offset, $limit)
    {
        if (empty($limit)) {
            return;
        }
        $this->db->where('deleted', 0);
        $this->db->like('name', $keywords,'both');
        $total = $this->db->count_all_results('company');
        $this->db->where('deleted', 0);
        $this->db->like('name', $keywords,'both');
        $this->db->order_by('id', 'desc');
        $this->db->limit($limit, $offset);
        $query = $this->db->get('company');
        $list = $query->result_array();
        return array('total' => $total, 'list' => $list);
    }

    public function findCompanyByName($name)
    {
        $this->db->where('deleted', 0);
        $this->db->like('name', $name);
        $query = $this->db->get('company');
        return $query->result_array();
    }

}