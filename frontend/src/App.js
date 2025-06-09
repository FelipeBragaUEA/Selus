import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import RegisterCertificate from './components/RegisterCertificate';
import VerifyCertificate from './components/VerifyCertificate';

const CONTRACT_ADDRESS = "0xedc8D9bDeC42DE7BcDC0E1eE69fF22A4bFdCC6Dd"; 

const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "courseHours",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "realizationDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "institutionName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "institutionAddress",
        "type": "address"
      }
    ],
    "name": "CertificateRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_studentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_courseName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "_courseHours",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_realizationDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_institutionName",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "_certificateHash",
        "type": "bytes32"
      }
    ],
    "name": "registerCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "certificates",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "courseHours",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "realizationDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "institutionName",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "certificateHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "institutionAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_certificateHash",
        "type": "bytes32"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "courseName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "courseHours",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "realizationDate",
        "type": "uint224"
      },
      {
        "internalType": "string",
        "name": "institutionName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "issueDate",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "institutionAddress",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "found",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {
  // eslint-disable-next-line no-unused-vars
  const [provider, setProvider] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [isConnected, setIsConnected] = useState(false);

  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setIsConnected(false);
      setAccount(undefined);
      setContract(undefined);
      setProvider(undefined);
    }
  }, []);

  const handleChainChanged = () => {
    window.location.reload(); 
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [handleAccountsChanged]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const tempProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(tempProvider);

        const accounts = await tempProvider.send("eth_requestAccounts", []);
        const tempSigner = await tempProvider.getSigner(); 
        setAccount(accounts[0]);
        setIsConnected(true);

        const registryContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          tempSigner
        );
        setContract(registryContract);

      } catch (error) {
        console.error("Erro ao conectar carteira:", error);
        alert("Erro ao conectar carteira. Certifique-se de que o MetaMask está desbloqueado e na rede Sepolia.");
      }
    } else {
      alert('Por favor, instale o MetaMask!');
    }
  };

  return (
    <Router>
      <div className="app-container"> 
        <h1>Sistema de Registro de Certificados Blockchain</h1>

        <nav>
          <Link to="/register">Registrar Certificado</Link>
          <Link to="/verify">Verificar Certificado</Link>
        </nav>

        {!isConnected ? (
          <button onClick={connectWallet} className="connect-wallet-button">Conectar Carteira (MetaMask)</button>
        ) : (
          <div className="section-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p>Conectado como: <strong>{account}</strong></p>
          </div>
        )}

        <Routes>
          <Route 
            path="/register" 
            element={
              <RegisterCertificate 
                contract={contract} 
                account={account} 
                isConnected={isConnected} 
              />
            } 
          />
          <Route 
            path="/verify" 
            element={
              <VerifyCertificate 
                contract={contract} 
                isConnected={isConnected} 
              />
            } 
          />
          <Route path="/" element={<Home />} /> 
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="section-container" style={{ textAlign: 'center' }}>
      <h2>Bem-vindo ao Sistema de Registro de Certificados!</h2>
      <p>Utilize a navegação acima para registrar ou verificar certificados na blockchain Sepolia.</p>
    </div>
  );
}

export default App;