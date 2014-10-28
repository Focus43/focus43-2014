<?php defined('C5_EXECUTE') or die("Access Denied.");

    class WorkController extends RedeauxPageController {

        protected $_includeThemeAssets = true;
        protected $_pageElement        = 'work';


        /**
         * Override default view method.
         * @param null $project
         * @todo: consider rebuilding this way in 5.7; with more advanced routing
         *
        public function view( $project = null ){
            if( is_string($project) ){
                $this->_pageElement = sprintf('projects/%s', $project);
            }
            // Render page
            parent::view();
        }*/

    }