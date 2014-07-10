<?php defined('C5_EXECUTE') or die("Access Denied.");

    class Request extends Concrete5_Library_Request {

        /**
         * Override the default Request library so we can check if the request is
         * coming from an angular-controlled front-end (ie, request header x-angularized
         * will be set); or not.
         * @param string $path
         */
        public function __construct($path){
            if( $this->systemPassThrough($path) ){
                parent::__construct($path);
                return;
            }

            if( !array_key_exists('x-angularized', getallheaders()) ){
                $path = '';
            }
            parent::__construct($path);
        }


        /**
         * Pass in the the request $path and see if it should be handled directly
         * by the system.
         * @param $path
         * @return bool
         */
        private function systemPassThrough( $path ){
            $exploded = explode('/', $path);
            if(in_array($exploded[0], array('tools', 'dashboard', 'login'))){
                return true;
            }
            return false;
        }

    }
