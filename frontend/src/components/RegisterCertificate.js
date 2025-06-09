import React, { useState } from 'react';
import { ethers } from 'ethers';

function RegisterCertificate({ contract, account, isConnected }) {
  const [regStudentName, setRegStudentName] = useState('');
  const [regCourseName, setRegCourseName] = useState('');
  const [regCourseHours, setRegCourseHours] = useState('');
  const [regRealizationDate, setRegRealizationDate] = useState('');
  const [regInstitutionName, setRegInstitutionName] = useState('');
  const [generatedHash, setGeneratedHash] = useState('');
  const [registerStatus, setRegisterStatus] = useState('');

  const generateCertificateHash = () => {
    if (!regStudentName || !regCourseName || !regCourseHours || !regRealizationDate || !regInstitutionName) {
      setGeneratedHash("Preencha todos os campos para gerar o hash.");
      return "";
    }

    const dateObj = new Date(regRealizationDate);
    const unixTimestamp = Math.floor(dateObj.getTime() / 1000);

    const dataToHash = `${regStudentName}-${regCourseName}-${regCourseHours}-${unixTimestamp}-${regInstitutionName}`;
    const hash = ethers.id(dataToHash);
    setGeneratedHash(hash);
    return hash;
  };

  const handleRegisterCertificate = async (e) => {
    e.preventDefault();
    setRegisterStatus("Registrando...");
    if (!contract) {
      setRegisterStatus("Contrato não conectado. Conecte sua carteira primeiro.");
      return;
    }
    
    try {
        const contractOwner = await contract.owner();
        if (account.toLowerCase() !== contractOwner.toLowerCase()) {
            setRegisterStatus("Erro: Somente o deployer do contrato (instituição) pode registrar.");
            return;
        }
    } catch (error) {
        console.error("Erro ao verificar owner do contrato:", error);
        setRegisterStatus("Erro ao verificar permissões. Verifique a conexão com a blockchain.");
        return;
    }

    const certHash = generateCertificateHash();
    if (!certHash || certHash.includes("Preencha")) {
        setRegisterStatus("Erro: Por favor, preencha todos os campos para gerar o hash e registrar.");
        return;
    }

    const dateObj = new Date(regRealizationDate);
    const unixTimestamp = Math.floor(dateObj.getTime() / 1000);

    try {
        const tx = await contract.registerCertificate(
            regStudentName,
            regCourseName,
            Number(regCourseHours),
            unixTimestamp,
            regInstitutionName,
            certHash
        );
        await tx.wait();

        const txHashMsg = `Certificado registrado! Tx Hash: ${tx.hash}.`;
        setRegisterStatus(txHashMsg);
        
        setRegStudentName('');
        setRegCourseName('');
        setRegCourseHours('');
        setRegRealizationDate('');
        setRegInstitutionName('');
        
        setTimeout(() => {
            setGeneratedHash('');
            setRegisterStatus('');
        }, 7000);

    } catch (error) {
        console.error("Erro ao registrar certificado:", error);
        setRegisterStatus(`Erro ao registrar: ${error.reason || error.message || String(error)}`);
    }
  };

  return (
    <div className="section-container">
      <h2>Registrar Certificado (Apenas Instituição)</h2>
      <form onSubmit={handleRegisterCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>
          Nome do Aluno:
          <input type="text" value={regStudentName} onChange={(e) => setRegStudentName(e.target.value)} required />
        </label>
        <label>
          Nome do Curso:
          <input type="text" value={regCourseName} onChange={(e) => setRegCourseName(e.target.value)} required />
        </label>
        <label>
          Carga Horária (horas):
          <input type="number" value={regCourseHours} onChange={(e) => setRegCourseHours(e.target.value)} required />
        </label>
        <label>
          Data de Realização:
          <input type="date" value={regRealizationDate} onChange={(e) => setRegRealizationDate(e.target.value)} required />
        </label>
        <label>
          Nome da Instituição:
          <input type="text" value={regInstitutionName} onChange={(e) => setRegInstitutionName(e.target.value)} required />
        </label>
        
        <button type="button" onClick={generateCertificateHash} className="generate-hash-button">
          Gerar Hash do Certificado
        </button>
        {generatedHash && (
          <p style={{ wordBreak: 'break-all', fontSize: '0.9em', color: '#333' }}>
            Hash Gerado: <strong>{generatedHash}</strong>
          </p>
        )}

        <button type="submit" disabled={!isConnected} className="register-button">
          Registrar Certificado na Blockchain
        </button>
        <p>{registerStatus}</p>
        <p style={{ fontSize: '0.8em', color: 'gray' }}>
            **Importante:** Lembre-se de salvar o **Hash Gerado**! Ele é a prova única do registro do certificado e será necessário para futuras verificações e contagem final de créditos.
        </p>
      </form>
    </div>
  );
}

export default RegisterCertificate;