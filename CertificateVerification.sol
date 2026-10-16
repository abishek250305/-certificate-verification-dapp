// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Certificate Verification DApp
 * @notice Issues, verifies and revokes educational certificates on Ethereum.
 */
contract CertificateVerification {
    address public owner;
    uint256 private nextCertificateId = 1;

    struct Certificate {
        uint256 id;
        string certificateHash;
        string studentName;
        string course;
        uint256 issueDate;
        bool revoked;
    }

    mapping(uint256 => Certificate) private certificates;
    mapping(string => uint256) private hashToId;

    event CertificateIssued(
        uint256 indexed certificateId,
        string certificateHash,
        string studentName,
        string course,
        uint256 issueDate
    );

    event CertificateRevoked(uint256 indexed certificateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        string memory _certificateHash,
        string memory _studentName,
        string memory _course
    ) external onlyOwner returns (uint256) {
        require(bytes(_certificateHash).length > 0, "Certificate hash is required");
        require(bytes(_studentName).length > 0, "Student name is required");
        require(bytes(_course).length > 0, "Course is required");
        require(hashToId[_certificateHash] == 0, "Certificate already exists");

        uint256 id = nextCertificateId++;

        certificates[id] = Certificate({
            id: id,
            certificateHash: _certificateHash,
            studentName: _studentName,
            course: _course,
            issueDate: block.timestamp,
            revoked: false
        });

        hashToId[_certificateHash] = id;

        emit CertificateIssued(
            id,
            _certificateHash,
            _studentName,
            _course,
            block.timestamp
        );

        return id;
    }

    function revokeCertificate(uint256 _certificateId) external onlyOwner {
        require(_certificateId > 0 && _certificateId < nextCertificateId, "Certificate does not exist");
        require(!certificates[_certificateId].revoked, "Certificate already revoked");

        certificates[_certificateId].revoked = true;
        emit CertificateRevoked(_certificateId);
    }

    function getCertificate(uint256 _certificateId)
        external
        view
        returns (
            uint256 id,
            string memory certificateHash,
            string memory studentName,
            string memory course,
            uint256 issueDate,
            bool revoked
        )
    {
        require(_certificateId > 0 && _certificateId < nextCertificateId, "Certificate does not exist");

        Certificate memory c = certificates[_certificateId];
        return (c.id, c.certificateHash, c.studentName, c.course, c.issueDate, c.revoked);
    }

    function verifyCertificate(string memory _certificateHash)
        external
        view
        returns (
            bool exists,
            bool valid,
            uint256 certificateId,
            string memory studentName,
            string memory course,
            uint256 issueDate
        )
    {
        require(bytes(_certificateHash).length > 0, "Certificate hash is required");

        uint256 id = hashToId[_certificateHash];

        if (id == 0) {
            return (false, false, 0, "", "", 0);
        }

        Certificate memory c = certificates[id];

        return (
            true,
            !c.revoked,
            c.id,
            c.studentName,
            c.course,
            c.issueDate
        );
    }

    function getTotalCertificates() external view returns (uint256) {
        return nextCertificateId - 1;
    }
}
