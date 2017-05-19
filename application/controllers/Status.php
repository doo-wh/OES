<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-09 下午 11:35
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Status extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('status_model');
    }

    public function loadStatus()
    {
        $this->load->view('record_logistics.phtml');
    }

    public function loadList()
    {
        $this->load->view('all_logistics.phtml');
    }

    public function loadPerLog()
    {
        $this->load->view('personal_logistics.phtml');
    }

    public function loadCompanyLog()
    {
        $this->load->view('all_logistics.phtml');
    }

    public function updateStatus()
    {
        if (!empty($_POST)) {
            $code = $_POST['express_code'];
            $site = $_POST['site'];
            $remarks = $_POST['remarks'];
            $userId = $this->session->userdata('user')['id'];
            $date = date('Y-m-d H:i:s');
            $data = array('express_code' => $code, 'site' => $site, 'time' => $date, 'company_user_id' => $userId, 'remarks' => $remarks);
            $this->status_model->insert('logistics_status', $data);

            $chk = $this->db->affected_rows();
            if ($chk > 0) {
                $arr = array('state' => true, 'msg' => '添加快递状态成功');
                $result = $this->status_model->getExpressInfo($code);
                $userName = $result['sender'];
                $user = $this->status_model->getExpressInfo($code);
                if(!empty($user)) {
                    $recipient_id = $user['id'];
                    $title = '系统通知';
                    $content = '您的快递[单号：'.$code.' ]于'.$date.'在'.$site.$remarks;
                    $data = array('recipient_id'=>$recipient_id, 'title'=>$title, 'content'=>$content, 'create_time'=>$date);
                    $this->status_model->insert('message',$data);
                }
            } else {
                $arr = array('state' => false, 'msg' => '添加快递状态失败');
            }
            echo json_encode($arr);
        }
    }

    public function getExpress()
    {
        $code = $_GET['code'];
        $status = $this->status_model->findExpressByUser($code);
        $arr = array('state' => true, 'list' => $status);
        $this->output->set_output(json_encode($arr));
    }

    public function getExpressInfo()
    {
        $code = $_GET['code'];
        $info = $this->status_model->getExpressInfo($code);
        $this->output->set_output(json_encode($info));
    }

    public function personalList($keywords = '', $page = 1)
    {
        $page = intval($_GET['page']);
        $limit = 8;
        $offset = ($page - 1) * 8;
        $userId = $this->session->userdata('user')['id'];
        $result = $this->status_model->findExpressByCompanyUser($userId, $keywords, $offset, $limit);
        $arr = array('state' => true, 'list' => $result);
        $this->output->set_output(json_encode($arr));
    }

    public function companyList($keywords = '', $page = 1)
    {
        $page = intval($_GET['page']);
        $limit = 8;
        $offset = ($page - 1) * 8;
        $companyId = $this->session->userdata('user')['company_id'];
        $result = $this->status_model->findExpressByCompanyId($companyId, $keywords, $offset, $limit);
        $arr = array('state' => true, 'list' => $result);
        $this->output->set_output(json_encode($arr));
    }
}