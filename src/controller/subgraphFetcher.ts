import BigNumber from '../lib/bigNumber';

import { graphqlClient } from '../apollo/client';

import {
  PROPOSAL_TITLE_QUERY,
  ACTIVE_PROPOSALS_QUERY,
  CONVICTION_PARAMS_QUERY
} from '../apollo/queries';

export const fetchProposalTitle = async (id: number): Promise<string> => {
  try {
    const result = await graphqlClient.query({
      query: PROPOSAL_TITLE_QUERY,
      variables: { garden: process.env.GARDEN_ADDRESS, number: id }
    });

    if (!result.data || !result.data.proposals.length)
      throw 'No proposals found';

    return result.data.proposals[0].metadata;
  } catch (err) {
    console.log(err);
  }
};

interface Proposal {
  convictionLast: BigNumber;
  metadata: string;
  number: string;
  requestedAmount: BigNumber;
}

export const fetchActiveProposals = async (): Promise<Proposal[]> => {
  try {
    const result = await graphqlClient.query({
      query: ACTIVE_PROPOSALS_QUERY,
      variables: { garden: process.env.GARDEN_ADDRESS }
    });
    if (!result.data || !result.data.proposals.length) return undefined;

    return result.data.proposals.map((proposal) => ({
      convictionLast: new BigNumber(proposal.convictionLast),
      metadata: proposal.metadata,
      number: proposal.number,
      requestedAmount: new BigNumber(proposal.requestedAmount)
    }));
  } catch (err) {
    console.log(err);
  }
};

interface ConvictionParams {
  decay: BigNumber;
  maxRatio: BigNumber;
  minThresholdStakePercentage: BigNumber;
  pctBase: BigNumber;
  totalStaked: BigNumber;
  weight: BigNumber;
}

export const fetchConvictionParams = async (): Promise<ConvictionParams> => {
  try {
    const result = await graphqlClient.query({
      query: CONVICTION_PARAMS_QUERY,
      variables: { garden: process.env.GARDEN_ADDRESS }
    });

    if (!result.data || !result.data.organization) return undefined;

    const convictionParams = result.data.organization.config.conviction;

    return {
      decay: new BigNumber(convictionParams.decay),
      maxRatio: new BigNumber(convictionParams.maxRatio).dividedBy(
        new BigNumber(convictionParams.pctBase)
      ),
      minThresholdStakePercentage: new BigNumber(
        convictionParams.minThresholdStakePercentage
      ),
      pctBase: new BigNumber(convictionParams.pctBase),
      totalStaked: new BigNumber(convictionParams.totalStaked),
      weight: new BigNumber(convictionParams.weight).dividedBy(
        new BigNumber(convictionParams.pctBase)
      )
    };
  } catch (err) {
    console.log(err);
  }
};
