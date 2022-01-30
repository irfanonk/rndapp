import createDataContext from "../createDataContext";
import reducer, { initialState } from "./reducer";
import * as actions from "./actions";

export const {
  Context: WalletContext,
  Provider: WalletProvider,
} = createDataContext(reducer, { ...actions }, initialState);
