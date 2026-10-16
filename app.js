let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0xbE7829077987f30e4b4234bf7CCDf19Eced0CA61";;

const ABI = [
    "function owner() view returns (address)",

    // Certificate functions
    "function issueCertificate(string,string,string) returns (uint256)",,
    "function revokeCertificate(uint256)",
    "function getCertificate(uint256) view returns (uint256,string,string,string,uint256,bool)",
    "function verifyCertificate(string) view returns (bool,bool,uint256,string,string,uint256)",
    "function getTotalCertificates() view returns (uint256)"
];

const $ = (id) => document.getElementById(id);


// ===============================
// CONNECT METAMASK
// ===============================

async function connectWallet() {
    try {
        if (!window.ethereum) {
            $("walletStatus").textContent =
                "MetaMask is not installed.";
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);

        await provider.send("eth_requestAccounts", []);

        const code = await provider.getCode(CONTRACT_ADDRESS);
if (code === "0x") {
    $("walletStatus").textContent =
        `No contract at ${CONTRACT_ADDRESS} on chain ${network.chainId}. Wrong network or stale address.`;
    return;
}
        signer = await provider.getSigner();

        const address = await signer.getAddress();
        const network = await provider.getNetwork();

        contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            ABI,
            signer
        );

        $("walletStatus").textContent =
            `Connected: ${address}`;

        $("networkStatus").textContent =
            `Network Chain ID: ${network.chainId}`;

    } catch (err) {

        console.error(err);

        $("walletStatus").textContent =
            `Connection failed: ${err.shortMessage || err.message}`;
    }
}


// ===============================
// ISSUE CERTIFICATE
// ===============================

async function issueCertificate() {
    try {
        if (!contract || !signer) {
            alert("Connect MetaMask first.");
            return;
        }

        const student = $("studentName").value.trim();
        const course = $("course").value.trim();
        const hash = $("certificateHash").value.trim();

        if (!student || !course || !hash) {
            $("issueStatus").textContent =
                "Please fill all certificate fields.";
            return;
        }

        console.log("Student:", student);
        console.log("Course:", course);
        console.log("Certificate Hash:", hash);

        const tx = await contract.issueCertificate(
            hash,
            student,
            course
        );

        $("issueStatus").textContent =
            `Transaction submitted: ${tx.hash}`;

        await tx.wait();

        $("issueStatus").textContent =
            `Certificate issued successfully. Transaction: ${tx.hash}`;

    } catch (err) {
        console.error("Issue Certificate Error:", err);

        $("issueStatus").textContent =
            `Failed: ${err.shortMessage || err.reason || err.message}`;
    }
}


// ===============================
// VERIFY CERTIFICATE
// ===============================

async function verifyCertificate() {
    try {

        if (!contract) {
            alert("Connect MetaMask first.");
            return;
        }

        const hash = $("verifyHash").value.trim();

        if (!hash) {
            $("verifyResult").className = "result error";
            $("verifyResult").textContent =
                "Please enter a certificate hash.";
            return;
        }

        const result = await contract.verifyCertificate(hash);

        if (!result[0]) {

            $("verifyResult").className =
                "result error";

            $("verifyResult").textContent =
                "Certificate not found.";

            return;
        }

        $("verifyResult").className =
            result[1]
                ? "result success"
                : "result error";

        $("verifyResult").textContent =
            `Exists: ${result[0]}
Valid: ${result[1]}
Certificate ID: ${result[2]}
Student: ${result[3]}
Course: ${result[4]}
Issue timestamp: ${result[5]}`;

    } catch (err) {

        console.error("Verify Error:", err);

        $("verifyResult").className =
            "result error";

        $("verifyResult").textContent =
            `Failed: ${err.shortMessage || err.message}`;
    }
}


// ===============================
// GET CERTIFICATE
// ===============================

async function getCertificate() {
    try {

        if (!contract) {
            alert("Connect MetaMask first.");
            return;
        }

        const id = $("certificateId").value.trim();

        if (!id) {
            $("certificateResult").className =
                "result error";

            $("certificateResult").textContent =
                "Please enter certificate ID.";

            return;
        }

        const c = await contract.getCertificate(id);

        $("certificateResult").className =
            "result";

        $("certificateResult").textContent =
            `ID: ${c[0]}
Hash: ${c[1]}
Student: ${c[2]}
Course: ${c[3]}
Issue timestamp: ${c[4]}
Revoked: ${c[5]}`;

    } catch (err) {

        console.error("Get Certificate Error:", err);

        $("certificateResult").className =
            "result error";

        $("certificateResult").textContent =
            `Failed: ${err.shortMessage || err.message}`;
    }
}


// ===============================
// REVOKE CERTIFICATE
// ===============================

async function revokeCertificate() {
    try {

        if (!contract) {
            alert("Connect MetaMask first.");
            return;
        }

        const id = $("revokeId").value.trim();

        if (!id) {
            $("revokeStatus").textContent =
                "Please enter certificate ID.";
            return;
        }

        const tx = await contract.revokeCertificate(id);

        $("revokeStatus").textContent =
            `Transaction submitted: ${tx.hash}`;

        await tx.wait();

        $("revokeStatus").textContent =
            `Certificate ${id} revoked successfully.`;

    } catch (err) {

        console.error("Revoke Error:", err);

        $("revokeStatus").textContent =
            `Failed: ${err.shortMessage || err.message}`;
    }
}


// ===============================
// TOTAL CERTIFICATES
// ===============================

async function getTotal() {
    try {

        if (!contract) {
            alert("Connect MetaMask first.");
            return;
        }

        const total =
            await contract.getTotalCertificates();

        $("totalResult").textContent =
            `Total certificates: ${total}`;

    } catch (err) {

        console.error("Total Error:", err);

        $("totalResult").textContent =
            `Failed: ${err.shortMessage || err.message}`;
    }
}


// ===============================
// BUTTON EVENTS
// ===============================

$("connectBtn").onclick = connectWallet;
$("issueBtn").onclick = issueCertificate;
$("verifyBtn").onclick = verifyCertificate;
$("getBtn").onclick = getCertificate;
$("revokeBtn").onclick = revokeCertificate;
$("totalBtn").onclick = getTotal;