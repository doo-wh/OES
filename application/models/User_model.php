<?php
/**
 * Created by Donghuating.
 * Date: 2017-03-22
 * Time: 下午 9:03
 */
defined('BASEPATH') OR exit('No direct script access allowed');
include(dirname(__FILE__) . '\Common_model.php');

class User_model extends Common_model
{
    public function login($table, $data)
    {
        if ($table == 'company_users') {
            $sql = 'select cu.id as id, cu.name as name, cu.phone as phone, cu.company_id as company_id, c.name as company, cu.role as role from company_users cu,company c where cu.deleted = 0 and (cu.name = ? or cu.phone = ?)and cu.password = ?';
            $query = $this->db->query($sql, array($data['name'], $data['name'], $data['password']));
            return $query->row_array();
        }
        if ($table == 'users') {
            $sql = 'select * from users where deleted = 0 and (name = ? or phone = ?) and password = ?';
            $query = $this->db->query($sql, array($data['name'], $data['name'], $data['password']));
            return $query->row_array();
        }
        if ($table == 'system_users') {
            $query = $this->db->get_where($table, array('name' => $data['name'], 'password' => $data['password'], 'deleted' => 0), 1);
            return $query->row_array();
        }
    }

    public function getUnreadMsgCount($recipient_id)
    {
        $sql = 'SELECT COUNT(*) AS total FROM message WHERE recipient_id = ? AND viewed = 0 AND deleted= 0';
        $query = $this->db->query($sql, array($recipient_id));
        $total = $query->row()->total;
        return $total;
    }

    public function isExistUsername($table, $name)
    {
        $query = $this->db->get_where($table, array('name' => $name));
        return $query->row_array() > 0 ? true : false;
    }

    public function findCompanyIdByName($company)
    {
        $sql = 'SELECT id FROM company WHERE name = ? AND deleted= 0';
        $query = $this->db->query($sql, array($company));
        $result = $query->row_array();
        return empty($result) ? 0 : $result['id'];
    }

    public function getList($table, $keywords, $offset, $limit)
    {
        if (empty($table)) {
            return 0;
        }
        if ($table == 'company_users') {
            $sql = 'SELECT COUNT(DISTINCT cu.id) AS total FROM company_users cu, company c WHERE cu.company_id = c.id AND cu.deleted= 0 AND (cu.name LIKE CONCAT(CONCAT("%", ?), "%") OR cu.role LIKE CONCAT(CONCAT("%", ?), "%") OR c.name LIKE CONCAT(CONCAT("%", ?), "%"))';
            $query = $this->db->query($sql, array($keywords, $keywords, $keywords));
            $total = $query->row()->total;
            $sql = 'SELECT cu.id AS id, cu.name AS name, cu.phone AS phone, c.name AS company, cu.role AS role FROM company_users cu, company c WHERE cu.company_id = c.id AND cu.deleted= 0 AND (cu.name LIKE CONCAT(CONCAT("%", ?), "%") OR cu.role LIKE CONCAT(CONCAT("%", ?), "%") OR c.name LIKE CONCAT(CONCAT("%", ?), "%")) order by cu.id desc limit ?,?';
            $query = $this->db->query($sql, array($keywords, $keywords, $keywords, $offset, $limit));
            $list = $query->result_array();
        } else {
            $this->db->where('deleted', 0);
            $this->db->like('name', $keywords, 'both');
            $total = $this->db->count_all_results($table);
            $this->db->where('deleted', 0);
            $this->db->like('name', $keywords, 'both');
            $this->db->order_by('id', 'desc');
            $this->db->limit($limit, $offset);
            $query = $this->db->get($table);
            $list = $query->result_array();
        }
        return array('total' => $total, 'list' => $list);
    }
}