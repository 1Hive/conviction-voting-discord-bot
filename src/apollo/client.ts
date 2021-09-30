import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

const HONEYPOT_SUBGRAPH =
  'https://api.thegraph.com/subgraphs/name/1hive/disputable-honey-pot';

export const graphqlClient = new ApolloClient({
  link: new HttpLink({ uri: HONEYPOT_SUBGRAPH, fetch }),
  cache: new InMemoryCache()
});
