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
// import { Transaction } from "@ethereumjs/tx";

import CampaignFactory from "../../eth/build/CampaignFactory.json";
import Campaign from "../../eth/build/Campaign.json";
import Token from "../../eth/build/Token.json";

import { Buffer } from "buffer";

var Tx = require("ethereumjs-tx").Transaction;
const ethereumjs_common = require("ethereumjs-common").default;

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

  const onClickTwo = async () => {
    let toAddress = "0x053526b3bb25147be27f3cf1e3ddcd5ebfac023f";
    let value = 0.2;
    TransferERC20Token(toAddress, value).then(console.log);
  };
  async function TransferERC20Token(toAddress, value) {
    return new Promise(function (resolve, reject) {
      try {
        web3.eth.getBlock("latest", false, (error, result) => {
          var _gasLimit = result.gasLimit;
          let contract = new web3.eth.Contract(
            Token.abi,
            "0x9d5DF1fC8BeAFf148Ea440AD1f7692748dF6302d"
          );
          contract.methods
            .decimals()
            .call()
            .then(function (result) {
              try {
                console.log("result", result);
                var decimals = result;
                let amount = parseFloat(value) * Math.pow(10, decimals);
                web3.eth.getGasPrice(function (error, result) {
                  var _gasPrice = result;
                  try {
                    const Tx = require("ethereumjs-tx").Transaction;
                    const privateKey = Buffer.from(ACCOUNT_PK, "hex");

                    var _hex_gasLimit = web3.utils.toHex(
                      (_gasLimit + 1000000).toString()
                    );
                    var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());
                    var _hex_value = web3.utils.toHex(amount.toString());
                    var _hex_Gas = web3.utils.toHex("60000");

                    web3.eth
                      .getTransactionCount(addressData.address)
                      .then((nonce) => {
                        var _hex_nonce = web3.utils.toHex(nonce);
                        console.log("_hex_nonce", _hex_nonce);
                        console.log("add", toAddress, _hex_value);

                        const rawTx = {
                          nonce: _hex_nonce,
                          from: addressData.address,
                          to: "0x9d5DF1fC8BeAFf148Ea440AD1f7692748dF6302d",
                          gasPrice: _hex_gasPrice,
                          gasLimit: _hex_gasLimit,
                          gas: _hex_Gas,
                          value: "0x0",
                          data: contract.methods
                            .transfer(toAddress, _hex_value)
                            .encodeABI(),
                        };
                        const tx = new Tx(rawTx, { chain: "ropsten" });
                        tx.sign(privateKey);

                        var serializedTx =
                          "0x" + tx.serialize().toString("hex");
                        web3.eth.sendSignedTransaction(
                          serializedTx.toString("hex"),
                          function (err, hash) {
                            if (err) {
                              console.log("1");
                              reject(err);
                            } else {
                              resolve(hash);
                            }
                          }
                        );
                      });
                  } catch (error) {
                    console.log("2");

                    reject(error);
                  }
                });
              } catch (error) {
                console.log("3");

                reject(error);
              }
            });
        });
      } catch (error) {
        console.log("4");

        reject(error);
      }
    });
  }
  useEffect(() => {
    console.log("inf");

    (async () => {
      try {
        const provider = new Web3.providers.WebsocketProvider(
          INFURA_ROBSTEN_URL_WSS
        );
        const web3 = new Web3(provider);
        // web3.eth.net.getId().then(console.log);
        setWeb3(web3);

        // let value = 0.01;
        // let amount = parseFloat(value) * Math.pow(10, 18);
        // var _hex_value = web3.utils.toHex(amount.toString());

        // console.log("hex", value, amount, _hex_value);
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
        const token = new web3.eth.Contract(
          Token.abi,
          "0x9d5DF1fC8BeAFf148Ea440AD1f7692748dF6302d"
        );
        const summaryToken = await token.methods.getSummary().call();
        console.log("token", summaryToken);
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
              onPress={onClickTwo}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Campaign Contrats"
              onPress={() => {
                navigation.navigate("CampaignScreen");
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
