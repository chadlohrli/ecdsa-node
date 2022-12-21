import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");
  
  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer 
        setBalance={setBalance} 
        signature={signature}
        setSignature={setSignature}
        address={address}
        setAddress={setAddress} 
        recoveryBit={recoveryBit}
        setRecoveryBit={setRecoveryBit}
      />
    </div>
  );
}

export default App;
