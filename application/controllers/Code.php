<?php

/**
 * Created by Donghuating.
 * Date: 2017-03-30 下午 8:13
 */

class Code extends CI_Controller
{
    public function index($width = 180, $height = 40, $code_num = 4, $flag = false)
    {

        //创建图像
        $img = imagecreatetruecolor($width, $height);
        $bgColor = imagecolorallocate($img,214,214,214);
        imagefill($img, 0, 0, $bgColor);

        //存放随机码
        $code = '';

        //生成随机码
        for ($i = 0; $i < $code_num; $i++) {
            $code .= dechex(mt_rand(0, 15));
        }

        //保存到session
        $_SESSION['code'] = $code;

        if ($flag) {
            $blackBorder = imagecolorallocate($img, 0, 0, 0);
            imagerectangel($img, 0, 0, $width - 1, $height - 1, $blackBorder);
        }

        //随机雪花
        for ($i = 0; $i < 60; $i++) {
            $color = imagecolorallocate($img, mt_rand(240, 255), mt_rand(240, 255), mt_rand(240, 255));
            imagestring($img, 2, mt_rand(0, $width), mt_rand(0, $height), '*', $color);
        }

        for ($i = 0; $i < strlen($_SESSION['code']); $i++) {
            $fontSize = 30;
            $angle = mt_rand(0,90);
            $fontFile = $_SERVER["DOCUMENT_ROOT"].'/assets/code_font/AngelicWar.ttf';
            $color = imagecolorallocate($img, mt_rand(80, 200), mt_rand(80, 200), mt_rand(80, 200));
            $x = $i * $width / $code_num + mt_rand(20, 25);
            $y = mt_rand(30, 35);
            imagettftext($img,$fontSize, $angle, $x, $y,$color,$fontFile,$_SESSION['code'][$i]);
        }

        //输出图像
        header('Content-Type: image/png');
        imagepng($img);
        imagedestroy($img);
    }
}