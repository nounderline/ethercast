// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Address} from "@openzeppelin/utils/Address.sol";

contract ProtocolFunder {
    address payable immutable recipient;
    uint256 immutable rewardableMax;
    uint256 rewardToDate;

    event FundingReceived(uint256 amountFunded, uint256 rewardToDate);

    error FundingExceeded();

    constructor(address _recipient, uint256 _rewardableMax) {
        recipient = payable(_recipient);
        rewardableMax = _rewardableMax;
    }

    receive() external payable {
        uint256 currentAmountFunded = rewardToDate;

        if (currentAmountFunded >= rewardableMax) {
            revert FundingExceeded();
        }

        // using memory cache over storage for gas
        rewardToDate = currentAmountFunded + msg.value;
        emit FundingReceived(msg.value, currentAmountFunded + msg.value);
    }

    function claim() external {
        Address.sendValue(recipient, address(this).balance);
    }
}
