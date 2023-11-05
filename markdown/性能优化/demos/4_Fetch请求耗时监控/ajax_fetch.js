// 请求路由
const baseUrl = 'https://httpbin.org';

const ajaxFetch = (method, path, data, headerData) => {
  headerData = headerData || [];
  let headers = {};
  let url = baseUrl + path;

  const params = {
    method,
    mode: 'cors',
    body: JSON.stringify(data),
  };

  if (method === 'POST') {
    headerData.push({
      key: 'Content-type',
      value: 'text/html',
    });
    headerData.forEach(({ key, value }) => {
      headers[key] = value;
    });
  } else if (method === 'GET') {
    let str = '?';
    const paramsList = Object.entries(data);
    paramsList.forEach(([key, value], index) => {
      str += `${key}=${value}${index === paramsList.length - 1 ? '' : '&'}`;
    });
    url += str;
  }
  method !== 'POST' && delete params.body;

  const response = fetch(url, {
    ...params,
    headers,
  });

  return response;
};

const fetchGet = (path, data, contentType) => {
  ajaxFetch('GET', path, data, contentType);
};

const fetchPost = (path, data, contentType) => {
  ajaxFetch('POST', path, data, contentType);
};

const $request = {
  get: fetchGet,
  post: fetchPost,
  fetch: ajaxFetch,
};
