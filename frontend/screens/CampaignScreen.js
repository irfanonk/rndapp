import React, { useEffect, useState, useContext } from "react";
import { Alert, Modal, StyleSheet, Pressable, View } from "react-native";

import {
  Layout,
  TopNav,
  Text,
  TextInput,
  themeColor,
  useTheme,
  Section,
  SectionContent,
  Button,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";

import {
  INFURA_ROBSTEN_URL_WSS,
  INFURA_ROBSTEN_URL,
  CAMPAIGN_FACTORY_ADDRESS,
} from "@env";
import campaignFactory from "../../eth/scripts/campaignFactory";
import Campaign from "../../eth/scripts/campaign";
import web3 from "../../web3/web3";
import { WalletContext } from "../context/wallet";
const Tx = require("ethereumjs-tx").Transaction;

export default function ({ navigation }) {
  const { isDarkmode } = useTheme();
  const {
    state: { address, pk },
  } = useContext(WalletContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [deployedCampaigns, setDeployedCampaign] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  useEffect(() => {
    console.log("cmpaigns");
    (async () => {
      const deployedCampaignAddress = await campaignFactory.methods
        .getDeployedCampaign()
        .call();

      console.log("deployedCampaignAddress", deployedCampaignAddress);
      let campaigns = [];
      deployedCampaignAddress.forEach(async (address, i) => {
        const campaign = Campaign(address);

        let summary = await campaign.methods.getSummary().call();
        let campaignData = {
          address: address,
          name: summary[0],
          description: summary[1],
          minimunContribution: summary[2],
          balance: summary[3],
          requestsCount: summary[4],
          approversCount: summary[5],
          manager: summary[6],
        };
        campaigns.push(campaignData);
        if (deployedCampaignAddress.length == campaigns.length) {
          // console.log("completed");
          setDeployedCampaign(campaigns);
        }
      });
    })();

    return () => {};
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      minimunContribution: 0,
    },
  });

  const onContribute = async (data) => {
    console.log(
      "contribute",
      data.minimunContribution,
      selectedCampaign.address
    );
    var { minimunContribution } = data;
    var campaignAdress = selectedCampaign.address;
    try {
      var campaign = Campaign(campaignAdress);
      var latestBlock = await web3.eth.getBlock("latest", false);
      var _gasLimit = latestBlock.gasLimit;
      var _hex_gasLimit = web3.utils.toHex((_gasLimit + 1000000).toString());
      var _gasPrice = await web3.eth.getGasPrice();
      var _hex_gasPrice = web3.utils.toHex(_gasPrice.toString());
      var _hex_value = web3.utils.toHex(minimunContribution.toString());
      var _hex_Gas = web3.utils.toHex("60000");
      var nonce = await web3.eth.getTransactionCount(address);
      var _hex_nonce = web3.utils.toHex(nonce);

      const privateKey = Buffer.from(pk, "hex");

      const rawTx = {
        nonce: _hex_nonce,
        from: address,
        to: campaignAdress,
        gasPrice: _hex_gasPrice,
        gasLimit: _hex_gasLimit,
        gas: _hex_Gas,
        value: _hex_value,
        data: campaign.methods.contribute().encodeABI(),
      };
      console.log("rawTx", rawTx);
      const tx = new Tx(rawTx, { chain: "ropsten" });
      tx.sign(privateKey);

      var serializedTx = "0x" + tx.serialize().toString("hex");
      var txHash = await web3.eth.sendSignedTransaction(
        serializedTx.toString("hex")
      );
      console.log("txHash", txHash);
      // await campaign.methods
      //   .contribute()
      //   .send({
      //     from: address,
      //     value: data.minimunContribution,
      //   })
      //   .then((res) => {
      //     console.log("res", res);
      //   });
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <Layout>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Please enter the amount you contribute to
              {selectedCampaign.name}
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
                  type="number"
                />
              )}
              name="minimunContribution"
            />
            {errors.minimunContribution && <Text>This is required.</Text>}
            <Button
              text="Send"
              rightContent={<Ionicons name="arrow-forward" size={20} />}
              status="primary"
              type="TouchableOpacity"
              onPress={handleSubmit(onContribute)}
              style={{
                marginTop: 10,
              }}
            />
            <Button
              text="Close"
              rightContent={<Ionicons name="close" size={20} />}
              status="primary"
              type="TouchableOpacity"
              onPress={() => setModalVisible(!modalVisible)}
              style={{
                marginTop: 10,
              }}
            />
          </View>
        </View>
      </Modal>
      <TopNav
        middleContent="Campaigns"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : "#191921"}
          />
        }
        leftAction={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {deployedCampaigns.length < 1 ? (
          <Text>Getting deployed campaigns' details...</Text>
        ) : (
          deployedCampaigns.map((campaign) => {
            return (
              <Section key={campaign.address}>
                <SectionContent>
                  <Text fontWeight="bold" style={{ textAlign: "center" }}>
                    Name: {campaign.name}
                  </Text>
                  <Text>Description: {campaign.description}</Text>
                  <Text>
                    Minimun Contribution : {campaign.minimunContribution}
                    {""}
                    Balance: {campaign.balance}
                  </Text>
                  <Text>
                    {campaign.requestsCount}
                    {campaign.approversCount}
                  </Text>
                  <Text>{campaign.manager}</Text>
                  <Button
                    text="Contribute"
                    rightContent={<Ionicons name="arrow-forward" size={20} />}
                    status="primary"
                    type="TouchableOpacity"
                    onPress={() => {
                      setModalVisible(true), setSelectedCampaign(campaign);
                    }}
                    style={{
                      marginTop: 10,
                    }}
                  />
                </SectionContent>
              </Section>
            );
          })
        )}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
