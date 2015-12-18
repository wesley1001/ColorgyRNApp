import alert from '../utils/alert';

const alertMiddleware = (store) => (next) => (action) => {
  let result = next(action);

  switch (action.type) {
    case 'REQUEST_ACCESS_TOKEN_FAILED':
      alert('登入有誤！請檢查您的帳號或密碼，若問題無法解決，請聯繫我們協助處理！');
      break;
  }

  return result;
};

export default alertMiddleware;
