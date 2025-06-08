// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;     // <--- Versão atualizada para corrigir o Warning 2

contract CertificateRegistry {
    // Estrutura para armazenar os detalhes de um certificado
    struct Certificate {
        string studentName;
        string courseName;
        uint256 courseHours;        // Duração do curso em horas
        uint256 realizationDate;    // Data de realização (timestamp)
        string institutionName;     // Nome da instituição
        bytes32 certificateHash;    // Hash do documento PDF, por exemplo
        uint256 issueDate;          // Data/hora que o certificado foi REGISTRADO na blockchain
        address institutionAddress; // Endereço da instituição que emitiu (owner do contrato)
        bool exists;                // Para verificar se a entrada existe
    }

    // Mapeamento de um hash de certificado para os detalhes do certificado
    mapping(bytes32 => Certificate) public certificates;

    // Evento que será emitido quando um novo certificado for registrado
    event CertificateRegistered(
        bytes32 indexed certificateHash,
        string studentName,
        string courseName,
        uint256 courseHours,
        uint256 realizationDate,
        string institutionName,
        uint256 issueDate,
        address institutionAddress
    );

    // Endereço do deployer, assumido como a instituição inicial
    address public owner;

    // Constructor: define quem é a instituição no momento do deploy
    constructor() {
        owner = msg.sender;
    }

    // Modificador para garantir que apenas o "owner" possa chamar certas funções
    modifier onlyOwner() {
        require(msg.sender == owner, "Somente a instituicao pode realizar esta acao.");
        _;
    }

    // Função para registrar um novo certificado com os novos campos
    function registerCertificate(
        string memory _studentName,
        string memory _courseName,
        uint256 _courseHours,
        uint256 _realizationDate, // Recebe a data como timestamp
        string memory _institutionName,
        bytes32 _certificateHash // Este hash será gerado no frontend com base nos dados
    ) public onlyOwner {
        require(_certificateHash != 0, "Hash do certificado nao pode ser zero.");
        require(!certificates[_certificateHash].exists, "Certificado com este hash ja existe.");
        require(bytes(_institutionName).length > 0, "Nome da instituicao nao pode ser vazio.");
        require(bytes(_studentName).length > 0, "Nome do aluno nao pode ser vazio.");
        require(bytes(_courseName).length > 0, "Nome do curso nao pode ser vazio.");
        require(_courseHours > 0, "Carga horaria deve ser maior que zero.");
        require(_realizationDate > 0, "Data de realizacao nao pode ser zero.");


        certificates[_certificateHash] = Certificate({
            studentName: _studentName,
            courseName: _courseName,
            courseHours: _courseHours,
            realizationDate: _realizationDate,
            institutionName: _institutionName,
            certificateHash: _certificateHash,
            issueDate: block.timestamp,
            institutionAddress: msg.sender,
            exists: true
        });

        emit CertificateRegistered(
            _certificateHash,
            _studentName,
            _courseName,
            _courseHours,
            _realizationDate,
            _institutionName,
            block.timestamp,
            msg.sender
        );
    }

    // Função para verificar um certificado com os novos campos de retorno
    function verifyCertificate(
        bytes32 _certificateHash
    ) public view returns (
        string memory studentName,
        string memory courseName,
        uint256 courseHours,
        uint256 realizationDate,
        string memory institutionName,
        uint256 issueDate,
        address institutionAddress,
        bool found
    ) {
        Certificate storage cert = certificates[_certificateHash];
        if (cert.exists) {
            return (
                cert.studentName,
                cert.courseName,
                cert.courseHours,
                cert.realizationDate,
                cert.institutionName,
                cert.issueDate,
                cert.institutionAddress,
                true
            );
        } else {
            return ("", "", 0, 0, "", 0, address(0), false);
        }
    }
}