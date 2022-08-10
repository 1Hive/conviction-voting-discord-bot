import { MessageEmbed } from 'discord.js';

export const proposalAddedEmbed = (
  proposalId: number,
  title: string,
  link: string,
  amount: number,
  isStable: boolean
): MessageEmbed => {
  return new MessageEmbed({
    color: 16769024,
    title,
    url: `https://gardens.1hive.org/#/xdai/garden/${process.env.GARDEN_ADDRESS}/proposal/${proposalId}`,
    description: `A new proposal has been created, [go vote for it here](https://gardens.1hive.org/#/xdai/garden/${process.env.GARDEN_ADDRESS}/proposal/${proposalId})`,
    fields: [
      {
        name: 'Type',
        value: amount > 0 ? 'Proposal' : 'Suggestion',
        inline: true
      },
      {
        name: 'Requested amount',
        value: `${amount} ${
          isStable ? 'xDAI' : process.env.GARDEN_REQUEST_TOKEN_SYMBOL
        }`,
        inline: true
      },
      {
        name: 'Forum post',
        value: `Find the forum post for this proposal [here](${link})`,
        inline: false
      }
    ],
    image: {
      url: 'https://i.imgur.com/E7x8s0j.png'
    },
    timestamp: new Date(),
    footer: {
      text: 'Honeypot - 1hive.org'
    }
  });
};
