<?php defined('C5_EXECUTE') or die("Access Denied.");

//    class AreaFaker {
//
//        public $arHandle;
//
//        public function __construct( $areaName ){
//            $this->arHandle = $areaName;
//        }
//
//        public function display( $c ){}
//    }


    class Focus43PageController extends Controller {

        const PACKAGE_HANDLE = Focus43Package::PACKAGE_HANDLE;

        /**
         * If regular page view, attach theme assets.
         */
        public function view(){
            if( $this->includeThemeAssets === true ){
                $this->attachThemeAssets( $this );
            }
        }


        /**
         * @return void
         */
        public function on_start(){
            $this->set('sectionElement', $this->sectionElement);
            $this->set('pageClass', $this->sectionElement);

            $cmsToolbar = $this->pagePermissionObject()->canWrite();
            $cmsEditing = $this->getCollectionObject()->isEditMode();
            $this->set('cmsToolbar', $cmsToolbar);
            $this->set('cmsEditing', $cmsEditing);

//            $documentClass = array();
//            if( $cmsToolbar ){ array_push($documentClass, 'cms-toolbar'); }
//            if( $cmsEditing ){ array_push($documentClass, 'cms-editing'); }
//            $this->set('documentClass', join(' ', $documentClass));
            if( $cmsToolbar ){
                $this->set('documentClass', 'cms-admin');
            }



            // Angularize this bitch...
            $headers = getallheaders();
            if( $headers['x-angularized'] ){
                Loader::packageElement("sections/{$this->sectionElement}", self::PACKAGE_HANDLE, array(
                    'c' => new Collection // inject an empty collection
                ));
                exit;
            }



            //$this->setBodyClasses();
        }


        private function setBodyClasses(){
            // take the route and explode to array slash delimited (/one/two = ['path-one', 'path-two'])
            $route = array_map(function( $node ){
                if( !empty($node) ){
                    return "pt-{$node}";
                }
            }, explode('/', $this->getCollectionObject()->getCollectionPath()));
            // set classes based on admin status and/or edit mode
            if( $this->pagePermissionObject()->canWrite() ){
                array_push($route, 'cms-admin');
                if( $this->getCollectionObject()->isEditMode() ){
                    array_push($route, 'edit-mode');
                }
            }
            // pass class string to the view
            $this->set('documentClass', join($route, ' '));
        }


        /**
         * Include assets used for page templates. *NOTE*, pass the pageController in (even
         * if we're doing it from the on_start method in this class), so this method can
         * be re-used on view.php templates
         * @return void
         */
        public function attachThemeAssets( Controller $pageController ){
            // CSS + Modernizr
            $pageController->addHeaderItem( $this->getHelper('html')->css('application.css', self::PACKAGE_HANDLE) );
            // JS
            $pageController->addFooterItem( $this->getHelper('html')->javascript('https://maps.googleapis.com/maps/api/js?key=AIzaSyANFxVJuAgO4-wqXOeQnIfq38x7xmhMZXY&sensor=TRUE&libraries=weather') );
            $pageController->addFooterItem( $this->getHelper('html')->javascript('core.js', self::PACKAGE_HANDLE) );
            $pageController->addFooterItem( $this->getHelper('html')->javascript('app.js', self::PACKAGE_HANDLE) );
            // Include live reload for for grunt watch *if* VAGRANT_VM
            if(isset($_SERVER['VAGRANT_VM']) && ((bool) $_SERVER['VAGRANT_VM'] === true)){
                $pageController->addFooterItem('<script src="http://localhost:35729/livereload.js"></script>');
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