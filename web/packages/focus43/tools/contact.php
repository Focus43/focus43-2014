<?php defined('C5_EXECUTE') or die("Access Denied.");

    $message = "";
    foreach($_REQUEST AS $key => $val){
        $message .= "{$key}: {$val};";
    }

    Log::addEntry($message, 'contact_message');

    echo Loader::helper('json')->encode((object)array(
        'code' => 1,
        'msg'  => 'Success!'
    ));