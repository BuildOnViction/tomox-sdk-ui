import React from 'react';
import styled from 'styled-components';
import { Divider } from '@blueprintjs/core';
import FaqItem from './FaqItem';

class FaqPage extends React.PureComponent {
  render() {
    const { match } = this.props;

    return (
      <Container>
        <FaqItem
          question="What is WETH ? Why should I convert my TOMO to WETH for using the platform ?"
          match={match}
        >
          TOMO or TOMO is the native currency of the Tomochain blockchain. The
          native TOMO currency does not however implement the very convenient
          ERC20 token standard. WETH brings the ERC20 token standard to ether.
          When you are converting TOMO to WETH, you receive 1 WETH token for each
          TOMO you've converted. Using WETH allows decentralized applications
          such as the Tomochain decentralized exchanges to offer better
          functionality and a better user experience. You can convert your WETH
          back to ether at any time.
        </FaqItem>
        <Divider />
        <FaqItem
          question="What are the main difference between Tomochain and the 0x protocol ?"
          match={match}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam
          consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vivamus elementum massa eget nulla aliquet sagittis. Proin odio
          tortor, vulputate ut odio in, ultrices ultricies augue. Cras ornare
          ultrices lorem malesuada iaculis. Etiam sit amet libero tempor,
          pulvinar mauris sed, sollicitudin sapien.
        </FaqItem>
        <Divider />
        <FaqItem
          question="What are the main difference between Tomochain and IDEX ?"
          match={match}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam
          consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vivamus elementum massa eget nulla aliquet sagittis. Proin odio
          tortor, vulputate ut odio in, ultrices ultricies augue. Cras ornare
          ultrices lorem malesuada iaculis. Etiam sit amet libero tempor,
          pulvinar mauris sed, sollicitudin sapien.
        </FaqItem>
        <Divider />
        <FaqItem
          question="The Tomochain Platform and the Tomochain Protocol is free to use. Then what is the purpose of the Proof Token ?"
          match={match}
        >
          Nulla facilisi. Maecenas sodales nec purus eget posuere. Sed sapien
          quam, pretium a risus in, porttitor dapibus erat. Sed sit amet
          fringilla ipsum, eget iaculis augue. Integer sollicitudin tortor quis
          ultricies aliquam. Suspendisse fringilla nunc in tellus cursus, at
          placerat tellus scelerisque. Sed tempus elit a sollicitudin rhoncus.
          Nulla facilisi. Morbi nec dolor dolor. Orci varius natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus. Cras et
          aliquet lectus. Pellentesque sit amet eros nisi. Quisque ac sapien in
          sapien congue accumsan. Nullam in posuere ante. Vestibulum ante ipsum
          primis in faucibus orci luctus et ultrices posuere cubilia Curae;
          Proin lacinia leo a nibh fringilla pharetra.
        </FaqItem>
        <Divider />
        <FaqItem
          question="How is Tomochain different from a centralized exchange like Coinbase or Bitfinex ?"
          match={match}
        >
          Orci varius natoque penatibus et magnis dis parturient montes,
          nascetur ridiculus mus. Proin venenatis lectus dui, vel ultrices ante
          bibendum hendrerit. Aenean egestas feugiat dui id hendrerit. Orci
          varius natoque penatibus et magnis dis parturient montes, nascetur
          ridiculus mus. Curabitur in tellus laoreet, eleifend nunc id, viverra
          leo. Proin vulputate non dolor vel vulputate. Curabitur pretium
          lobortis felis, sit amet finibus lorem suscipit ut. Sed non mollis
          risus. Duis sagittis, mi in euismod tincidunt, nunc mauris vestibulum
          urna, at euismod est elit quis erat. Phasellus accumsan vitae neque eu
          placerat. In elementum arcu nec tellus imperdiet, eget maximus nulla
          sodales. Curabitur eu sapien eget nisl sodales fermentum.
        </FaqItem>
        <Divider />
        <FaqItem
          question="What type of digital assets and cryptocurrencies are supported by Tomochain ?"
          match={match}
        >
          Phasellus pulvinar ex id commodo imperdiet. Praesent odio nibh,
          sollicitudin sit amet faucibus id, placerat at metus. Donec vitae eros
          vitae tortor hendrerit finibus. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Quisque vitae purus dolor. uis suscipit ac
          nulla et finibus. Phasellus ac sem sed dui dictum gravida. Phasellus
          eleifend vestibulum facilisis. Integer pharetra nec enim vitae mattis.
          Duis auctor, lectus quis condimentum bibendum, nunc dolor aliquam
          massa, id bibendum orci velit quis magna. Ut volutpat nulla nunc, sed
          interdum magna condimentum non. Sed urna metus, scelerisque vitae
          consectetur a, feugiat quis magna. Donec dignissim ornare nisl, eget
          tempor risus malesuada quis.
        </FaqItem>
        <Divider />
        <FaqItem question="What are PRFT tokens (Proof Tokens) ?" match={match}>
          Proof Tokens have originally been sold during the Proofsuite ICO in
          November 2017. 1,217,000 tokens have been sold for a total value at
          the time of around ~3 million USD. PRFT Tokens are used to offer
          rewards with a staking mechanism. Although we describe some of the
          potential sources of revenues that will be sent to the reward pool, we
          plan to adapt our original vision. The currently explored options
          include rewards from transactions fees on the Tomochain Decentralized
          Exchange, % of transaction fees on the Tomochain Token Platform
          smart-contracts as well and % of transaction fees on the Cryptodollar
          stablecoin. All of the previously mentioned options are not final yet
          as we constantly looking to evolve and improve our battle plan.
        </FaqItem>
        <Divider />
        <FaqItem
          question="Do I need PRFT tokens to pay network fees ?"
          match={match}
        >
          No, contrary to a some other decentralized exchange protocols, you do
          not need PRFT tokens or any special token to trade on the
          Tomochain-DEX. The Tomochain-DEX transaction fees are paid in WETH
          (Wrapped-TOMO, mentioned above) for convenience and better
          integration with the rest of our protocol.
        </FaqItem>
        <Divider />
        <FaqItem question="How does the Tomochain-DEX work ?" match={match}>
          While the Tomochain-DEX is semi-decentralized, we have to try to
          implement a user experience that is very close to the user experience
          of centralized exchanges. The main differences is that we do not hold
          your funds. Instead you need to give our decentralized exchange
          contract allowance. Each trade needs to be approved via a
          cryptographic signature without which trades can not be settled.
        </FaqItem>
        <Divider />
        <FaqItem
          question="Is the Tomochain-DEX fully decentralized ?"
          match={match}
        >
          While the ultimate vision is to make the Tomochain-DEX completely
          decentralized, the current state of Tomochain scalabitiy does not allow
          for building such an exchange while keeping a good user experience.
          Therefore, we use an off-chain orderbook system and matching-engine
          system that allows for immediate
        </FaqItem>
        <Divider />
        <FaqItem question="How do i get Proof Tokens ?" match={match}>
          Proof tokens are currently not listed on any decentralized exchange.
          You can however get Proof Tokens on TOMOdelta or IDEX until Proof
          tokens get listen on other exchanges.
        </FaqItem>
        <Divider />
        <FaqItem
          question="How do I participate in the token sale ?"
          match={match}
        >
          The token sale is currently closed.
        </FaqItem>
        <Divider />
        <FaqItem question="Is PRFT an ERC20 Token ?" match={match}>
          Yes, PRFT is an ERC20 Token.
        </FaqItem>
        <Divider />
        <FaqItem question="Explain how the PRFT token works" match={match}>
          Phasellus pulvinar ex id commodo imperdiet. Praesent odio nibh,
          sollicitudin sit amet faucibus id, placerat at metus. Donec vitae eros
          vitae tortor hendrerit finibus. Interdum et malesuada fames ac ante
          ipsum primis in faucibus. Quisque vitae purus dolor. Duis suscipit ac
          nulla et finibus. Phasellus ac sem sed dui dictum gravida. Phasellus
          eleifend vestibulum facilisis. Integer pharetra nec enim vitae mattis.
          Duis auctor, lectus quis condimentum bibendum, nunc dolor aliquam
          massa, id bibendum orci velit quis magna. Ut volutpat nulla nunc, sed
          interdum magna condimentum non. Sed urna metus, scelerisque vitae
          consectetur a, feugiat quis magna. Donec dignissim ornare nisl, eget
          tempor risus malesuada quis.
        </FaqItem>
        <Divider />
        <FaqItem question="Can I mine PRFT tokens ?" match={match}>
          No, PRFT tokens have a fixed supply and cannot be mined.
        </FaqItem>
        <Divider />
        <FaqItem
          question="When was the PRFT token launch ? Was there a pre-sale ?"
          match={match}
        >
          The Proof token sale lasted from November 3 to December 3. The
          pre-sale occured earlier in september.
        </FaqItem>
        <Divider />
        <FaqItem
          question="Where can i find a development roadmap ?"
          match={match}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. ellentesque
          elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam
          consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vivamus elementum massa eget nulla aliquet sagittis. Proin odio
          tortor, vulputate ut odio in, ultrices ultricies augue. Cras ornare
          ultrices lorem malesuada iaculis. Etiam sit amet libero tempor,
          pulvinar mauris sed, sollicitudin sapien.
        </FaqItem>
        <Divider />
        <FaqItem question="Where is Proofsuite based ?" match={match}>
          Proofsuite is based in South Korea with remote workers all over the
          world and members of our business team constantly traveling to
          establish new relationships.
        </FaqItem>
        <Divider />
        <FaqItem question="How can I get involved ?" match={match}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam
          consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vivamus elementum massa eget nulla aliquet sagittis. Proin odio
          tortor, vulputate ut odio in, ultrices ultricies augue. Cras ornare
          ultrices lorem malesuada iaculis. Etiam sit amet libero tempor,
          pulvinar mauris sed, sollicitudin sapien.
        </FaqItem>
        <Divider />
        <FaqItem
          question="Why the name Tomochain ? What is the meaning of Tomochain ?"
          match={match}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          elementum dignissim ultricies. Fusce rhoncus ipsum tempor eros aliquam
          consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Vivamus elementum massa eget nulla aliquet sagittis. Proin odio
          tortor, vulputate ut odio in, ultrices ultricies augue. Cras ornare
          ultrices lorem malesuada iaculis. Etiam sit amet libero tempor,
          pulvinar mauris sed, sollicitudin sapien.
        </FaqItem>
      </Container>
    );
  }
}
const Container = styled.div`
  padding: 10px;
`;
export default FaqPage;
