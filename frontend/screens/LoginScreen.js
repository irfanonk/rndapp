import React, { useEffect, useState, useContext } from "react";
import { View, Linking, orm } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import {
  Layout,
  Button,
  Text,
  TextInput,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";
import web3 from "../../web3/web3";
import { WalletContext } from "../context/wallet";

var Tx = require("ethereumjs-tx").Transaction;

import { useForm, Controller } from "react-hook-form";

export default function Login({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();

  const {
    restoreWallet,
    state: { isUserLoggedIn },
  } = useContext(WalletContext);
  const connector = useWalletConnect();

  const [addressData, setAddressData] = useState({});

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      privateKey: "",
    },
  });
  const onSubmit = (data) => {
    const { address } = web3.eth.accounts.privateKeyToAccount(data.privateKey);
    // alert(address);
    if (web3.utils.isAddress(address)) {
      restoreWallet({ address: address, privateKey: data.privateKey });
    }
  };

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <Layout>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 20,
        }}
      >
        <Section>
          <SectionContent>
            <Text fontWeight="bold" style={{ textAlign: "center" }}>
              Wallet Screen
            </Text>

            <Text style={{ marginBottom: 10 }}>
              Restore wallet with private key
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="privateKey"
              placeholder="Private Key"
            />
            {errors.firstName && <Text>This is required.</Text>}
            <Button text="Activate" onPress={handleSubmit(onSubmit)} />
            <Button
              text="Conncet wallet"
              onPress={connectWallet}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text={isDarkmode ? "Light Mode" : "Dark Mode"}
              status={isDarkmode ? "success" : "warning"}
              onPress={() => {
                if (isDarkmode) {
                  setTheme("light");
                } else {
                  setTheme("dark");
                }
              }}
              style={{
                marginTop: 10,
              }}
            />
          </SectionContent>
        </Section>
      </View>
    </Layout>
  );
}
