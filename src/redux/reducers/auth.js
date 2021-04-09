const initialState = {
  token: null,
  errorMsg: null,
  isRefresh: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        ...state,
        token: action.token,
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        token: action.token,
        errorMsg: action.errorMsg,
      };
    }
    case 'SET_REFRESH': {
      return {
        ...state,
        isRefresh: !state.isRefresh,
      };
    }
    case 'SET_ERROR': {
      return {
        ...state,
        errorMsg: action.errorMsg,
      };
    }
    case 'SET_NULL_ERROR': {
      return {
        ...state,
        errorMsg: action.errorMsg,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default authReducer;
