// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IVerificationContract} from "./IVerificationContract.sol";

interface INFTBalanceOf {
    function balanceOf(address owner) external view returns (uint256);
}

contract ExampleVerificationContract is IVerificationContract {
    INFTBalanceOf public immutable nft;

    constructor(address nftAddress) {
        nft = INFTBalanceOf(nftAddress);
    }

    /**
     * @inheritdoc IVerificationContract
     */
    function verify(address caster) external view returns (bool) {
        if (nft.balanceOf(caster) > 0) {
            return true;
        } else {
            return false;
        }
    }
}
