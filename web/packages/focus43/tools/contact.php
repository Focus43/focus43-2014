<?php defined('C5_EXECUTE') or die("Access Denied.");

    // Chinsy message formatting
    $message = "";
    foreach($_REQUEST AS $key => $val){
        $message .= "{$key}: {$val}\n";
    }

    // Log to the dashboard
    Log::addEntry($message, 'contact_message');

    // Send by Email
    $mailHelper = Loader::helper('mail');
    $mailHelper->setSubject('Focus-43.com Website: Contact Form');
    $mailHelper->from(OUTGOING_MAIL_ISSUER_ADDRESS);
    $mailHelper->to('arik@focus-43.com');
    $mailHelper->to('stine@focus-43.com');
    $mailHelper->to('jon@focus-43.com');
    $mailHelper->setBody($message);
    $mailHelper->sendMail();

    // Encode JSON response
    echo Loader::helper('json')->encode((object)array(
        'code' => 1,
        'msg'  => 'Success!'
    ));