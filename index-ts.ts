import { 
    createWalletClient, 
    custom, 
    createPublicClient,
    parseEther, 
    defineChain,
    formatEther,
    WalletClient,
    PublicClient,
    Chain,
    Address 
  } from "viem";
  import { abi, contractAddress } from "./constants-ts";

  import "viem/window";
  
  // DOM Elements
  const connectButton = document.getElementById("connectButton") as HTMLButtonElement;
  const fundButton = document.getElementById("fundButton") as HTMLButtonElement;
  const ethAmountInput = document.getElementById("ethAmount") as HTMLInputElement;
  const balanceButton = document.getElementById("balanceButton") as HTMLButtonElement;
  const withdrawButton = document.getElementById("withdrawButton") as HTMLButtonElement;
  
  // Client instances
  let walletClient: WalletClient;
  let publicClient: PublicClient;
  
  async function connect(): Promise<void> {
      if (typeof window.ethereum !== "undefined") {
          walletClient = createWalletClient({
              transport: custom(window.ethereum)
          });
          await walletClient.requestAddresses();
          connectButton.innerHTML = "Connected";
      } else {
          connectButton.innerHTML = "Install Metamask";
      }
  }
  
  async function fund(): Promise<void> {
      const ethAmount = ethAmountInput.value;
      console.log(`Funding with ${ethAmount}..`);
  
      if (typeof window.ethereum !== "undefined") {
          walletClient = createWalletClient({
              transport: custom(window.ethereum)
          });
          const [connectedAccount] = await walletClient.requestAddresses();
          const currentChain = await getCurrentChains(walletClient);
  
          publicClient = createPublicClient({
              transport: custom(window.ethereum)
          });
  
          const { request } = await publicClient.simulateContract({
              address: contractAddress as Address,
              abi: abi,
              functionName: "fund",
              account: connectedAccount,
              chain: currentChain,
              value: parseEther(ethAmount),
          });
  
          const hash = await walletClient.writeContract(request);
          console.log(hash);
      } else {
          connectButton.innerHTML = "Install Metamask";
      }
  }
  
  async function getCurrentChains(client: WalletClient): Promise<Chain> {
      const chainId = await client.getChainId();
      const currentChain = defineChain({
          id: chainId,
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
      });
  
      return currentChain;
  }
  
  async function getBalance(): Promise<void> {
      if (typeof window.ethereum !== "undefined") {
          publicClient = createPublicClient({
              transport: custom(window.ethereum)
          });
          const balance = await publicClient.getBalance({
              address: contractAddress as Address
          });
          console.log(formatEther(balance));
      }
  }
  
  async function withdraw(): Promise<void> {
      console.log(`Withdrawing funds...`);
  
      if (typeof window.ethereum !== "undefined") {
          walletClient = createWalletClient({
              transport: custom(window.ethereum)
          });
          const [connectedAccount] = await walletClient.requestAddresses();
          const currentChain = await getCurrentChains(walletClient);
  
          publicClient = createPublicClient({
              transport: custom(window.ethereum)
          });
  
          const { request } = await publicClient.simulateContract({
              address: contractAddress as Address,
              abi: abi,
              functionName: "withdraw",
              account: connectedAccount,
              chain: currentChain,
          });
  
          const hash = await walletClient.writeContract(request);
          console.log(hash);
      } else {
          connectButton.innerHTML = "Install Metamask";
      }
  }
  
  // Event Listeners
  connectButton.onclick = connect;
  fundButton.onclick = fund;
  balanceButton.onclick = getBalance;
  withdrawButton.onclick = withdraw;
