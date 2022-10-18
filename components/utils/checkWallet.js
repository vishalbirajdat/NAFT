
const checkWallet = () => {
  if (typeof window.ethereum !== 'undefined') {
    return true;
  } else {
    return false;
  }
}

export default checkWallet;