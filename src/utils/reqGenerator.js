import request from './request'; 

export function post(api, data) {
  let url = '/public/';
  return request(url, {
    method: 'POST',
    data: {
      s: api,
      ...
      data,
    },
  });
}

export function download(api, data) {
  let url = '/public/?';
  var params = {
    s: api,
    ...
    data,
  }
  Object.keys(params).forEach(item=> {
    if(!params[item]) delete params[item]
  })
  const querystring = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');
  window.location.href = url + querystring;
}