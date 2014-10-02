<?php defined('C5_EXECUTE') or die("Access Denied.");

    class InstagramAPI {

        const CLIENT_ID     = INSTAGRAM_CLIENT_ID;
        const CLIENT_SECRET = INSTAGRAM_CLIENT_SECRET;
        const WEBSITE_URL   = 'http://jghartman.com';
        const REDIRECT_URI  = 'http://jghartman.com/instagram/auth';
        const USER_ID       = 49490334;

        const BASE_DOMAIN   = 'https://api.instagram.com';
        const RESOURCE_USER = '/v1/users/%s/media/recent';
        const RESOURCE_TAGS = '/v1/tags/%s/media/recent';

        protected $_jsonHelper;


        /**
         * @var array
         */
        protected static $alwaysParams = array(
            'client_id'     => self::CLIENT_ID
        );


        /**
         * @param callable $closure
         */
        public function __construct( closure $closure ){
            $this->_jsonHelper  = Loader::helper('json');
            $closure($this);
        }


        /**
         * @param int $count
         * @return stdClass JSON data
         */
        public function getRecentByUser( $userID = self::USER_ID, $count = 12 ){
            // Prepare the resource path
            $resource = self::BASE_DOMAIN . sprintf(self::RESOURCE_USER, $userID);

            // Execute
            return $this->_call($resource, $this->_parameters(array(
                'count' => (int) $count
            )));
        }


        /**
         * @param int $count
         * @return stdClass JSON data
         */
        public function getRecentByTag( $tag, $count = 12 ){
            // Prepare the resource path
            $resource = self::BASE_DOMAIN . sprintf(self::RESOURCE_TAGS, $tag);

            // Execute
            return $this->_call($resource, $this->_parameters(array(
                'count' => (int) $count
            )));
        }


        /**
         * Always call this instead of passing an array of parameters directly, as this
         * will merge in credentials.
         * @param array $parameters
         * @return array
         */
        protected function _parameters( array $parameters = array() ){
            return array_merge(self::$alwaysParams, $parameters);
        }


        /**
         * Execute call to the API.
         * @param $resource
         * @param array $parameters
         * @return mixed
         * @throws Exception
         */
        protected function _call( $resource, array $parameters = array() ){
            $curly = curl_init( $resource . '?' . http_build_query($parameters) );

            // Set options
            curl_setopt_array($curly, array(
                CURLOPT_HEADER          => true,
                CURLOPT_RETURNTRANSFER  => true,
                CURLOPT_FOLLOWLOCATION  => true,
                CURLOPT_SSL_VERIFYPEER  => true,
                CURLOPT_SSL_VERIFYHOST  => 2,
                CURLOPT_MAXREDIRS       => 3,
                CURLOPT_CONNECTTIMEOUT  => 6, // 3 seconds
                CURLOPT_TIMEOUT         => 6  // 8 seconds
            ));

            // Exec request and store in $response
            $response = curl_exec($curly);

            // Close the CURL session
            curl_close($curly);

            // Parse out HTTP headers, and response body
            list($headers, $body) = explode("\r\n\r\n", $response, 2);

            // Check the headers; if OK, try and parse response body as JSON
            if( $this->parseResponseHeaders($headers) ){
                try {
                    $parsed = $this->_jsonHelper->decode($body);

                    // Errors?
                    if( is_object($parsed) && property_exists($parsed, 'errors') ){
                        //throw new Exception(sprintf('Shopifiable API error: %s', print_r($parsed->errors, true)));
                        throw new Exception(sprintf("Instagram API error:\n (HEADERS)\n %s\n (BODY)\n %s\n", print_r($headers, true), print_r($body, true)));
                    }

                    return $parsed;
                }catch(Exception $e){
                    throw $e; // Rethrow
                }
            }
        }


        /**
         * Parse the response headers from the call to Shopify API; and just make sure that the
         * response code is within the 200 range; else throw an exception.
         * @param string $httpHeaders
         * @return bool
         * @throws Exception
         * @todo: parse and look at HTTP code response; if valid, return true, else throw an exception
         */
        private function parseResponseHeaders( $httpHeaders ){
            // split the headers into an array
            $headers    = preg_split("/\r\n|\n|\r/", $httpHeaders);
            // preg_grep returns array w/ prefilled keys; array_values sets key to 0
            $status     = array_values( preg_grep("/HTTP\\/1.1/i", $headers) );
            // array([0] => Status:, [1] => {int}, [2] => OK)
            $pieces     = explode(' ', $status[0]);
            $httpCode   = (int) $pieces[1];
            // finally, check the status code
            if( $httpCode >= 200 && $httpCode < 300 ){
                return true;
            }

            throw new Exception(sprintf("Shopifiable Response Headers Error:\n %s", print_r($httpHeaders, true)));
        }

    }