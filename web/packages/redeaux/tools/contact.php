<?php defined('C5_EXECUTE') or die("Access Denied.");

    // Set HTTP response header
    header('Content-Type: application/json');

    // Load JSON helper
    $jsonHelper = Loader::helper('json');

    try {
        $postBody = $jsonHelper->decode(file_get_contents('php://input'));

        $message = "";
        foreach($postBody AS $key => $val){
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
        echo $jsonHelper->encode((object)array(
            'ok'  => true,
            'msg' => "Thanks for getting in touch! We'll get back to you as soon as humanly possible."
        ));
    }catch(Exception $e){
        echo $jsonHelper->encode((object)array(
            'ok'  => false,
            'msg' => $e->getMessage()
        ));
    }