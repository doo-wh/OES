<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-09 下午 7:10
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Slideshow extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->library('PHPUpload.php');
        $this->load->model('slideshow_model');
    }

    public function loadSlide()
    {
        $this->load->view('edit_ad.phtml');
    }

    public function loadSlideList()
    {
        $this->load->view('ad_list.phtml');
    }

    public function getSlideList()
    {
        if (empty($_POST)) {
            return;
        }
        if (isset($_POST['limit'])) {
            $limit = intval($_POST['limit']);
            $offset = 0;
        }
        if (isset($_POST['page'])) {
            $page = intval($_POST['page']);
            $limit = 8;
            $offset = ($page - 1) * $limit;
            $result = $this->slideshow_model->getList($offset, $limit, 1);
        }else {
            $result = $this->slideshow_model->getList($offset, $limit, 0);
        }
        $arr = array('state' => true, 'list' => $result);
        $this->output->set_output(json_encode($arr));
    }

    public function saveImg()
    {
        $uploadFile = $this->phpupload->doUpload();
        if ($uploadFile == '') {
            $arr = array('state' => false, 'msg' => '图片上传失败');
        } else {
            $uploadFile = substr($uploadFile, 2);
            $arr = array('state' => true, 'msg' => $uploadFile);
        }
        $this->output->set_output(json_encode($arr));
    }

    public function saveSlide()
    {
        if (empty($_POST)) {
            return;
        }
        $content = $_POST['content'];
        $company = $_POST['company'];
        $startTime = $_POST['start_time'];
        $stopTime = $_POST['stop_time'];
        $companyId = $this->slideshow_model->findCompanyByName($company);
        if (!$companyId) {
            $arr = array('state' => false, 'msg' => '公司名称错误');
            echo json_encode($arr);
            return;
        }
        if (isset($_POST['id'])) {
            $id = $_POST['id'];
            $data = array('content' => $content, 'company_id' => $companyId, 'start_time' => $startTime, 'stop_time' => $stopTime);
            $this->slideshow_model->update('advertisement', $data, $id);
        } else {
            $image = $_POST['image'];
            $data = array('content' => $content, 'image' => $image, 'company_id' => $companyId, 'start_time' => $startTime, 'stop_time' => $stopTime);
            $this->slideshow_model->insert('advertisement', $data);
        }
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '成功');
        } else {
            $arr = array('state' => false, 'msg' => '失败');
        }
        $this->output->set_output(json_encode($arr));
    }

    public function deleteSlide()
    {
        if (empty($_POST['id'])) {
            return;
        }
        $id = intval($_POST['id']);
        $this->slideshow_model->delete('advertisement', $id);
        $chk = $this->db->affected_rows();

        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '删除广告成功');
        } else {
            $arr = array('state' => false, 'msg' => '删除广告失败');
        }
        $this->output->set_output(json_encode($arr));
    }
}