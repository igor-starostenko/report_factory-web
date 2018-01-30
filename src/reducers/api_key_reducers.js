import { API_KEY } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    case API_KEY: {
      return action.xApiKey;
    }
    default: {
      return state;
    }
  }
};
