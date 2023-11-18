// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IVerificationContract} from "./IVerificationContract.sol";

interface INFTBalanceOf {
    function balanceOf(address owner) external returns (uint256);
}

contract ExampleVerificationContract is IVerificationContract {
    INFTBalanceOf public immutable nft;

    constructor(address nftAddress) {
        nft = INFTBalanceOf(nftAddress);
    }

    /**
     * @inheritdoc IVerificationContract
     */
    function verify(address caster) external pure returns (bool) {
        if (nft.balanceOf(caster) > 0) {
            return true;
        } else {
            return false;
        }
    }
}
