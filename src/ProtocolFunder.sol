// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Address} from "@openzeppelin/utils/Address.sol";

contract ProtocolFunder {
    address payable immutable recipient;
    uint256 immutable payableMax;
    uint256 payToDate;

    event FundingReceived(uint256 amountFunded, uint256 payToDate);

    event FundingExceeded();

    constructor(address _recipient, uint256 _payableMax) {
        recipient = payable(_recipient);
        payableMax = _payableMax;
    }

    receive() external payable {
        uint256 currentAmountFunded = payToDate;

        if (currentAmountFunded >= payableMax) {
            emit FundingExceeded();
        }

        // using memory cache over storage for gas
        payToDate = currentAmountFunded + msg.value;
        emit FundingReceived(msg.value, currentAmountFunded + msg.value);
    }

    function claim() external {
        Address.sendValue(recipient, address(this).balance);
    }
}
