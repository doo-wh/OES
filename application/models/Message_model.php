<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-09 下午 12:29
 */
defined('BASEPATH') OR exit('No direct script access allowed');
include(dirname(__FILE__) . '\Common_model.php');

class Message_model extends Common_model
{
    /**
     * 查询用户的系统信息
     * @param $recipient_id
     * @param $role
     * @return int
     */
    public function findMessage($recipient_id, $offset, $limit)
    {
        if (empty($recipient_id)) {
            return 0;
        }
        $sql = 'SELECT COUNT(*) AS total FROM message WHERE recipient_id = ? AND deleted= 0';
        $query = $this->db->query($sql, array($recipient_id));
        $total = $query->row()->total;
        $sql = 'select id,title,content,create_time,viewed from message where recipient_id = ? and deleted = 0 order by create_time desc limit ?,?';
        $query = $this->db->query($sql, array($recipient_id, $offset, $limit));
        $list = $query->result_array();
        return array('total' => $total, 'list' => $list);

    }
}