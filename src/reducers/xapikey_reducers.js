import { AUTH } from '../actions';

export default function (state = {}, action) {
  switch (action.type) {
    case AUTH: {
      return action.xApiKey;
    }
    default: {
      return state;
    }
  }
}
