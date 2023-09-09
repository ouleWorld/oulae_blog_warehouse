export const getDataSource = () => {
  const result = [];
  for (let i = 0; i < 10; i++) {
    let temp = {
      key: i,
      name: `name-${i}`,
    };
    for (let k = 0; k < 100; k++) {
      temp[`key-${k}`] = Math.random() > 0.5;
    }
    result.push(temp);
  }

  return result;
};

export const getDataFn = () => {
  let _r = undefined;

  // request('https://httpbin.org/ip', {
  //   method: 'GET',
  // }).then((res) => {
  //   const data = getDataSource();
  //   _r(data);
  // });

  setTimeout(() => {
    const data = getDataSource();
    _r(data);
  });

  return new Promise((resolve) => {
    _r = resolve;
  });
};
