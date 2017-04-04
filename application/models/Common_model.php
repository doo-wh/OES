<?php
/**
 * Created by PhpStorm.
 * User: Donghuating
 * Date: 2017/3/17
 * Time: 16:17
 */
defined('BASEPATH') OR exit('No direct script access allowed');
class Common_model extends CI_Model
{
    /*插入数据*/
    public function insert($table, $data)
    {
        if (!empty($table) && !empty($data)) {
            $this->db->insert($table, $data);
            echo 'true';
        } else {
            echo '数据存储失败!';
        }
    }

    /*逻辑删除*/
    public function delete($table, $id)
    {
        if (!empty($table) && !empty($id)) {
            $this->db->update($table, array('deleted' => '1'), "id = $id");
        } else {
            echo '删除数据失败!';
        }
    }

    /*更新数据*/
    public function update($table, $data, $id)
    {
        if (!empty($table) && !empty($data)) {
            $this->db->update($table, $data, "id = $id");
        }
    }

    /*查询一条数据*/
    public function getOne($table, $id)
    {
        if (!empty($table) && !empty($id)) {
            $query = $this->db->get_where($table, array('id' => $id), 1);
            return $query->row_array();
        }
    }

    /*查询多条*/
    public function getMore($table, $id)
    {
        if (!empty($table) && !empty($id)) {
            $query = $this->db->get_where($table, array('recipient_id' => $id));
            return $query->result_array();
        }
    }
}