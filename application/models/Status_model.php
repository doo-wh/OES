<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-09 下午 11:37
 */
defined('BASEPATH') OR exit('No direct script access allowed');

include(dirname(__FILE__) . '\Common_model.php');

class Status_model extends Common_model
{
    public function findExpressByUser($code)
    {
        if (!empty($code)) {
            $sql = 'SELECT ls.express_code AS expressCode, c.name AS company, ls.time AS time, ls.site AS site, cu.name AS username, cu.phone AS phone, ls.remarks AS remarks FROM logistics_status ls INNER JOIN company_users cu ON ls.company_user_id = cu.id inner join company c on c.id = cu.company_id WHERE ls.express_code = ?  ORDER BY ls.time DESC;';
            $query = $this->db->query($sql, array($code));
            return $query->result_array();
        }
    }

    public function getExpressInfo($code)
    {
        if (!empty($code)) {
            $query = $this->db->get_where('logistics_info', array('express_code' => $code), 1);
            return $query->row_array();
        }
    }

    public function findExpressByCompanyUser($userId, $keywords, $offset, $limit)
    {
        if(empty($userId)) {
            return json_encode(array('total' => 0, 'list' => ''));
        }
        $sql = 'select COUNT(distinct ls.express_code) as total from logistics_status ls inner join(select express_code , max(time) as maxTime from logistics_status where company_user_id = ? group by express_code)maxExpress on maxExpress.express_code = ls.express_code and maxExpress.maxTime = ls.time WHERE ls.express_code LIKE CONCAT(CONCAT("%", ?), "%")';
        $query = $this->db->query($sql, array($userId, $keywords));
        $total = $query->row()->total;
        $sql = 'select distinct ls.express_code as expressCode, ls.time as time, ls.site as site, ls.remarks as remarks from logistics_status ls inner join(select express_code , max(time) as maxTime from logistics_status where company_user_id = ? group by express_code)maxExpress on maxExpress.express_code = ls.express_code and maxExpress.maxTime = ls.time WHERE ls.express_code LIKE CONCAT(CONCAT("%", ?), "%") ORDER BY ls.time DESC LIMIT ?, ?';
        $query = $this->db->query($sql, array($userId, $keywords, $offset, $limit));
        $list = $query->result_array();
        return array('total' => $total, 'list' => $list);
    }

    public function findExpressByCompanyId($companyId, $keywords, $offset, $limit)
    {
        if (empty($companyId)) {
            return json_encode(array('total' => 0, 'list' => ''));
        }
        $sql = 'select COUNT(distinct ls.express_code) as total  from logistics_status ls inner join company_users cu on ls.company_user_id = cu.id inner join(select status.express_code as express_code, max(status.time) as maxTime from logistics_status as status, company_users as users where status.company_user_id = users.id and company_id = ? group by express_code)maxExpress on maxExpress.express_code = ls.express_code and maxExpress.maxTime = ls.time WHERE ls.express_code LIKE CONCAT(CONCAT("%", ?), "%") OR cu.name LIKE CONCAT(CONCAT("%", ?), "%")';
        $query = $this->db->query($sql, array($companyId, $keywords, $keywords));
        $total = $query->row()->total;
        $sql = 'select distinct ls.express_code as expressCode, cu.name as username, ls.time as time, ls.site as site, ls.remarks as remarks from logistics_status ls inner join company_users cu on ls.company_user_id = cu.id inner join(select status.express_code as express_code, max(status.time) as maxTime from logistics_status as status, company_users as users where status.company_user_id = users.id and company_id = ? group by express_code)maxExpress on maxExpress.express_code = ls.express_code and maxExpress.maxTime = ls.time WHERE ls.express_code LIKE CONCAT(CONCAT("%", ?), "%") OR cu.name LIKE CONCAT(CONCAT("%", ?), "%") ORDER BY ls.time DESC LIMIT ?, ?';
        $query = $this->db->query($sql, array($companyId, $keywords, $keywords, $offset, $limit));
        $list = $query->result_array();
        return array('total' => $total, 'list' => $list);
    }

    public function getUserInfo($username) {
        if (!empty($code)) {
            $query = $this->db->get_where('usres', array('name' => $username), 1);
            return $query->row_array();
        }
    }
}