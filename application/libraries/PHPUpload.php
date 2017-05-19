<?php
/**
 * Created by Donghuating.
 * Date: 2017-05-12 下午 6:32
 */
defined('BASEPATH') OR exit('No direct script access allowed');

class PHPUpload
{
    public function doUpload()
    {
        if (empty($_FILES)) {
            return;
        }

        $filename = $_FILES['userFile']['name'];//被上传文件的名称
        $filetype = $_FILES["userFile"]["type"];//被上传文件的类型
        $filetmp = $_FILES["userFile"]["tmp_name"];//存储在服务器的文件的临时副本的名称
        $fileerror = $_FILES["userFile"]["error"];//由文件上传导致的错误代码

        //判断是否上传成功
        if ($fileerror !== 0) {
            return false;
        }
        //判断是否是excel表格
        if ($filetype == "application/vnd.ms-excel" || $filetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            /*设置保存路径*/
            $filePath = './uploads/excel/';
        }
        if($filetype == 'image/jpeg' || $filetype == 'image/jpg' || $filetype == 'image/png' || $filetype == 'image/gif'){
            $filePath = './uploads/ad/';
        }

        //注意设置时区
        $time = date('YmdHis'); //当前上传的时间
        //获取上传文件的扩展名
        $extend = strrchr($filename, '.');
        //上传后的文件名
        $name = $time . $extend;
        //上传后的文件名地址
        $uploadfile = $filePath . $name;

        //move_uploaded_file() 函数将上传的文件移动到新位置。若成功，则返回 true，否则返回 false。
        $result = move_uploaded_file($filetmp, $uploadfile);
        if($result) {
            return $uploadfile;
        }else{
            return '';
        }
    }
}