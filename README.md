# Ethercast: A simple digital public utility for onchain broadcasting.

Ethercast is an onchain broadcasting utility that exemplifies an emerging class of products: digital public utilities.

## An Emerging Product Class: Digital Public Utilities

Tornado Cash is a set of autonomous smart contracts on Ethereum that help users preserve their privacy. Tornado Cash was revolutionary, but not just because of its functionality. It is an example of an emerging product category: Digital Public Utilities.

Digital Public Utilities are neutral and decentralized services, often in the form of an autonomous protocol, that preserve the rights and freedoms of online communities. As an example, Tornado Cash protected our right to privacy and freedom to trade.

These utilities have four technical characteristics:

- First off, they are non-excludable. In other words, anyone can use the service permissionlessly and without fear of censorship.
- Second, they are persistent. This means that utilities exist whether they are used or not, with a longevity dependent on their ecosystem instead of specific services within it.
- Third, they create a piece of media that is owned by the user. In the case of Tornado Cash, users are given a key they can use to claim funds. In the case of Uniswap, you get an LP NFT. This media, which we can call infrastructure media, ensures users have full agency and can easily exit the service if needed.
- Lastly, public utilities do not aim to maximize profits. The cost of using the service should eventually be equal to the operational cost, or gas in the case of an onchain protocol.

## Ethercast: Post. To. Ethereum.

In this hack, we imagined a new digital public utility to preserve our freedom of speech: Ethercast. In addition, we defined a new funding model that mirrors intellectual property rights in the USA: Self-Limited Protocol Rewards.

There are many services today that may claim they preserve freedom of speech, or can be used as a solution for it. There are a multitude of web3 social media protocols such as Lens, Farcaster, and DeSo. There are hundreds of social media applications across web2 and web3. And yet, they are increasingly complex, ironically creating a barrier to reliable communication. Other services may be simple, such as adding a message to an Ethereum transaction, but inaccessible due to lacking user-interfaces.

---

Nonetheless, these services are critical. We have the right to speak, to broadcast our beliefs into the world. And we should be able to do this regardless of our technical aptitude. We need to be able to publish verified product reviews, make community announcements, document critical events like Satoshi did in in 2008 with Bitcoin, add a comment to an onchain contract, or confirm protest event details.

Ethercast is a simple contract, contributing to the long-lasting toolkit of online speech.

Simply: “Post. To. Ethereum.”

---

However, Ethercast is not just a smart contract. It is an example of the product design framework necessary to build other public utilities.

As part of Ethercast, we have four components. Together, they demonstrate the digital public utility design blueprint. First, we have a **decentralized autonomous protocol**. In the case of Ethercast, this is an evolution of the Poster protocol ([thank you Auryn for v1!](https://ethereum-magicians.org/t/erc-3722-poster-a-ridiculously-simple-general-purpose-social-media-smart-contract/6751/14)). Second, as Auryn aptly describes in his vision, a “**stupidly simple**” **interface**. Ethercast has a simple website interface to the protocol, allowing anyone with an Ethereum address to send messages and see the feed.

These two pieces are combined with **a method for accessibility**. Ethercast has a bridge into web2: the RSS feed. Lastly, the protocol-app is coupled to **a truly fair, neutral, and non-speculative reward system**. Ethercast includes a contract allowing users to optionally donate funds to recoup the cost of creation.

## Product Component Description

1. **Poster Protocol v2:** The core messaging protocol has one function called ******cast(…)****** which allows a user to send an onchain message. The message has three components: a string, a tag array, and a verification address. The string can be any block of text. The tag, identified in the input using the @ symbol, creates an association (e.g. this comment relates to contract 0x123 or a URL such as www.test.com). The message can also be *********verified.********* Verified messages can call on a contract, created by a user, with the function “verify.” Verification can be based on any arbitrary terms. For example, the Milady ERC721 contract could have a function that verifies the commenter owns a Milady NFT. As a result, clients can specify which users can broadcast, even if anyone can broadcast directly from the Poster contract.

```jsx
/**
 * @notice Casts a message on chain.
 * @param content The main string content of the message
 * @param tags The tags associated with the message content
 * @param verificationContract The contract to use to verify the sender. address(0) if no verification.
 * @dev Can set msg.value if caster wants to fund the protocol.
 * @dev If protocol funder is full, funds will be returned to the user.
 */
function cast(string calldata content, string[] calldata tags, address verificationContract) public payable {
    // Only verify the cast if a verificationContract is specified
    if (verificationContract != address(0) && !IVerificationContract(verificationContract).verify(msg.sender)) {
        revert VerificationFailed(verificationContract, msg.sender);
    }

    if (msg.value > 0) {
        (bool success,) = protocolFunder.call{value: msg.value}("");
        if (success) {
            emit FundingSucceeded();
        } else {
            // If failed to reward protocolFunder, send ETH back to msg.sender
            Address.sendValue(payable(msg.sender), msg.value);
            emit FundingFailed();
        }
    }

    emit NewPost(msg.sender, content, tags, verificationContract);
}
```

```jsx
function verify(address caster) external view returns (bool) {
    if (nft.balanceOf(caster) > 0) {
        return true;
    } else {
        return false;
    }
}
```

1. **********Interface Application:********** The interface is a simple website where a user types in their message, sends it, and can see an chronological feed of recent messages. It uses Alchemy to query the contract’s events and shows them in the feed. In the future, the feed could be enhanced with search.
2. **********RSS Feed:********** To truly preserve our freedom of speech, our voice needs to be accessible across networked worlds. The RSS protocol is likely the simplest, most widely adopted, content distribution protocol in the world. It allows anyone, and any application, to access broadcast updates in a standardized format. The Ethercast product automatically adopts the RSS standard. However, any standard can be supported by building a different front-end application and message builder.
3. ************Limited Protocol Rewards:************ The Poster Protocol includes the ability for users to contribute towards the builders of the protocol. This reward takes the shape of an optional fee. However, the donation is designed to have a voluntary maximum, ensuring that the protocol is truly free and accessible once the initial cost of creation has been recovered. This model aligns incentives across everyone involved. Builders can add in a fair reward for their work, capped by any arbitrary variable. For example, the reward could be limited to a specific time period, usage volume, or total ETH. In parallel, the public can safely ensure they are not exploited by critical services they rely on for their rights and freedoms.

    ```jsx
    receive() external payable {
        uint256 currentAmountFunded = rewardToDate;

        if (currentAmountFunded >= rewardableMax) {
            revert FundingExceeded();
        }

        // using memory cache over storage for gas
        rewardToDate = currentAmountFunded + msg.value;
        emit FundingReceived(msg.value, currentAmountFunded + msg.value);
    ```


## In Practice

Currently, broadcasting services have gatekeepers (e.g. mandatory KYC), rely on trusted third parties in some way (e.g. central servers), are captured by regulators (e.g. TV, Radio), or aim to be profit centers (e.g. advertising monetization models).

Services that bypass these characteristics are valuable. For example, local and community radio, also known as low-power FM (LPFM) broadcasting, gained significant momentum in the late 1990s and early 2000s, advocated for more accessible and community-focused radio broadcasting. Initially, many micro-radio stations operated without licenses, leading to clashes with the Federal Communications Commission (FCC) and larger, licensed broadcasters. The FCC often shut down these unlicensed stations for operating illegally.

For us, the very online (or terminally onchain), we need the equivalent capability outside of commercial interests. Ethercast enables this, allowing anyone to:

1. Create a verified product review
2. Comment on a smart contract, NFT, or other onchain object (e.g. Spam Warning)
3. Annotate a website or content object by referencing the domain or a CID
4. Send a message, tagging specific token holders
5. Broadcast an onchain message into an RSS Feed that is relayed by social accounts (e.g. Lens, Farcaster, Yup, Threads, Twitter, Blog, etc.)
6. Comment on an EIP Submission
7. Post a calendar event details (e.g. Demonstration or Protest Information)
8. Publish terms to resolve a hack
9. Publish an announcement for your DAO
10. Document important world events
11. Declare your love onchain

## Case Study 1: DAO Proposal Updates

Nouns is an onchain community that distributes pooled funds via onchain proposals. Builders can then post updates, known as *********propdates*********, to communicate the progress of their funded work. Builders post this update via an onchain message which is trustlessly coupled to their funded proposal. These updates are then read by web2 software products, such as a regular website.

With Ethercast as a backbone, any DAO can implement a similar solution. They can add a “verify” function in their onchain proposals (e.g. confirming an address is the owner of a proposal), and then builders can provide updates on their ongoing work.

## Case Study 2: Community Curation

Folklore is a community of people who read curated articles from a diversity of blogs. These article links and descriptions are published on an RSS feed. And to validate authenticity, each RSS post contains the curator identity address (Ethereum Address). Each curator holds a specific administrative NFT and can submit the curation within a web3 signature (image below). The signature gets published to an RSS feed, combining the power of trustless verification (tokens and web3 identities) with interoperable and universal web2 protocols (RSS).

With Ethercast as a backbone, Folklore can open curation to anyone online and customize their RSS feed to listen to a variety of curators, dynamically updating the source of curation. Furthermore, since Ethercast events are emitted onchain and aren’t an ephemeral signature, Folklore’s curation will be preserved as a globally accessible onchain archive.

## Interoperability with current solutions

Ethercast’s simplicity contributes to its interoperability; current block explorers can integrate Ethercast’s broadcasts easily. For example, Interface App, can include messages tied to specific transactions. Wallets, such as Rainbow, could add an option for a user to include a message or a tag when they submit a transaction. Smart contract development tools could incorporate a standard to more easily receive user feedback.

Most importantly, the RSS Standard allows offchain and web2 tools to easily access Ethereum casts. Discord servers can add a channel that listens to broadcasts from NFT holders. Others can create a Telegram channel to listen to specific verified broadcasts of their choice.

## Roadmap Opportunities

Broadcasting may begin as a simple cast, but has become much more. Like radio and TV before, Ethercast can evolve to facilitate different forms of media (e.g. data files, video), scheduling, privacy and multi-chain broadcasting. With the flexibility of Ethereum, we could even add options for users to vary the “volume” of their message via variable payments, staking, or other reputation systems.

## In Conclusion: Tools for Freedom

Ethercast is an example of practical solutions to protect our rights and freedoms. Its core function, enabling straightforward onchain broadcasting via Ethereum. By focusing on functionality and user accessibility, Ethercast aims to contribute practically to the evolving landscape of digital communication, offering a straightforward utility amongs complex social media platforms with commercial incentives.

-----

## Credits

DevConnect Istanbul, ETHGlobal Hackathon November 2023

Team: Rafi @nounderline, Rafa @rafathebuilder, Ben @calabashsquash
