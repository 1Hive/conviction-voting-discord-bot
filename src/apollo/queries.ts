import gql from 'graphql-tag';

export const PROPOSAL_TITLE_QUERY = gql`
  query ProposalTitle($garden: String!, $number: BigInt!) {
    proposals(first: 1, where: { organization: $garden, number: $number }) {
      metadata
    }
  }
`;

export const ACTIVE_PROPOSALS_QUERY = gql`
  query ActiveProposals($garden: String!) {
    proposals(
      where: { organization: $garden, type: Proposal, status: Active }
    ) {
      metadata
      convictionLast
      number
      requestedAmount
    }
  }
`;

export const CONVICTION_PARAMS_QUERY = gql`
  query ConvictionParams($garden: ID!) {
    organization(id: $garden) {
      config {
        conviction {
          weight
          decay
          pctBase
          maxRatio
          minThresholdStakePercentage
          totalStaked
        }
      }
    }
  }
`;
