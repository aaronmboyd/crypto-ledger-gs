// *********************************************************************************************************************
// Cache functions
// Use MD5 hash of the URL because cache key size is limited
// *********************************************************************************************************************

var MAXIMUM_CACHE_EXPIRY = 21600;

function getCache(){
  return CacheService.getDocumentCache();
}

function putToCache(key, value, expirationInSeconds) {
  
  if(expirationInSeconds > MAXIMUM_CACHE_EXPIRY) {
    expirationInSeconds = MAXIMUM_CACHE_EXPIRY;
  }  
  getCache().put(key, value, expirationInSeconds);
}

function getFromCache(key){
  var cache = getCache();
  return cache.get(key);
}

function getCachedUrlContent(url, cacheExpiryInSeconds){

  // Concatenate url with expiry time so that short cache requests are not bundled in with long ones
  var cacheKey = MD5(url + "-" + cacheExpiryInSeconds);
  
  //Logger.log("URL is : " + url);
  Logger.log("MD5 for cache is : " + cacheKey);
  
  var cachedContent = getFromCache(cacheKey);

  if(cachedContent==null){
    var response = UrlFetchApp.fetch(url);
    
    // Too many requests, try again in 3 seconds
    if(response.getResponseCode() == 429){
      Utilities.sleep(3000);
      getCachedUrlContent(url, cacheExpiryinSeconds);
    }
    // OK
    else if (response.getResponseCode() == 200) {    
      var json = response.getContentText();      
      putToCache(cacheKey, json, cacheExpiryInSeconds);
      cachedContent = json;
      incrementUrlFetch();
    }
    // All other errors return error but don't cache result
    else {
      var json = response.getContentText();      
      cachedContent = json;
    }    
  }
  else {
    incrementCacheFetch();
  }

  return cachedContent;
}

function incrementUrlFetch(){
  var urlFetchCount = getFromCache("urlFetchCount");
  if(urlFetchCount==null){
    urlFetchCount=0;
  }
  urlFetchCount++;
  putToCache("urlFetchCount", urlFetchCount, 10);
}

function incrementCacheFetch(){
  var cacheFetchCount = getFromCache("cacheFetchCount");
  if(cacheFetchCount==null){
    cacheFetchCount=0;
  }
  cacheFetchCount++;
  putToCache("cacheFetchCount", cacheFetchCount, 10);
}

function getUrlFetchCount(){
  var count = getFromCache("urlFetchCount");
  if (count==null){
    Logger.log("count==null");
    count = 0;
  }
  return Number(count);
}

function getCacheFetchCount(){
  var count = getFromCache("cacheFetchCount");
  if (count==null){
    Logger.log("count==null");
    count = 0;
  }
  return Number(count);
}