import React, { useEffect, useState } from "react";
import { View, Linking } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import {
  Layout,
  Button,
  Text,
  Section,
  SectionContent,
  useTheme,
} from "react-native-rapi-ui";
import { ethers } from "ethers";
import Web3 from "web3";
import {
  ACCOUNT_PK,
  INFURA_ROBSTEN_URL_WSS,
  INFURA_ROBSTEN_URL,
  CAMPAIGN_FACTORY_ADDRESS,
} from "@env";
import Common, { Chain } from "@ethereumjs/common";
import { Transaction } from "@ethereumjs/tx";

import CampaignFactory from "../../eth/build/CampaignFactory.json";
import Campaign from "../../eth/build/Campaign.json";
import { Buffer } from "buffer";

var Tx = require("ethereumjs-tx").Transaction;

export default function App({ navigation }) {
  const { isDarkmode, setTheme } = useTheme();
  const connector = useWalletConnect();

  const [web3, setWeb3] = useState(null);
  const [addressData, setAddressData] = useState({});

  const to = "0x909B197D2b6A7641EE36A18A2c7491A494191FD6";

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);
  // const web3 = React.useMemo(
  //   () => new Web3(new Web3.providers.HttpProvider(INFURA_ROBSTEN_URL))
  // );

  const onClickNew = async () => {
    // console.log("new", ACCOUNT_PK);

    try {
      var gasPrice = 2; // Or get with web3.eth.gasPrice
      var gasLimit = 3000000;
      // const amountToSend = web3.utils.toWei("0.2", "ether");
      console.log("addressData", addressData.address, addressData.accountNonce);
      var rawTransaction = {
        from: addressData.address,
        nonce: addressData.accountNonce,
        gasPrice: web3.utils.toHex(gasPrice * 1e9),
        gasLimit: web3.utils.toHex(gasLimit),
        to: to,
        value: 200000000000000000,
        chainId: "3",
      };

      // var privKey = new Buffer.from(ACCOUNT_PK, "hex");
      console.log("new", ACCOUNT_PK);

      const privateKey = Buffer.from(ACCOUNT_PK, "hex");
      var tx = new Tx(rawTransaction);

      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      console.log("serialized", serializedTx.toString("hex"));
      await web3.eth.sendRawTransaction(
        "0x" + serializedTx.toString("hex"),
        function (err, hash) {
          if (!err) {
            console.log("Txn Sent and hash is " + hash);
          } else {
            console.error(err);
          }
        }
      );
    } catch (error) {
      console.log("err", error);
    }
  };
  const clickButton = async () => {
    console.log("clicked");
    try {
      const txParams = {
        nonce: addressData.accountNonce,
        gasLimit: 30000,
        gsaPrize: 10000000000000,
        to: "0x909B197D2b6A7641EE36A18A2c7491A494191FD6",
        value: 5000000000000000,
        data:
          "0x7f7465737432000000000000000000000000000000000000000000000000000000600057",
      };

      const privateKey = Buffer.from(ACCOUNT_PK, "hex");
      var tx = new Tx(txParams, { chain: "ropsten" });
      tx.sign(privateKey);

      var serializedTx = tx.serialize();

      // const common = new Common({ chain: Chain.Ropsten });
      // const tx = Transaction.fromTxData(txParams, { common });

      // const signedTx = tx.sign(privateKey);
      // const serializedTx = signedTx.serialize();

      await web3.eth
        .sendSignedTransaction("0x" + serializedTx.toString("hex"))
        .on("receipt", console.log);
    } catch (error) {
      console.log("err", error);
    }
  };
  useEffect(() => {
    console.log("inf");

    (async () => {
      try {
        const provider = new Web3.providers.WebsocketProvider(
          INFURA_ROBSTEN_URL_WSS
        );
        const web3 = new Web3(provider);
        web3.eth.net.getId().then(console.log);
        setWeb3(web3);

        const { address } = web3.eth.accounts.privateKeyToAccount(ACCOUNT_PK);
        const account = web3.eth.accounts.privateKeyToAccount(ACCOUNT_PK);
        const accountNonce =
          "0x" +
          ((await web3.eth.getTransactionCount(address)) + 1).toString(16);
        setAddressData({ accountNonce: accountNonce, address: address });

        const campaignFactory = new web3.eth.Contract(
          CampaignFactory.abi,
          CAMPAIGN_FACTORY_ADDRESS
        );

        const deployedCampaignAddress = await campaignFactory.methods
          .getDeployedCampaign()
          .call();
        const campaign = new web3.eth.Contract(
          Campaign.abi,
          deployedCampaignAddress[0]
        );
        const summary = await campaign.methods.getSummary().call();
        console.log("data", addressData, summary);
        // await campaign.methods.contribute().send({
        //   from: addressData.address,
        //   value: "100000",
        // });
        // web3.eth.getBalance(address).then(console.log);

        // web3.eth.accounts
        //   .signTransaction(
        //     {
        //       to: "0x909B197D2b6A7641EE36A18A2c7491A494191FD6",
        //       value: "1000000000",
        //       gas: 2000000,
        //       gasPrice: "234567897654321",
        //       nonce: 0,
        //       chainId: 3,
        //     },
        //     ACCOUNT_PK
        //   )
        //   .then(console.log);
        // const provider = new ethers.providers.InfuraProvider(
        //   "homestead",
        //   INFURA_PK
        // );
        // const provider = new ethers.providers.WebSocketProvider(
        //   INFURA_ROBSTEN_URL_WSS
        // );
        // const wallet = new ethers.Wallet(ACCOUNT_PK, provider);
        // // console.log("balance", await wallet.getBalance());

        // console.log("address", wallet.address);
      } catch (error) {
        console.log("error", error);
      }
    })();

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
              Welcome
            </Text>
            <Button
              text="Button"
              onPress={onClickNew}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Go to second screen"
              onPress={() => {
                navigation.navigate("SecondScreen");
              }}
              style={{
                marginTop: 10,
              }}
            />
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
