import React, { useState } from "react";
import { ethers } from "ethers";
import SimpleStorage_abi from "./contracts/DocSign_abi.json";
import MetamaskIcon from "../../components/Icons/MetamaskIcon";
import classes from "./MainPage.module.css";

const SimpleStorage = () => {
  let contractAddress = "0x40A345FC2c3537608F7eFEc9796Eba1806061b4d";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [dataLength, setDataLength] = useState(1);

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Wallet Connected");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const getData = async () => {
    if (contract == null) {
      return;
    }
    const txSign = await contract.signDocument();

    let isWitelist = document.getElementById("witelist");

    let addr;
    if (typeof defaultAccount == typeof "") {
      addr = defaultAccount;
    } else {
      addr = defaultAccount[0];
    }

    const isSign = contract.isSigned(addr);

    if (isSign) {
      let uid = Date.now();

      let div_ = document.createElement("div");
      div_.id = "witelist_div" + uid;
      div_.className = classes.witelist_div;
      isWitelist.appendChild(div_);
      let isWitelist_div = document.getElementById("witelist_div" + uid);
      let h6 = document.createElement("h6");
      h6.innerText = addr;
      let img = document.createElement("img");
      img.src = "images/check.png";
      img.className = classes.signed_img;

      isWitelist_div.appendChild(h6);
      isWitelist_div.appendChild(img);
      setDataLength(dataLength + 1);
    }

    const txResponse = await contract.getWhiteList();

    if (dataLength == txResponse.length) {
      let signedFinish = true;
      for (let i = 0; i < txResponse.length; i++) {
        signedFinish = contract.isSigned(txResponse[i]);
      }

      if (signedFinish) {
        let isSigned = document.getElementById("isSigned");
        let img = document.createElement("img");
        img.src = "images/check.png";
        img.className = classes.signed_img;
        isSigned.appendChild(img);
      }
    }
  };

  const accountChangedHandler = (newAccount) => {
    setDefaultAccount(newAccount);
    updateEthers();
  };

  const chainChangedHandler = () => {
    window.location.reload();
  };

  window.ethereum.on("accountsChanged", accountChangedHandler);

  window.ethereum.on("chainChanged", chainChangedHandler);

  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum, 97);
    setProvider(tempProvider);

    let tempSigner = tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = new ethers.Contract(
      contractAddress,
      SimpleStorage_abi,
      tempSigner
    );

    setContract(tempContract);
  };

  return (
    <div className={classes.Container}>
      <div className={classes.blockWallet}>
        <div className={classes.btnWallet}>
          <MetamaskIcon functionWallet={connectWalletHandler} />
          <p>{connButtonText}</p>
        </div>
        <h5> {defaultAccount}</h5>
      </div>
      <div className={classes.Main}>
        <div className={classes.blockCenter}>
          <div id="isSigned" className={classes.blockTittle}>
            <h1>Договор подписи </h1>
          </div>

          <div className={classes.blockSigner} id="witelist"></div>
          <div className={classes.blockChoice}></div>
        </div>
        <button className={classes.Button} onClick={getData}>
          Подписать
        </button>
      </div>
    </div>
  );
};

export default SimpleStorage;
