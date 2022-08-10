import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';
import fetch from 'cross-fetch';

const GARDENS_SUBGRAPH =
  'https://api.thegraph.com/subgraphs/name/1hive/gardens-xdai';

export const graphqlClient = new ApolloClient({
  link: new HttpLink({ uri: GARDENS_SUBGRAPH, fetch }),
  cache: new InMemoryCache()
});
