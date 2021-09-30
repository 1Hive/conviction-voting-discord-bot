import { graphqlClient } from '../apollo/client';

import {
  PROPOSAL_TITLE_QUERY,
  ACTIVE_PROPOSALS_QUERY
} from '../apollo/queries';

export const fetchProposalTitle = async (id: number): Promise<string> => {
  try {
    const result = await graphqlClient.query({
      query: PROPOSAL_TITLE_QUERY,
      variables: { number: id }
    });

    if (!result.data || !result.data.proposals.length)
      throw 'No proposals found';

    return result.data.proposals[0].metadata;
  } catch (err) {
    console.log(err);
  }
};

interface Proposal {
  convictionLast: string;
  metadata: string;
  number: string;
  requestedAmount: string;
}

export const fetchActiveProposals = async (): Promise<Proposal[]> => {
  try {
    const result = await graphqlClient.query({ query: ACTIVE_PROPOSALS_QUERY });
    if (!result.data || !result.data.proposals.length) return undefined;

    return result.data.proposals;
  } catch (err) {
    console.log(err);
  }
};
