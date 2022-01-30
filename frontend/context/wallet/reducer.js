import {
  CREATE_WALLET,
  DEHYDRATE_WALLET,
  REMOVE_WALLET,
  RESTORE_WALLET,
} from "./keys";

export const initialState = {
  isUserLoggedIn: false,
  address: "",
  pk: "",
};

export default (state, { type, payload }) => {
  switch (type) {
    case DEHYDRATE_WALLET:
      return {
        ...state,
        isUserLoggedIn: true,
        address: payload.address,
        pk: payload.pk,
      };

    case CREATE_WALLET:
    case RESTORE_WALLET:
      return {
        ...state,
        isUserLoggedIn: true,
        address: payload.address,
        pk: payload.privateKey,
      };
    case REMOVE_WALLET:
      return {
        isUserLoggedIn: false,
        address: "",
        pk: "",
      };
    default:
      return state;
  }
};
