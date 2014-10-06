<?php defined('C5_EXECUTE') or die("Access Denied.");

    class WorkController extends RedeauxPageController {

        protected $_includeThemeAssets = true;
        protected $_pageElement        = 'work';


        public function view( $project = null ){
            parent::view();
        }

    }