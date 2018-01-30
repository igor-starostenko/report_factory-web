import { API_KEY } from '../actions/users_actions';

export default (state = null, action) => {
  switch (action.type) {
    case API_KEY: {
      return action.xApiKey;
    }
    default: {
      return state;
    }
  }
};
