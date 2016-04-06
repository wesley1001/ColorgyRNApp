import notify from '../utils/notify';

const notifyMiddleware = (store) => (next) => (action) => {
  let result = next(action);

  switch (action.type) {
    case 'REQUEST_ACCESS_TOKEN_FAILED':
      notify('登入有誤！請檢查您的帳號或密碼，若問題無法解決，請聯繫我們協助處理！');
      break;

    case 'UPDATE_ME_FAILD':
      notify('個人資料同步失敗！請檢查網路連線。');
      break;

    case 'CLEAR_ACCESS_TOKEN':
      notify('您已經登出。');
      break;
  }

  return result;
};

export default notifyMiddleware;
