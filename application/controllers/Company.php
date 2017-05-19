<?php
/**
 * Created by Donghuating.
 * Date: 2017-03-26
 * Time: 下午 1:46
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class Company extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('company_model');
    }

    public function index()
    {
        $this->load->view('company_d.phtml');
    }

    public function loadList()
    {
        $this->load->view('company_list.phtml');
    }

    public function loadCompany()
    {
        $this->load->view('edit_company.phtml');
    }

    public function getCompanyList($keywords = '', $page = 1)
    {
        $page = intval($_POST['page']);
        $limit = 8;
        $offset = ($page - 1) * 8;
        $keywords = $_POST['keywords'];
        $companyList = $this->company_model->getList($keywords, $offset, $limit);
        $arr = array('state' => true, 'list' => $companyList);
        $this->output->set_output(json_encode($arr));
    }

    public function getCompanyInfo()
    {
        $name = $_GET['name'];
        $result = $this->company_model->findCompanyByName($name);
        $arr = array('state' => true, 'list' => $result);
        $this->output->set_output(json_encode($arr));
    }

    public function loadCompanyDetail()
    {
        $id = intval($_GET['id']);
        $company = $this->company_model->getOne('company', $id);
        $this->output->set_output(json_encode($company));
    }

    public function saveCompany()
    {
        if (empty($_POST)) {
            return;
        }
        $id = intval($_POST['id']);
        $name = $_POST['name'];
        $address = $_POST['address'];
        $telephone = $_POST['telephone'];
        $introduction = $_POST['introduction'];
        $data = array('name' => $name, 'address' => $address, 'telephone' => $telephone, 'introduction' => $introduction);
        if ($id == 0) {
            $this->company_model->insert('company', $data);
        } else {
            $this->company_model->update('company', $data, $id);
        }
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '成功');
        } else {
            $arr = array('state' => false, 'msg' => '失败');
        }
        echo json_encode($arr);
    }

    public function deleteCompany()
    {
        $id = intval($_POST['id']);
        $this->company_model->delete('company', $id);
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '删除成功');
        } else {
            $arr = array('state' => false, 'msg' => '删除失败');
        }
        echo json_encode($arr);
    }
}