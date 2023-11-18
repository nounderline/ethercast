// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IVerificationContract} from "./IVerificationContract.sol";
import {Address} from "@openzeppelin/utils/Address.sol";

/**
 * @notice Inspired by https://github.com/onPoster/contract/blob/main/contracts/Poster.sol
 */
contract Poster {
    address public immutable protocolFunder;

    event NewPost(address indexed user, string content, string[] indexed tags, address indexed verificationAddress);
    event NewChannel(bytes32 indexed channelID, address indexed verificationContract);
    event FundingSucceeded();
    event FundingFailed();

    /// @dev Emit this error if a channel's verification of a cast failed.
    error VerificationFailed(address verificationAddress, address caster);

    constructor(address _protocolFunder) {
        protocolFunder = _protocolFunder;
    }

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
}
