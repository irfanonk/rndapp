import { deleteValue, save } from "../../utils/utils";
import {
  CREATE_WALLET,
  DEHYDRATE_WALLET,
  REMOVE_WALLET,
  RESTORE_WALLET,
} from "./keys";

export const dehydrateWallet = (dispatch) => (payload) => {
  dispatch({ type: DEHYDRATE_WALLET, payload });
};

export const createWallet = (dispatch) => (payload) => {
  dispatch({ type: CREATE_WALLET, payload });

  save("address", payload.address).then(() => {});
  save("pk", payload.privateKey).then(() => {});
};

export const restoreWallet = (dispatch) => (payload) => {
  dispatch({ type: RESTORE_WALLET, payload });

  save("address", payload.address).then(() => {});
  save("pk", payload.privateKey).then(() => {});
};

export const removeWallet = (dispatch) => () => {
  dispatch({ type: REMOVE_WALLET });

  deleteValue("address").then(() => {});
  deleteValue("pk").then(() => {});
};
