<?php defined('C5_EXECUTE') or die("Access Denied.");

    class RedeauxPageController extends Controller {

        /** @property $_includeThemeAssets bool */
        protected $_includeThemeAssets = false;

        /** @property $_canEdit bool : Set in on_start method */
        protected $_canEdit = false;

        /** @property $_isEditMode bool : Set in on_start method */
        protected $_isEditMode = false;


        /**
         * Base controller's view method.
         * @return void
         */
        public function view(){
            if( $this->_includeThemeAssets === true ){
                $this->attachThemeAssets( $this );
            }
        }


        /**
         * @return void
         */
        public function on_start(){
            $this->_canEdit     = $this->pagePermissionObject()->canWrite();
            $this->_isEditMode  = $this->getCollectionObject()->isEditMode();
        }


        /**
         * Include css/js assets in page output.
         * @param $pageController Controller : Forces the page controller to be injected!
         * @return void
         */
        public function attachThemeAssets( Controller $pageController ){
            // CSS
            $pageController->addHeaderItem( $this->getHelper('html')->css('app.css', RedeauxPackage::PACKAGE_HANDLE) );
            // JS
            $pageController->addFooterItem( $this->getHelper('html')->javascript('core.js', RedeauxPackage::PACKAGE_HANDLE) );
            $pageController->addFooterItem( $this->getHelper('html')->javascript('app.js', RedeauxPackage::PACKAGE_HANDLE) );
            // LiveReload (if local dev environment)
            $test1 = (bool) isset($_SERVER['VAGRANT_VM']);
            $test2 = (bool) ($_SERVER['VAGRANT_VM'] === true);
            $test3 = (bool) (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false);
            if( $test1 && $test2 && $test3 ){
                $pageController->addFooterItem('<script src="//localhost:35729/livereload.js"></script>');
            }
        }


        /**
         * Memoize helpers (beware, once loaded its always the same instance).
         * @param string $handle Handle of the helper to load
         * @param bool | Package $pkg Package to get the helper from
         * @return ...Helper class of some sort
         */
        public function getHelper( $handle, $pkg = false ){
            $helper = '_helper_' . preg_replace("/[^a-zA-Z0-9]+/", "", $handle);
            if( $this->{$helper} === null ){
                $this->{$helper} = Loader::helper($handle, $pkg);
            }
            return $this->{$helper};
        }


        /**
         * Get the Concrete5 permission object for the given page.
         * @return Permissions
         */
        protected function pagePermissionObject(){
            if( $this->_pagePermissionObj === null ){
                $this->_pagePermissionObj = new Permissions( $this->getCollectionObject() );
            }
            return $this->_pagePermissionObj;
        }

    }