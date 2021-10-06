import gql from 'graphql-tag';

export const PROPOSAL_TITLE_QUERY = gql`
  query ProposalTitle($number: BigInt!) {
    proposals(first: 1, where: { number: $number }) {
      metadata
    }
  }
`;

export const ACTIVE_PROPOSALS_QUERY = gql`
  query ActiveProposals {
    proposals(where: { type: Proposal, status: Active }) {
      metadata
      convictionLast
      number
      requestedAmount
    }
  }
`;

export const CONVICTION_PARAMS_QUERY = gql`
  query ConvictionParams {
    convictionConfigs(first: 1, orderBy: id, orderDirection: desc) {
      weight
      decay
      pctBase
      maxRatio
      minThresholdStakePercentage
      totalStaked
    }
  }
`;
