import React, { useState } from "react";
import { ethers } from "ethers";
import SimpleStorage_abi from "./contracts/Game_abi.json";

import classes from "./MainPage.module.css";
import IconScissor from "../../components/Icons/Scissors";
import IconHand from "../../components/Icons/Hand";
import IconStone from "../../components/Icons/Stone";
import Input from "../../components/Inputs/Input";
import Modal from "../../components/Modal/Modal";
import MetamaskIcon from "../../components/Icons/MetamaskIcon";
const SimpleStorage = () => {
  let contractAddress = "0x20C7Aa89F5Ac949A9F3268936474B0984bCaCee0";

  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Подключить кошелек");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const [option, setOptionNum] = useState(0);
  const [computerOption, setOptionCompNum] = useState(0);
  const [isModal, setModal] = React.useState(false);

  const [titleModal, settitleModal] = React.useState("");

  const [imgModal, setimgModal] = React.useState("");

  const connectWalletHandler = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangedHandler(result[0]);
          setConnButtonText("Кошелек подключен");
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else {
      console.log("Необходимо установить Metamask");
      setErrorMessage(
        "Пожалуйста установите расширение MetaMask вашем браузере для взаимодействия"
      );
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
    // console.log(contract);
  };

  const playGame = async (event) => {
    event.preventDefault();

    let param = parseInt(event.target.attributes.values.value);

    const valueBNB = document.getElementById("bidBNB").value;

    const valueWei = ethers.utils.parseUnits(valueBNB);
    console.log(valueWei);
    const options = { value: valueWei, gasLimit: 70000 };

    if (contract != null) {
      const res = await contract.playGame(param, options);
      const txReceipt = await res.wait(1);
      console.log(res);
      getResult(res);
      setModal(true);
    }
  };

  const getResult = async (res) => {
    let isWin = await contract.getResult();
    if (isWin == 2) {
      settitleModal("Поздравляю! Ты выиграл!");
      // setimgModal("images/heart.png");
      setOptionNum(option + 1);
    } else if (isWin == 0) {
      settitleModal("ХеХе! Я выиграл!");
      // setimgModal("images/clown.jpg");
      setOptionCompNum(computerOption + 1);
    }
    isWin = null;
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
          <h1>Гоу в камень, ножницы, бумага!</h1>

          <div className={classes.blockResult}>
            <h6 id="resOptionComp">
              {computerOption}
              <span className={classes.resultSpan}>Робот</span>
            </h6>
            <br />
            <h6>:</h6>
            <br />
            <h6 id="resOption">
              {option}
              <span className={classes.resultSpan}>Ты</span>
            </h6>
          </div>
          <div className={classes.blockBid}>
            <Input label="tBNB" type="number" id="bidBNB"></Input>
          </div>

          <div className={classes.blockChoice}>
            <div className={classes.choice}>
              <a href="" onClick={playGame}>
                <IconStone fill="#fff" values="0"></IconStone>
              </a>
            </div>
            <div className={classes.choice}>
              <a href="" onClick={playGame}>
                <IconScissor fill="#fff" values="1"></IconScissor>
              </a>
            </div>
            <div className={classes.choice}>
              <a href="" onClick={playGame}>
                <IconHand fill="#fff" values="2"></IconHand>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isVisible={isModal}
        // title={titleModal}
        content={<h6>{titleModal}</h6>}
        footer={<p></p>}
        onClose={() => setModal(false)}
      />
    </div>
  );
};

export default SimpleStorage;
