<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Created by Donghuating.
 * Date: 2017-05-09 下午 12:27
 */
class Message extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('message_model');
    }

    public function loadMsg()
    {
        $this->load->view('message.phtml');
    }

    public function msgList($page = 1)
    {
        $page = intval($_GET['page']);
        $limit = 8;
        $offset = ($page - 1)*8;
        $id = $this->session->userdata('user')['id'];
        $result = $this->message_model->findMessage($id, $offset, $limit);
        $arr = array('state' => true, 'list' => $result);
        $this->output->set_output(json_encode($arr));
    }

    public function updateMsg()
    {
        $id = intval($_GET['id']);
        $viewed = $_GET['viewed'];
        if (empty($viewed)) {
            return;
        }
        $data = array('viewed' => $viewed);
        $this->message_model->update('message', $data, $id);
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true);
            $this->output->set_output(json_encode($arr));
        }
    }

    public function deleteMsg()
    {
        $id = intval($_GET['id']);
        if (empty($id)) {
            return;
        }
        $this->message_model->delete('message', $id);
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true,'msg' => '您已成功删除一条消息');
            $this->output->set_output(json_encode($arr));
        }
    }
}