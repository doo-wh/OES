<?php
/**
 * Created by Donghuating.
 * Date: 2017-03-26
 * Time: 下午 1:46
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Send extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('user_model');
    }

    public function index()
    {
        $this->load->view('send.phtml');
    }

    public function send()
    {
        if (empty($_POST)) {
            return;
        }
        $code = $_POST['express_code'];
        $company = $_POST['company'];
        $recipient = $_POST['recipient'];
        $rAddress = $_POST['recipient_address'];
        $rPhone = $_POST['recipient_phone'];
        $sender = $_POST['sender'];
        $sAddress = $_POST['sender_address'];
        $sPhone = $_POST['sender_phone'];
        $companyId = $this->user_model->findCompanyIdByName($company);
        if ($companyId == 0) {
            $arr = array('state' => false, 'msg' => '该快递公司不存在');
            echo json_encode($arr);
            return;
        }
        $data = array(
            'express_code' => $code,
            'company_id' => $companyId,
            'recipient' => $recipient,
            'recipient_address' => $rAddress,
            'recipient_phone' => $rPhone,
            'sender' => $sender,
            'sender_address' => $sAddress,
            'sender_phone' => $sPhone,

        );
        $this->user_model->insert('logistics_info', $data);
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '信息提交成功');
        } else {
            $arr = array('state' => false, 'msg' => '信息提交失败');
        }
        echo json_encode($arr);
    }
}