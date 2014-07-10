<?php defined('C5_EXECUTE') or die(_("Access Denied."));
	
	class Focus43Package extends Package {
	
	    protected $pkgHandle 			= 'focus43';
	    protected $appVersionRequired 	= '5.6.2.1';
	    protected $pkgVersion 			= '0.02';
	
		
		/**
		 * @return string
		 */
	    public function getPackageName(){
	        return t('Focus43');
	    }
		
		
		/**
		 * @return string
		 */
	    public function getPackageDescription() {
	        return t('Focus43 Site Package');
	    }
	
		
		/**
		 * Run hooks high up in the load chain.
		 * @return void
		 */
	    public function on_start(){
	        define('FOCUS43_TOOLS_PATH', BASE_URL . REL_DIR_FILES_TOOLS_PACKAGES . '/' . $this->pkgHandle . '/');
			define('FOCUS43_IMAGE_PATH', DIR_REL . '/packages/' . $this->pkgHandle . '/images/');
			// Autoload classes
			Loader::registerAutoload(array(
				'Focus43PageController'	=> array('library', 'page_controller', $this->pkgHandle)
			));
	    }
		
	
		/**
		 * Proxy to the parent uninstall method
		 * @return void
		 */
	    public function uninstall() {
	        parent::uninstall();
			
			try {
				// delete database tables (if applicable)
			}catch(Exception $e){ /* FAIL GRACEFULLY */ }
	    }


        /**
         * Run before install or upgrade to ensure dependencies are present
         * @dependency concrete_redis package
         */
        private function checkDependencies(){
            // none required
        }
	    
		
		/**
		 * @return void
		 */
	    public function upgrade(){
            $this->checkDependencies();
			parent::upgrade();
			$this->installAndUpdate();
	    }
		
		
		/**
		 * @return void
		 */
		public function install() {
            $this->checkDependencies();
	    	$this->_packageObj = parent::install(); 
			$this->installAndUpdate();
	    }
		
		
		/**
		 * Handle all the updating methods.
		 * @return void
		 */
		private function installAndUpdate(){
			$this->runUpgradeTasks( $this->pkgVersion )
				 ->setupUserAttributes()
				 ->setupTheme()
				 ->setupPageTypes();
		}


        /**
         * Run per-version tasks. The version passed in is the version being upgraded *to*.
         * @return Focus43Package
         */
        private function runUpgradeTasks( $version ){
            // Get the handle
            $handle = sprintf('v%s', str_replace('.', '_', (string)(float)$version));
            $klass  = sprintf('UpgradeTask_%s', $handle);

            if( file_exists(Environment::get()->getPath(DIRNAME_LIBRARIES . "/upgrade_task/{$handle}.php", $this->pkgHandle)) ){
                // Register for autoloading
                Loader::registerAutoload(array(
                    $klass => array('library', "upgrade_task/{$handle}", $this->pkgHandle)
                ));

                // Test to see if the class exists (ie. was autoloaded)
                if( class_exists($klass) ){
                    try {
                        call_user_func(array($klass, 'run'));
                    }catch(Exception $e){
                        throw new Exception("Tried executing upgrade_task {$handle} but failed.");
                    }
                }
            }

            // Return package instance
            return $this;
        }


		/**
		 * @return Focus43Package
		 */
		private function setupUserAttributes(){
			if( !(is_object(UserAttributeKey::getByHandle('full_name'))) ){
				UserAttributeKey::add($this->attributeType('text'), array(
					'akHandle'					=> 'full_name',
					'akName'					=> t('Full Name'),
					'uakRegisterEdit'			=> 1,
					'uakRegisterEditRequired' 	=> 0
				), $this->packageObject());
			}
			
			return $this;
		}
		
		
		/**
		 * @return Focus43Package
		 */
		private function setupTheme(){
            try {
                $themeObj = PageTheme::add('f43', $this->packageObject());
                $themeObj->applyToSite();
            }catch(Exception $e){ /* fail gracefully */ }
			
			return $this;
		}
		
		
		/**
		 * @return Focus43Package
		 */
		private function setupPageTypes(){
			if( !is_object($this->pageType('default')) ){
	            CollectionType::add(array('ctHandle' => 'default', 'ctName' => 'Default'), $this->packageObject());
	        }

            return $this;
		}


		/**
		 * @param Page $parent The parent page that the page being added should go under
		 * @param string $name Name of the page
		 * @param string Handle of the page_type to use
		 * @return Page
		 */
		private function pageFactory( Page $parent, $name, $typeHandle = 'default' ){
			return $parent->add( $this->pageType($typeHandle), array(
				'cName' => $name,
				'pkgID' => $this->packageObject()->getPackageID()
			));
		}
		
		
		/**
		 * Get or create an attribute set, for a certain attribute key category (if passed).
		 * Will automatically convert the $attrSetHandle from handle_form_name to Handle Form Name
		 * @param string $attrSetHandle
		 * @param string $attrKeyCategory
		 * @return AttributeSet
		 */
		private function getOrCreateAttributeSet( $attrSetHandle, $attrKeyCategory = null ){
			if( $this->{ 'attr_set_' . $attrSetHandle } === null ){
				// try to load an existing Attribute Set
				$attrSetObj = AttributeSet::getByHandle( $attrSetHandle );
				
				// doesn't exist? create it, if an attributeKeyCategory is passed
				if( !is_object($attrSetObj) && !is_null($attrKeyCategory) ){
					// ensure the attr key category can allow multiple sets
					$akc = AttributeKeyCategory::getByHandle( $attrKeyCategory );
					$akc->setAllowAttributeSets( AttributeKeyCategory::ASET_ALLOW_MULTIPLE );
					
					// *now* add the attribute set
					$attrSetObj = $akc->addSet( $attrSetHandle, t( $this->getHelper('text')->unhandle($attrSetHandle) ), $this->packageObject() );
				}
				
				// assign the $attrSetObj
				$this->{ 'attr_set_' . $attrSetHandle } = $attrSetObj;
			}
			
			return $this->{ 'attr_set_' . $attrSetHandle };
		}


		/**
		 * Get the package object; if it hasn't been instantiated yet, load it.
		 * @return Package
		 */
		private function packageObject(){
			if( $this->_packageObj === null ){
				$this->_packageObj = Package::getByHandle( $this->pkgHandle );
			}
			return $this->_packageObj;
		}
		
		
		/**
		 * @return CollectionType
		 */
		private function pageType( $handle ){
			if( $this->{ "pt_{$handle}" } === null ){
				$this->{ "pt_{$handle}" } = CollectionType::getByHandle( $handle );
			}
			return $this->{ "pt_{$handle}" };
		}
		
		
		/**
		 * @return AttributeType
		 */
		private function attributeType( $atHandle ){
			if( $this->{ "at_{$atHandle}" } === null ){
                $attributeType = AttributeType::getByHandle( $atHandle );
                if( $attributeType->getAttributeTypeID() >= 1 ){
                    $this->{ "at_{$atHandle}" } = $attributeType;
                }

			}
			return $this->{ "at_{$atHandle}" };
		}
		
		
		/**
		 * Get an attribute key category object (eg: an entity category) by its handle
		 * @return AttributeKeyCategory
		 */
		private function attributeKeyCategory( $handle ){
			if( !($this->{ "akc_{$handle}" } instanceof AttributeKeyCategory) ){
				$this->{ "akc_{$handle}" } = AttributeKeyCategory::getByHandle( $handle );
			}
			return $this->{ "akc_{$handle}" };
		}
		
		
		/**
		 * "Memoize" helpers so they're only loaded once.
		 * @param string $handle Handle of the helper to load
		 * @param string $pkg Package to get the helper from
		 * @return ...Helper class of some sort
		 */
		private function getHelper( $handle, $pkg = false ){
			$helper = '_helper_' . preg_replace("/[^a-zA-Z0-9]+/", "", $handle);
			if( $this->{$helper} === null ){
				$this->{$helper} = Loader::helper($handle, $pkg);
			}
			return $this->{$helper};
		}
	    
	}
