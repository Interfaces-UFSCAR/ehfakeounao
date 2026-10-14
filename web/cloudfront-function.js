function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;

  if (host.startsWith('www.')) {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://' + host.slice(4) + request.uri } }
    };
  }

  if (request.uri.startsWith('/api/')) {
    request.uri = request.uri.slice(4);
    return request;
  }

  if (!request.uri.includes('.')) {
    request.uri = request.uri === '/' ? '/index.html' : request.uri.replace(/\/$/, '') + '.html';
  }
  return request;
}
