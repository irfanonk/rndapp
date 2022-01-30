import { CommonActions } from "@react-navigation/native";
import React, { useContext, useState, useEffect } from "react";
import { View } from "react-native";
import { Button, Layout, Text } from "react-native-rapi-ui";
import { WalletContext } from "../context/wallet";
import { getValueFor } from "../utils/utils";
import * as SecureStore from "expo-secure-store";
import web3 from "../../web3/web3";

export default function ({ navigation }) {
  const {
    removeWallet,
    state,
    state: { isUserLoggedIn, address },
  } = useContext(WalletContext);
  const [balance, setBalance] = useState("");
  useEffect(() => {
    (async () => {
      let balance = await web3.eth.getBalance(address);
      balance = web3.utils.fromWei(balance, "ether");
      setBalance(balance);
    })();

    return () => {};
  }, []);

  const onRemoveWallet = async () => {
    removeWallet();
  };

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text fontWeight="medium">{address} </Text>
        <Text>Balance</Text>
        <Button
          text={balance}
          outline
          style={{
            marginTop: 10,
          }}
        />
        <Button
          text="Log out"
          color="red"
          onPress={onRemoveWallet}
          style={{
            marginTop: 10,
          }}
        />
      </View>
    </Layout>
  );
}
