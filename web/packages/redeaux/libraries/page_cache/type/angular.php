<?php

	class AngularPageCache extends Concrete5_Library_PageCache {
		
		const MD5_PEPPER 		= 'r3disPaGeCach3r',
			  REDIS_HASH_HANDLE = 'redis_fp_cache';
		
		public function getRecord($mixed){
			$result = ConcreteRedis::db()->hget(self::REDIS_HASH_HANDLE, $this->getCacheKey($mixed));
			if( !($result === null) ){
				$record = @unserialize($result);
				if( $record instanceof PageCacheRecord ){
					return $record;
				}
			}
		}
		
		public function getCacheKey($mixed){
            return md5(Request::get()->cPath . print_r($_REQUEST,true) . parent::getCacheKey($mixed));
//          $headers = getallheaders();
//			return md5( ($headers['x-angularized'] ? 'angular' : '') . self::MD5_PEPPER . parent::getCacheKey($mixed) );
		}
		
		
		public function purgeByRecord(PageCacheRecord $rec){
			ConcreteRedis::db()->hdel( self::REDIS_HASH_HANDLE, $this->getCacheKey($rec) );
		}
		
		public function flush(){
			ConcreteRedis::db()->del( self::REDIS_HASH_HANDLE );
		}
		
		public function purge(Page $c){
			ConcreteRedis::db()->hdel( self::REDIS_HASH_HANDLE, $this->getCacheKey($c) );
		}
		
		public function set(Page $c, $content){
			$lifetime  = $c->getCollectionFullPageCachingLifetimeValue();
			$cacheData = new PageCacheRecord($c, $content, $lifetime);
			if( $content ){
				ConcreteRedis::db()->hset( self::REDIS_HASH_HANDLE, $this->getCacheKey($c), serialize($cacheData) );
			}
		}
		
	}
