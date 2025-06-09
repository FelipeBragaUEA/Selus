import React, { useState } from 'react';

function VerifyCertificate({ contract, isConnected }) {
  const [verifyHash, setVerifyHash] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState('');

  const handleVerifyCertificate = async (e) => {
    e.preventDefault();
    setVerifyStatus("Verificando...");
    setVerificationResult(null);
    if (!contract) {
      setVerifyStatus("Contrato não conectado. Conecte sua carteira primeiro.");
      return;
    }
    if (!verifyHash) {
        setVerifyStatus("Por favor, insira o hash para verificar.");
        return;
    }

    try {
        const [
            studentName,
            courseName,
            courseHours,
            realizationDate,
            institutionName,
            issueDate,
            institutionAddress,
            found
        ] = await contract.verifyCertificate(verifyHash);

        if (found) {
            setVerificationResult({
                studentName,
                courseName,
                courseHours: Number(courseHours),
                realizationDate: new Date(Number(realizationDate) * 1000).toLocaleDateString(), 
                institutionName,
                issueDate: new Date(Number(issueDate) * 1000).toLocaleString(), 
                institutionAddress,
                found: true
            });
            setVerifyStatus("Certificado encontrado!");
        } else {
            setVerificationResult({ found: false });
            setVerifyStatus("Certificado não encontrado.");
        }
    } catch (error) {
        console.error("Erro ao verificar certificado:", error);
        setVerifyStatus(`Erro ao verificar: ${error.reason || error.message || String(error)}`);
        setVerificationResult(null);
    }
  };

  return (
    <div className="section-container">
      <h2>Verificar Certificado</h2>
      <form onSubmit={handleVerifyCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>
          Hash do Certificado:
          <input 
            type="text" 
            value={verifyHash} 
            onChange={(e) => setVerifyHash(e.target.value.trim())}
            placeholder="0x..." 
            required 
          />
        </label>
        <button type="submit" disabled={!isConnected} className="verify-button">
          Verificar
        </button>
        <p>{verifyStatus}</p>
      </form>

      {verificationResult && (
        <div className="verification-result">
          <h3>Resultado da Verificação:</h3>
          {verificationResult.found ? (
            <>
              <p><strong>Status:</strong> <span className="status-authentic">AUTÊNTICO</span></p>
              <p><strong>Nome do Aluno:</strong> {verificationResult.studentName}</p>
              <p><strong>Nome do Curso:</strong> {verificationResult.courseName}</p>
              <p><strong>Carga Horária:</strong> {verificationResult.courseHours} horas</p>
              <p><strong>Data de Realização:</strong> {verificationResult.realizationDate}</p>
              <p><strong>Instituição:</strong> {verificationResult.institutionName}</p>
              <p><strong>Data de Emissão (Blockchain):</strong> {verificationResult.issueDate}</p>
              <p><strong>Criador do registro (endereço):</strong> {verificationResult.institutionAddress}</p>
            </>
          ) : (
            <p><strong>Status:</strong> <span className="status-invalid">NÃO ENCONTRADO / INVÁLIDO</span></p>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyCertificate;