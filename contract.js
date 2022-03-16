const forwarderOrigin = 'http://localhost:9010';
const Web3 = require('web3');
const MetaMaskOnboarding = require('@metamask/onboarding');


const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById('connectButton');
  const chainIdlabel = document.getElementById('chainId');
  const networkLabel = document.getElementById('network');

  //Contract Deployment Section
  const deployButton = document.getElementById('deployButton');
  const contractInputData = document.getElementById('deployedContractAddress');
  const setContractButton = document.getElementById('setContractButton');
  const depositButton = document.getElementById('depositButton');
  const withdrawButton = document.getElementById('withdrawButton');
  const contractStatus = document.getElementById('contractStatus');

  

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress';
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      onboardButton.innerText = accounts[0];
      onboardButton.disabled = true;
    } catch (error) {
      console.error(error);
    }
  };

  const onboardButtonUpdate = async (accounts) => {
    onboardButton.innerText = accounts[0];
    onboardButton.disabled = true;
  };


  const MetaMaskClientCheck = async () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!';
      //When the button is clicked we call th is function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect';
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled
      onboardButton.disabled = false;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if(accounts[0]){
      onboardButtonUpdate(accounts);
    }

    const chainId = await ethereum.request({ method: 'eth_chainId' });
    chainIdlabel.innerHTML = parseInt(chainId, 16);
    networkLabel.innerHTML = chainIdtoName(parseInt(chainId, 16));

    ethereum.on('chainChanged', (chainId) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    });
    window.web3 = new Web3(window.ethereum);
  };

  
  ethereum.on('accountsChanged', (accounts) => {
    // Handle the new accounts, or lack thereof.
    // 'accounts' will always be an array, but it can be empty.

      if (accounts.length === 0){
        window.location.reload();
      } else {
        onboardButtonUpdate(accounts);
      }  
  });

    // chainIdtoName is a map list to attribute each chain ID to 
    // a specific chain name. A full chain id and name list can be found
    // at https://github.com/DefiLlama/chainlist/blob/main/components/chains.js

  function chainIdtoName(chainId) {
      var chainlist_map = [];
  
      chainlist_map[1] = "Ethereum Mainnet";
      chainlist_map[3] = "Ropsten Testnet";
      chainlist_map[56] = "BSC Mainnet";
      chainlist_map[97] = "BSC Testnet";
      chainlist_map[137] = "Polygon Mainnet";
  
      return chainlist_map[chainId];
  
  };

  chainIdtoName(chainId);


  MetaMaskClientCheck();

  web3 = new Web3(window.web3.currentProvider);
  window.contract = new web3.eth.Contract([{ 'constant': false, 'inputs': [{ 'name': 'withdrawAmount', 'type': 'uint256' }], 'name': 'withdraw', 'outputs': [{ 'name': 'remainingBal', 'type': 'uint256' }], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'function' }, { 'constant': true, 'inputs': [], 'name': 'owner', 'outputs': [{ 'name': '', 'type': 'address' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'constant': false, 'inputs': [], 'name': 'deposit', 'outputs': [{ 'name': '', 'type': 'uint256' }], 'payable': true, 'stateMutability': 'payable', 'type': 'function' }, { 'inputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }])
    
    deployButton.onclick = async () => {
      contractStatus.innerHTML = 'Deploying';
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      await window.contract.deploy(
        {
          data: '0x608060405234801561001057600080fd5b5033600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000808190555061023b806100686000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632e1a7d4d1461005c5780638da5cb5b1461009d578063d0e30db0146100f4575b600080fd5b34801561006857600080fd5b5061008760048036038101908080359060200190929190505050610112565b6040518082815260200191505060405180910390f35b3480156100a957600080fd5b506100b26101d0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100fc6101f6565b6040518082815260200191505060405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561017057600080fd5b8160008082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051600060405180830381858888f193505050501580156101c5573d6000803e3d6000fd5b506000549050919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60003460008082825401925050819055506000549050905600a165627a7a72305820f237db3ec816a52589d82512117bc85bc08d3537683ffeff9059108caf3e5d400029',
        }).send({
          from: accounts[0],
          gas: '1700000',})
          .on('error', function(error){
            console.log(error) 
            contractStatus.innerHTML = 'Deployment Failed'
          })
          .on('confirmation', function(confirmationNumber, receipt){
            if(confirmationNumber<1){
            console.log(confirmationNumber)
            console.log(receipt)
            contractStatus.innerHTML = 'Contract Deployed'
            } 
            deployButton.disabled = true
            setContractButton.disabled = true
            depositButton.disabled = false
            withdrawButton.disabled = false
          })
          .then(function(newContractInstance){
            window.contract.options.address = newContractInstance.options.address
      });

    };

    setContractButton.onclick = async () => {
      contractStatus.innerHTML = 'Setting PiggyBank Address'
      let isAddress;
      try {
        isAddress = web3.utils.toChecksumAddress(contractInputData.value)
      } catch(e) { 
        console.error('invalid ethereum address', e.message) 
        contractStatus.innerHTML = e.message
      }
      if(isAddress){
        window.contract.options.address = contractInputData.value
        deployButton.disabled = true
        setContractButton.disabled = true
        depositButton.disabled = false
        withdrawButton.disabled = false
        contractStatus.innerHTML = 'PiggyBank Address sucessfully changed!'
      }
    };

    depositButton.onclick = async () => {
      contractStatus.innerHTML = 'Depositing 0.002 ETH to PiggyBank'
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      await window.contract.methods.deposit()
      .send({from: accounts[0], value: '0x71AFD498D0000'})
      .on('error', function(error){
        console.log(error) 
        ontractStatus.innerHTML = 'Deposit Failed'
      })
      .on('confirmation', function(confirmationNumber, receipt){
        if(confirmationNumber<1){
        console.log(confirmationNumber)
        console.log(receipt)
        contractStatus.innerHTML = 'Deposit Sucessful'
        }
      }).then(function(receipt){
        console.log(receipt)
      })
    };

    withdrawButton.onclick = async () => {
      contractStatus.innerHTML = 'Withdrawing 0.002 ETH from PiggyBank'
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      await window.contract.methods.withdraw('0x71AFD498D0000').send({from: accounts[0]})
      .on('error', function(error){
        console.log(error) 
        ontractStatus.innerHTML = 'Withdraw Failed'
      })
      .on('confirmation', function(confirmationNumber, receipt){
        if(confirmationNumber<1){
        console.log(confirmationNumber)
        console.log(receipt)
        contractStatus.innerHTML = 'Withdraw Sucessful'
        }
      }).then(function(receipt){
        console.log(receipt)
      })
    };

};

window.addEventListener('DOMContentLoaded', initialize);
