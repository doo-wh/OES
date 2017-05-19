<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-15 上午 11:51
 */
defined('BASEPATH') OR exit('No direct script access allowed');
include(dirname(__FILE__) . '\Common_model.php');

clASs Slideshow_model extends Common_model
{
    public function getList($offset, $limit, $isList)
    {
        $sql = 'SELECT COUNT(*) AS total FROM advertisement WHERE deleted = 0';
        $query = $this->db->query($sql);
        $total = $query->row()->total;
        if($isList){
            $sql = 'SELECT a.id AS id, a.content AS content, a.image AS image, c.name AS company, a.start_time AS start_time, a.stop_time AS stop_time  FROM advertisement a, company c WHERE a.company_id = c.id AND a.deleted = 0 ORDER BY a.start_time LIMIT ?,?;';
        }else {
            $sql = 'SELECT * FROM advertisement WHERE deleted = 0 AND NOW() BETWEEN start_time AND stop_time ORDER BY start_time LIMIT ?,?;';
        }
        $query = $this->db->query($sql, array($offset, $limit));
        $list = $query->result_array();
        return array('total' => $total, 'list' => $list);
    }

    public function findCompanyByName($name)
    {
        $this->db->where('deleted', 0);
        $this->db->where('name', $name);
        $query = $this->db->get('company');
        $result = $query->row_array();
        if ($result) {
            return $result['id'];
        } else {
            return 0;
        }
    }
}