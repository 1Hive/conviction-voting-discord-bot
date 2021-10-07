import { Client } from 'discord.js';
import { ethers } from 'ethers';
import { config } from 'dotenv';
import { CronJob } from 'cron';
import BigNumber from '../lib/bigNumber';

import { XDAI_CONVICTION_VOTING_CONTRACT } from '../constants';
import ConvictionVotingABI from '../abis/ConvictionVoting.json';
import { proposalAddedEmbed } from '../embed';
import {
  fetchProposalTitle,
  fetchActiveProposals,
  fetchConvictionParams
} from './subgraphFetcher';
import {
  fetchTokenTotalSupply,
  fetchCommonPoolBalance
} from './tokenInformationFetcher';

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
      XDAI_CONVICTION_VOTING_CONTRACT,
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
        console.log(`Proposal added ${proposalId} - ${title}`);
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
    // has passed and it's ready to be executed, runs every 15 minutes
    const passedProposalsCheckerJob = new CronJob('*/15 * * * *', async () => {
      const activeProposals = await fetchActiveProposals();
      const convictionParams = await fetchConvictionParams();
      const totalSupply = await fetchTokenTotalSupply();
      const commonPoolBalance = await fetchCommonPoolBalance();

      if (
        !activeProposals ||
        !convictionParams ||
        !totalSupply ||
        !commonPoolBalance
      )
        return;

      const {
        decay,
        maxRatio,
        minThresholdStakePercentage,
        pctBase,
        totalStaked,
        weight
      } = convictionParams;

      const oneBN = new BigNumber('1');
      const oneEth = new BigNumber(1e18);
      const alpha = decay.dividedBy(pctBase);

      const percentageOfTotalSupply = totalSupply
        .multipliedBy(minThresholdStakePercentage)
        .dividedBy(oneEth);

      const effectiveSupply = totalStaked.isLessThan(percentageOfTotalSupply)
        ? percentageOfTotalSupply
        : totalStaked;

      activeProposals.forEach((proposal) => {
        if (!proposal.convictionLast) return;

        const share = proposal.requestedAmount.dividedBy(commonPoolBalance);

        // Calculate threshold for proposals
        const threshold = weight
          .multipliedBy(effectiveSupply)
          .dividedBy(oneBN.minus(alpha))
          .dividedBy(maxRatio.minus(share).pow(2));

        /* Minimum amount of tokens staked in a proposal for
         * it to be able to pass after a certain time
         */
        // const minStake = alpha
        //   .negated()
        //   .multipliedBy(threshold)
        //   .plus(threshold)
        //   .dividedBy(oneEth);

        if (proposal.convictionLast.gte(threshold))
          proposalsChannel.send(
            `Proposal ${proposal.number} - ${proposal.metadata} has passed and it's ready to be executed, you can do so here https://1hive.org/#/proposal/${proposal.number}`
          );
      });
    });
    passedProposalsCheckerJob.start();

    console.log('Listeners registered to contract events.');
  } catch (err) {
    console.log(err);
  }
}
