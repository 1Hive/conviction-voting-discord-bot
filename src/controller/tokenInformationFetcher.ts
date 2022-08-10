import fetch from 'cross-fetch';
import BigNumber from '../lib/bigNumber';

export const fetchTokenTotalSupply = async (): Promise<BigNumber> => {
  try {
    const result = await fetch(
      `https://blockscout.com/xdai/mainnet/api?module=stats&action=tokensupply&contractaddress=${process.env.GARDEN_REQUEST_TOKEN_ADDRESS}`
    );
    const data = await result.json();

    if (!data || data.status !== '1') return undefined;

    return new BigNumber(data.result);
  } catch (err) {
    console.log(err);
  }
};

export const fetchCommonPoolBalance = async (): Promise<BigNumber> => {
  try {
    const result = await fetch(
      `https://blockscout.com/xdai/mainnet/api?module=account&action=tokenbalance&contractaddress=${process.env.GARDEN_REQUEST_TOKEN_ADDRESS}&address=${process.env.GARDEN_COMMON_POOL_ADDRESS}`
    );
    const data = await result.json();

    if (!data || data.status !== '1') return undefined;

    return new BigNumber(data.result);
  } catch (err) {
    console.log(err);
  }
};
