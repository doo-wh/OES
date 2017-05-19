<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-07 上午 5:41
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->library('PHPExcel.php');
        $this->load->library('PHPExcel/IOFactory.php');
        $this->load->library('PHPUpload.php');
        $this->load->model('user_model');
    }

    public function loadCenter()
    {
        $user = $this->session->userdata('user');
        $power = $this->session->userdata('power');
        $this->load->view('personal_center.phtml', array('user' => $user, 'power' => $power));
    }

    public function updateUser()
    {
        if (empty($_POST)) {
            return;
        }

        $id = $_POST['id'];
        $pwd = $_POST['password'];

        if ($_POST['power'] == 1) {
            $email = $_POST['email'];
            $phone = $_POST['phone'];
            $table = 'users';
            $data = array('phone' => $phone, 'email' => $email);
            if ($pwd != '') {
                $data['password'] = md5($pwd);
            }
        }
        if ($_POST['power'] == 2) {
            $phone = $_POST['phone'];
            $table = 'company_users';
            $data = array('phone' => $phone);
            if ($pwd != '') {
                $data['password'] = md5($pwd);
            }
        }
        if ($_POST['power'] == 3) {
            $table = 'system_users';
            $data = array('password' => md5($pwd));
        }
        $this->user_model->update($table, $data, $id);
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $result = $this->user_model->getOne($table, $id);
            $this->session->set_userdata('user', $result);
            $arr = array('state' => true, 'msg' => '信息修改成功');
            echo json_encode($arr);
        } else {
            $arr = array('state' => false, 'msg' => '信息修改失败');
            echo json_encode($arr);
        }
    }

    public function loadUserList()
    {
        $this->load->view('user_list_o.phtml');
    }

    public function loadCompanyUser()
    {
        $this->load->view('edit_user_c.phtml');
    }

    public function loadCompanyUserList()
    {
        $this->load->view('user_list_c.phtml');
    }

    public function loadSystemUser()
    {
        $this->load->view('edit_user_s.phtml');
    }

    public function loadSystemUserList()
    {
        $this->load->view('user_list_s.phtml');
    }

    public function getUserDetail()
    {
        $id = intval($_GET['id']);
        $table = $_GET['role'];
        $user = $this->user_model->getOne($table, $id);
        $this->output->set_output(json_encode($user));
    }

    public function getUserList()
    {
        switch ($_POST['power']) {
            case '1':
                $table = 'users';
                break;
            case '2':
                $table = 'company_users';
                break;
            case '3':
                $table = 'system_users';
        }
        $page = intval($_POST['page']);
        $limit = 8;
        $offset = ($page - 1) * 8;
        $keywords = $_POST['keywords'];
        $result = $this->user_model->getList($table, $keywords, $offset, $limit);
        $arr = array('state' => true, 'list' => $result);
        $this->output->set_output(json_encode($arr));
    }

    public function saveCompanyUser()
    {
        if (empty($_POST)) {
            return;
        }
        $id = $_POST['id'];
        $name = $_POST['name'];
        $phone = $_POST['phone'];
        $power = $this->session->userdata('power');
        if ($power == 2) {
            $companyId = $this->session->userdata('user')['company_id'];
        } else {
            $company = $_POST['company'];
            $companyId = $this->user_model->findCompanyIdByName($company);
        }
        $role = $_POST['role'];
        if ($companyId == 0) {
            $arr = array('state' => false, 'msg' => '公司名错误');
            echo json_encode($arr);
            return;
        }
        if ($id == 0) {
            $isExist = $this->user_model->isExistUsername('company_users', $name);
            if ($isExist) {
                $arr = array('state' => false, 'msg' => '用户名已经存在');
                echo json_encode($arr);
                return;
            }
            $pwd = md5($_POST['password']);
            $data = array('name' => $name, 'password' => $pwd, 'phone' => $phone, 'company_id' => $companyId, 'role' => $role);
            $this->user_model->insert('company_users', $data);
        } else {
            $data = array('name' => $name, 'phone' => $phone, 'company_id' => $companyId, 'role' => $role);
            $this->user_model->update('company_users', $data, $id);
        }
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '成功');
        } else {
            $arr = array('state' => false, 'msg' => '失败');
        }
        echo json_encode($arr);
    }

    public function importUser()
    {
        $uploadFile = $this->phpupload->doUpload();
        if ($uploadFile == '') {
            $arr = array('state' => false, 'msg' => '文件上传失败');
            return json_encode($arr);
        }
        $inputFileType = IOFactory::identify($uploadFile);//确定输入文件的格式
        $objReader = IOFactory::createReader($inputFileType);//穿件相对应的阅读器
        $objPHPExcel = $objReader->load($uploadFile);          //加载要读取的文件

        $objWorksheet = $objPHPExcel->getActiveSheet();
        $highestRow = $objWorksheet->getHighestRow();

        $highestColumn = $objWorksheet->getHighestColumn();
        $highestColumnIndex = PHPExcel_Cell::columnIndexFromString($highestColumn);//总列数

        $total = 0;
        $power = $this->session->userdata('power');


        for ($row = 2; $row <= $highestRow; $row++) {
            $arr = array();
            //highestColumnIndex的列数索引从0开始
            for ($col = 0; $col < $highestColumnIndex; $col++) {
                $arr[$col] = $objWorksheet->getCellByColumnAndRow($col, $row)->getValue();
            }
            $md5Pw = md5($arr[1]);
            if ($power == 2) {
                $companyId = $this->session->userdata('user')['company_id'];
            } else {
                $companyId = $this->user_model->findCompanyIdByName($arr[3]);
            }
            $data = array('name' => $arr[0], 'password' => $md5Pw, 'phone' => $arr[2], 'company_id' => $companyId, 'role' => $arr[3]);
            $this->user_model->insert('company_users', $data);
            $chk = $this->db->affected_rows();
            $chk > 0 ? $total++ : $total = $total;
        }
        unlink($uploadFile);   //删除上传的excel文件
        if ($total > 0) {
            $arr = array('state' => true, 'msg' => '已导入' . $total . '条用户信息');
            echo json_encode($arr);
        } else {
            $arr = array('state' => false, 'msg' => '导入信息失败');
            echo json_encode($arr);
        }
    }

    public function saveSystemUser()
    {
        if (empty($_POST)) {
            return;
        }
        $id = $_POST['id'];
        $name = $_POST['name'];
        $pwd = md5($_POST['password']);
        $remarks = $_POST['remarks'];
        $data = array('name' => $name, 'password' => $pwd, 'remarks' => $remarks);
        if ($id == 0) {
            $isExist = $this->user_model->isExistUsername('system_users', $name);
            if ($isExist) {
                $arr = array('state' => false, 'msg' => '用户名已经存在');
                echo json_encode($arr);
                return;
            }
            $this->user_model->insert('system_users', $data);
        } else {
            $this->user_model->update('system_users', $data, $id);
        }
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '添加用户成功');
        } else {
            $arr = array('state' => false, 'msg' => '添加用户失败');
        }
        echo json_encode($arr);
    }

    public function deleteUser()
    {
        $id = intval($_POST['id']);
        switch ($_POST['power']) {
            case '1':
                $table = 'users';
                break;
            case '2':
                $table = 'company_users';
                break;
            case '3':
                $table = 'system_users';
                break;
        }
        $this->user_model->delete($table, $id);
        $chk = $this->db->affected_rows();
        if ($chk > 0) {
            $arr = array('state' => true, 'msg' => '用户删除成功');
        } else {
            $arr = array('state' => false, 'msg' => '用户删除失败');
        }
        echo json_encode($arr);
    }

}