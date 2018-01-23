// *********************************************************************************************************************
// Cache functions
// *********************************************************************************************************************

function getCache(){
  return CacheService.getDocumentCache();
}

function putToCache(key, value, expirationInSeconds) {
  var cache = getCache();
  cache.put(key, value, expirationInSeconds);
}

function getFromCache(key){
  var cache = getCache();
  return cache.get(key);
}

function getCachedUrlContent(url){

  var cachedContent = getFromCache(url);

  if(cachedContent==null){
    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();

    var cacheExpiryInSeconds = 60 * 10; // 10 minutes
    putToCache(url, json, cacheExpiryInSeconds);
    cachedContent = json;
    incrementUrlFetch();
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
