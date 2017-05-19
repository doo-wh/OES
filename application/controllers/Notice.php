<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-09 下午 7:09
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Notice extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('notice_model');
    }

    public function loadNotice()
    {
        $this->load->view('edit_notice.phtml');
    }

    public function loadNoticeList()
    {
        $this->load->view('notice_list.phtml');
    }

    public function getNoticeList()
    {
        $page = intval($_POST['page']);
        $limit = 8;
        $offset = ($page - 1) * 8;
        $current = '';
        if(isset($_POST['current'])){
            $current = $_POST['current'];
        }
        if($current == 'index'){
            $limit = 3;
            $offset = 0;
        }
        $keywords = $_POST['keywords'];
        $result = $this->notice_model->getList($keywords, $offset, $limit);
        $arr = array('state' => true, 'list' => $result);
        $this->output->set_output(json_encode($arr));
    }

    public function loadNoticeDetail()
    {
        $id = intval($_GET['id']);
        $notice = $this->notice_model->getOne('notice', $id);
        $this->output->set_output(json_encode($notice));
    }

    public function saveNotice()
    {
        if (empty($_POST)) {
            return;
        }
        $id = intval($_POST['id']);
        $title = $_POST['title'];
        $content = $_POST['content'];
        if ($id == 0) {
            $creator = $this->session->userdata('user')['id'];
            $data = array('title' => $title, 'content' => $content, 'create_time' => date('Y-m-d H:i:s'), 'creator' => $creator);
            $this->notice_model->insert('notice', $data);
        } else {
            $data = array('title' => $title, 'content' => $content);
            $this->notice_model->update('notice', $data, $id);
        }
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '成功');
        } else {
            $arr = array('state' => false, 'msg' => '失败');
        }
        echo json_encode($arr);
    }

    public function deleteNotice()
    {
        $id = intval($_POST['id']);
        $this->notice_model->delete('notice', $id);
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '公告删除成功');
        } else {
            $arr = array('state' => false, 'msg' => '公告删除失败');
        }
        echo json_encode($arr);
    }
}