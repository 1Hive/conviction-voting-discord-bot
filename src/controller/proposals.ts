import { Client } from 'discord.js';
import { ethers } from 'ethers';
import { config } from 'dotenv';

import { RINKEBY_CONVICTION_VOTING_CONTRACT } from '../constants';
import ConvictionVotingABI from '../abis/ConvictionVoting.json';
import { proposalAddedEmbed } from '../embed';
import { fetchProposalTitle, fetchActiveProposals } from './subgraphFetcher';
import { CronJob } from 'cron';

config();

export default async function getProposals(client: Client): Promise<void> {
  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const proposalsChannel = await guild.channels.fetch(
      process.env.PROPOSALS_CHANNEL
    );

    if (!proposalsChannel.isText())
      throw 'Proposals channel is not a text based channel';

    // Connect to contract
    const provider = ethers.providers.getDefaultProvider(process.env.PROVIDER);
    const contract = new ethers.Contract(
      RINKEBY_CONVICTION_VOTING_CONTRACT,
      ConvictionVotingABI,
      provider
    );

    // Add event listeners to contract
    contract.on(
      'ProposalAdded',
      (
        creator,
        proposalId,
        actionId,
        title,
        link,
        amount,
        isStable,
        beneficiary
      ) => {
        const decodedLink = ethers.utils.toUtf8String(link);
        const formattedAmount = Math.round(amount / 1e18);

        proposalsChannel.send({
          embeds: [
            proposalAddedEmbed(
              proposalId,
              title,
              decodedLink,
              formattedAmount,
              isStable
            )
          ]
        });
      }
    );

    contract.on('ProposalExecuted', async (id, conviction) => {
      try {
        const proposalTitle = await fetchProposalTitle(Number(id));
        proposalsChannel.send(
          `Proposal ${id} - ${proposalTitle} has been executed.`
        );
      } catch (err) {
        console.log(err);
      }
    });

    contract.on('ProposalPaused', async (id, challengeId) => {
      try {
        const proposalTitle = await fetchProposalTitle(Number(id));
        proposalsChannel.send(
          `Proposal ${id} - ${proposalTitle} has been challenged.`
        );
      } catch (err) {
        console.log(err);
      }
    });

    // Cron job to check and notify if any active proposal
    // has passed and it's ready to be executed
    const passedProposalsCheckerJob = new CronJob('0 * * * *', async () => {
      const activeProposals = await fetchActiveProposals();
      if (!activeProposals) return;

      activeProposals.forEach((proposal) => {
        if (!proposal.convictionLast) return;

        // calculate threshold for proposals here
      });
    });
    passedProposalsCheckerJob.start();

    console.log('Listeners registered to contract events.');
  } catch (err) {
    console.log(err);
  }
}
