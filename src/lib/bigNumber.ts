import BigNumber from 'bignumber.js';

BigNumber.config({ POW_PRECISION: 100 });

export const bigNum = (x: number, y = 18): BigNumber =>
  new BigNumber(x * 10 ** y);

export default BigNumber;
