// *********************************************************************************************************************
// Cache functions
// *********************************************************************************************************************

function getCache()
{
  return CacheService.getDocumentCache();
}

function putToCache(key, value, expirationInSeconds)
{
  var cache = getCache();
  cache.put(key, value, expirationInSeconds);
}

function getFromCache(key)
{
  var cache = getCache();
  return cache.get(key);
}
