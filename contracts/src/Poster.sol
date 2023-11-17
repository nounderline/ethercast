// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IVerificationContract} from "./IVerificationContract.sol";
import {Address} from "@openzeppelin/utils/Address.sol";

/**
 * @notice Inspired by https://github.com/onPoster/contract/blob/main/contracts/Poster.sol
 */
contract Poster {
    // mapping(bytes32 channelID => address verificationContract) public channelToVerificationContract;
    address public immutable protocolFunder;

    event NewPost(address indexed user, string content, string[] indexed tags, address indexed verificationAddress);
    event NewChannel(bytes32 indexed channelID, address indexed verificationContract);
    event FundingSucceeded();
    event FundingFailed();

    // /// @dev Emit this error if trying to add a channel that already exists.
    // error ChannelAlreadyExists(bytes32 channelID, address verificationContract);
    // /// @dev Emit this error if trying to use a channel that does not exist.
    // error ChannelDoesNotExist(bytes32 channelID);
    /// @dev Emit this error if a channel's verification of a cast failed.
    error VerificationFailed(address verificationAddress, address caster);

    constructor(address _protocolFunder) {
        protocolFunder = _protocolFunder;
    }

    // function addChannel(bytes32 channelID, address verificationContract) external {
    //     if (channelToVerificationContract[channelID] != address(0)) {
    //         revert ChannelAlreadyExists(channelID, channelToVerificationContract[channelID]);
    //     }
    //     channelToVerificationContract[channelID] = verificationContract;
    //     emit NewChannel(channelID, verificationContract);
    // }

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
                emit FundingFailed();
            }
        }

        emit NewPost(msg.sender, content, tags, verificationContract);
    }

    // properly handle failed since this contract will own the eth in that case.
}
