<?php

    /** @var $pageObj Page */
    $pageObj    = Page::getByPath('/' . ltrim($_REQUEST['route'], '/'));
    $areaBlocks = $pageObj->getBlocks( $_REQUEST['area'] );
    foreach($areaBlocks AS $blockObj){ /** @var $blockObj Block */
        $blockObj->display();
    }

    /** @var $pageObj Page */
//    $pageObj    = Page::getByPath('/' . ltrim($_REQUEST['route'], '/'));
//    $blocks     = $pageObj->getBlocks();
//    $buffered   = array();

//    foreach($blocks AS $blockObj){ /** @var $blockObj Block */
//        if( ! $buffered[$blockObj->getAreaHandle()] ){
//            $buffered[$blockObj->getAreaHandle()] = array();
//        }
//
//        ob_start();
//        $blockObj->display();
//        array_push($buffered[$blockObj->getAreaHandle()], ob_get_contents());
//        ob_end_clean();
//    }
//
//    echo json_encode($buffered);