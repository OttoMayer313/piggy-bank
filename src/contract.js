const forwarderOrigin = 'http://localhost:9010'
const Web3 = require('web3')
const MetaMaskOnboarding = require('@metamask/onboarding')


const initialize = () => {
  // let ethereum;
  // Basic Actions Section
  const onboardButton = document.getElementById('connectButton')
  const acc = document.getElementById('acc')
  const networkLabel = document.getElementById('network')

  const tokenName = document.getElementById('tokeName')
  const tokenSymbol = document.getElementById('tokenSymbol')
  const tokenSupply = document.getElementById('tokenSupply')

  // Contract Deployment Section
  const deployButton = document.getElementById('deployButton')
  const verifyButton = document.getElementById('verifyButton')
  const contractStatus = document.getElementById('contractStatus')
  const tokenAddress = document.getElementById('tokenAddress')

  // Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    // Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  // We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin })

  // This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = 'Onboarding in progress'
    onboardButton.disabled = true
    // On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding()
  }

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: 'eth_requestAccounts' })
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      acc.innerText = accounts[0]
      onboardButton.disabled = true
    } catch (error) {
      console.error(error)
    }
  }

  const onboardButtonUpdate = async (accounts) => {
    acc.innerText = accounts[0]
    onboardButton.disabled = true
  }

  const MetaMaskClientCheck = async () => {
    // Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
      // If it isn't installed we ask the user to click to install it
      onboardButton.innerText = 'Click here to install MetaMask!'
      // When the button is clicked we call th is function
      onboardButton.onclick = onClickInstall
      // The button is now disabled
      onboardButton.disabled = false
    } else {
      // If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = 'Connect'
      // When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect
      // The button is now disabled
      onboardButton.disabled = false
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' })

    if (accounts[0]) {
      onboardButtonUpdate(accounts)
    }

    if (ethereum) {
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      networkLabel.innerHTML = chainIdtoName(parseInt(chainId, 16))

      ethereum.on('chainChanged', (chainId) => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload()
      })

      ethereum.on('accountsChanged', (accounts) => {
        // Handle the new accounts, or lack thereof.
        // 'accounts' will always be an array, but it can be empty.

        if (accounts.length === 0) {
          window.location.reload()
        } else {
          onboardButtonUpdate(accounts)
        }
      })

      window.web3 = new Web3(window.ethereum)
    }
  }

  // chainIdtoName is a map list to attribute each chain ID to
  // a specific chain name. A full chain id and name list can be found
  // at https://github.com/DefiLlama/chainlist/blob/main/components/chains.js

  function chainIdtoName (chainId) {
    const chainlist_map = []

    chainlist_map[1] = 'Ethereum Mainnet'
    chainlist_map[3] = 'Ropsten Testnet'
    chainlist_map[4] = 'Rinkeby Testnet'
    chainlist_map[56] = 'BSC Mainnet'
    chainlist_map[97] = 'BSC Testnet'
    chainlist_map[137] = 'Polygon Mainnet'

    return chainlist_map[chainId]
  }

  MetaMaskClientCheck()

  web3 = new Web3(window.web3.currentProvider)
  const tokenABI = [{ inputs: [{ internalType: 'string', name: 'name_', type: 'string' }, { internalType: 'string', name: 'symbol_', type: 'string' }, { internalType: 'uint8', name: 'decimals_', type: 'uint8' }, { internalType: 'uint256', name: 'totalSupply_', type: 'uint256' }], stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'owner', type: 'address' }, { indexed: true, internalType: 'address', name: 'spender', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'Approval', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, internalType: 'address', name: 'from', type: 'address' }, { indexed: true, internalType: 'address', name: 'to', type: 'address' }, { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' }], name: 'Transfer', type: 'event' }, { inputs: [], name: 'name', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'symbol', outputs: [{ internalType: 'string', name: '', type: 'string' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'decimals', outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }], stateMutability: 'view', type: 'function' }, { inputs: [], name: 'totalSupply', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'account', type: 'address' }], name: 'balanceOf', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }, { internalType: 'address', name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }], stateMutability: 'view', type: 'function' }, { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'from', type: 'address' }, { internalType: 'address', name: 'to', type: 'address' }, { internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'transferFrom', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'addedValue', type: 'uint256' }], name: 'increaseAllowance', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ internalType: 'address', name: 'spender', type: 'address' }, { internalType: 'uint256', name: 'subtractedValue', type: 'uint256' }], name: 'decreaseAllowance', outputs: [{ internalType: 'bool', name: '', type: 'bool' }], stateMutability: 'nonpayable', type: 'function' }]
  window.token = new web3.eth.Contract(tokenABI)

  deployButton.onclick = async () => {
    if (tokenSupply.value == 0) { alert('Token Supply Must be greater than zero'); return }
    contractStatus.innerHTML = 'Deploying Token'
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    await window.token
      .deploy({
        data: '0x60806040523480156200001157600080fd5b5060405162000cb138038062000cb18339810160408190526200003491620002e0565b8351620000499060039060208701906200016d565b5082516200005f9060049060208601906200016d565b506005805460ff191660ff84161790556200007b338262000085565b50505050620003ce565b6001600160a01b038216620000e05760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b8060026000828254620000f491906200036b565b90915550506001600160a01b03821660009081526020819052604081208054839290620001239084906200036b565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b8280546200017b9062000392565b90600052602060002090601f0160209004810192826200019f5760008555620001ea565b82601f10620001ba57805160ff1916838001178555620001ea565b82800160010185558215620001ea579182015b82811115620001ea578251825591602001919060010190620001cd565b50620001f8929150620001fc565b5090565b5b80821115620001f85760008155600101620001fd565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200023b57600080fd5b81516001600160401b038082111562000258576200025862000213565b604051601f8301601f19908116603f0116810190828211818310171562000283576200028362000213565b81604052838152602092508683858801011115620002a057600080fd5b600091505b83821015620002c45785820183015181830184015290820190620002a5565b83821115620002d65760008385830101525b9695505050505050565b60008060008060808587031215620002f757600080fd5b84516001600160401b03808211156200030f57600080fd5b6200031d8883890162000229565b955060208701519150808211156200033457600080fd5b50620003438782880162000229565b935050604085015160ff811681146200035b57600080fd5b6060959095015193969295505050565b600082198211156200038d57634e487b7160e01b600052601160045260246000fd5b500190565b600181811c90821680620003a757607f821691505b602082108103620003c857634e487b7160e01b600052602260045260246000fd5b50919050565b6108d380620003de6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461012957806370a082311461013c57806395d89b4114610165578063a457c2d71461016d578063a9059cbb14610180578063dd62ed3e1461019357600080fd5b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100ef57806323b872dd14610101578063313ce56714610114575b600080fd5b6100b66101cc565b6040516100c39190610711565b60405180910390f35b6100df6100da366004610782565b61025e565b60405190151581526020016100c3565b6002545b6040519081526020016100c3565b6100df61010f3660046107ac565b610276565b60055460405160ff90911681526020016100c3565b6100df610137366004610782565b61029a565b6100f361014a3660046107e8565b6001600160a01b031660009081526020819052604090205490565b6100b66102d9565b6100df61017b366004610782565b6102e8565b6100df61018e366004610782565b61037f565b6100f36101a136600461080a565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6060600380546101db9061083d565b80601f01602080910402602001604051908101604052809291908181526020018280546102079061083d565b80156102545780601f1061022957610100808354040283529160200191610254565b820191906000526020600020905b81548152906001019060200180831161023757829003601f168201915b5050505050905090565b60003361026c81858561038d565b5060019392505050565b6000336102848582856104b1565b61028f858585610543565b506001949350505050565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919061026c90829086906102d4908790610877565b61038d565b6060600480546101db9061083d565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190838110156103725760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61028f828686840361038d565b60003361026c818585610543565b6001600160a01b0383166103ef5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610369565b6001600160a01b0382166104505760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610369565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b6001600160a01b03838116600090815260016020908152604080832093861683529290522054600019811461053d57818110156105305760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610369565b61053d848484840361038d565b50505050565b6001600160a01b0383166105a75760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610369565b6001600160a01b0382166106095760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610369565b6001600160a01b038316600090815260208190526040902054818110156106815760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610369565b6001600160a01b038085166000908152602081905260408082208585039055918516815290812080548492906106b8908490610877565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161070491815260200190565b60405180910390a361053d565b600060208083528351808285015260005b8181101561073e57858101830151858201604001528201610722565b81811115610750576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b038116811461077d57600080fd5b919050565b6000806040838503121561079557600080fd5b61079e83610766565b946020939093013593505050565b6000806000606084860312156107c157600080fd5b6107ca84610766565b92506107d860208501610766565b9150604084013590509250925092565b6000602082840312156107fa57600080fd5b61080382610766565b9392505050565b6000806040838503121561081d57600080fd5b61082683610766565b915061083460208401610766565b90509250929050565b600181811c9082168061085157607f821691505b60208210810361087157634e487b7160e01b600052602260045260246000fd5b50919050565b6000821982111561089857634e487b7160e01b600052601160045260246000fd5b50019056fea26469706673582212207722a0beab06c56824317026488e054ab9e0c92b4eb00cd2a766525dfbc5e4be64736f6c634300080d0033',
        arguments: [`${tokenName.value}`, `${tokenSymbol.value}`, 18, web3.utils.toWei(`${tokenSupply.value}`, 'ether')]
      })
      .send({
        from: accounts[0],
        gas: '1200000'
      })
      .on('error', function (error) {
        console.log(error)
        contractStatus.innerHTML = 'Deployment Failed'
      })
      .on('confirmation', function (confirmationNumber, receipt) {
        if (confirmationNumber < 1) {
          console.log(confirmationNumber)
          console.log(receipt)
          contractStatus.innerHTML = 'Contract Deployed'
        }
        deployButton.disabled = true
        verifyButton.disabled = false
      })
      .then(function (newContractInstance) {
        window.token.options.address = newContractInstance.options.address
        tokenAddress.innerHTML = newContractInstance.options.address
      })
  }

}

window.addEventListener('DOMContentLoaded', initialize)
