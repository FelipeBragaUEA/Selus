// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string courseName;
        uint256 courseHours;
        uint256 realizationDate;
        string institutionName;
        bytes32 certificateHash;
        uint256 issueDate;
        address institutionAddress;
        bool exists;
    }

    mapping(bytes32 => Certificate) public certificates;

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

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Somente a instituicao pode realizar esta acao.");
        _;
    }

    function registerCertificate(
        string memory _studentName,
        string memory _courseName,
        uint256 _courseHours,
        uint256 _realizationDate,
        string memory _institutionName,
        bytes32 _certificateHash
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
