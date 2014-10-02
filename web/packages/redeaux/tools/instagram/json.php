<?php defined('C5_EXECUTE') or die("Access Denied.");

    $itemsPerPage = 16;

    new InstagramAPI(function( InstagramAPI $instance ) use ($itemsPerPage){
        $response = $instance->getRecentByUser($instance::USER_ID, $itemsPerPage);

        $purged = array();
        foreach($response->data AS $mediaObj){
            array_push($purged, (object)array(
                'image_src' => $mediaObj->images->standard_resolution->url,
                'caption'   => $mediaObj->caption->text,
                'link'      => $mediaObj->link,
                'username'  => $mediaObj->user->username
            ));
        }

        echo json_encode($purged);
    });