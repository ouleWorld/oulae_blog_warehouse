// ajax 请求路由
const baseUrl = 'https://httpbin.org';

const ajaxPromise = (method, path, data, headerData) => {
  const p = new Promise((resolve, reject) => {
    const r = new XMLHttpRequest();
    let url = baseUrl + path;
    headerData = headerData || [];

    if (method === 'POST') {
      headerData.push({
        key: 'Content-type',
        value: 'text/html',
      });
    } else if (method === 'GET') {
      let str = '?';
      const paramsList = Object.entries(data);
      paramsList.forEach(([key, value], index) => {
        str += `${key}=${value}${index === paramsList.length - 1 ? '' : '&'}`;
      });
      url += str;
    }

    r.open(method, url, true);

    headerData.forEach(({ key, value }) => {
      r.setRequestHeader(key, value);
    });

    r.addEventListener('load', () => {
      resolve(r.response);
    });
    r.addEventListener('error', (err) => {
      reject(err);
    });

    r.send(JSON.stringify(data));
  });
  return p;
};

const requestGet = (path, data, contentType) => {
  ajaxPromise('GET', path, data, contentType);
};

const requestPost = (path, data, contentType) => {
  ajaxPromise('POST', path, data, contentType);
};

const $request = {
  get: requestGet,
  post: requestPost,
  ajax: ajaxPromise,
};
