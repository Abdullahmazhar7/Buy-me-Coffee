import { createWalletClient, custom, createPublicClient,parseEther, defineChain,formatEther } from "https://esm.sh/viem";
import { abi, contractAddress } from "./constants-js.js"


const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const ethAmountInput = document.getElementById("ethAmount")
const balanceButton = document.getElementById("balanceButton")


let walletClient
let publicClient

async function connect() {
    if(typeof window.ethereum !== "undefined") {

        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses()
        connectButton.innerHTML = "Connected"

    } else {
        connectButton.innerHTML = "Install Metamask"
    }
}

async function fund(){
     const ethAmount = ethAmountInput.value
     console.log(`Funding with ${ethAmount}..`)

     if (typeof window.ethereum !== "undefined") {
        walletClient = createWalletClient({
            transport: custom(window.ethereum)
        })
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChains(walletClient)

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })

        const {request} = await publicClient.simulateContract({
            address : contractAddress,
            abi: abi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount),
        })

        const hash = await walletClient.writeContract(request)
        console.log(hash)

     } else {
        connectButton.innerHTML = "Install Metamask"
     }
}

async function getCurrentChains(client) {
    const chainid = await client.getChainId()
    const currentChain = defineChain({
        id: chainid,
        name: "Custom Chain",
        nativeCurrency: {
            name: "ETHER",
            symbol: "ETH",
            decimals: 18
        },
        rpcUrls: {
            default: {
                http: ["http://localhost:8545"]
            },
        },
    })

    return currentChain
    
}

async function getBalance(){
    if (typeof window.ethereum !== "undefined") {
        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const balance = await publicClient.getBalance({
            address: contractAddress
        })
        console.log(formatEther(balance))
    }
}

connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
