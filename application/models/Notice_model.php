<?php

/**
 * Created by Donghuating.
 * Date: 2017-05-13 下午 6:45
 */
defined('BASEPATH') OR exit('No direct script access allowed');
include(dirname(__FILE__) . '\Common_model.php');

class Notice_model extends Common_model
{
    public function getList($keywords, $offset, $limit)
    {
        if(!empty($limit)){
            $sql = 'SELECT COUNT(*) AS total FROM notice WHERE title LIKE CONCAT(CONCAT("%", ?), "%") AND deleted = 0';
            $query = $this->db->query($sql, array($keywords));
            $total = $query->row()->total;
            $sql = 'SELECT n.id as id, n.title as title, n.content as content, n.create_time as create_time, su.name as creator FROM notice n, system_users su WHERE n.title LIKE CONCAT(CONCAT("%", ?), "%") AND n.creator = su.id AND n.deleted = 0 order by n.create_time desc limit ?,?';
            $query = $this->db->query($sql, array($keywords, $offset, $limit));
            $list = $query->result_array();
            return array('total' => $total, 'list' => $list);
        }
    }
}