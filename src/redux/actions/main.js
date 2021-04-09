export const showPassword = () => {
  return async dispatch => {
    dispatch({
      type: 'PEEK_PASSWORD',
    });
  };
};

export const setLoading = () => {
  return async dispatch => {
    dispatch({
      type: 'SET_LOADING',
    });
  };
};

export const setTab = tab => {
  return async dispatch => {
    dispatch({
      type: 'SET_TAB',
      payload: tab,
    });
  };
};
