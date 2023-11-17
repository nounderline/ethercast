// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IVerificationContract} from "./IVerificationContract.sol";

contract ExampleVerificationContract is IVerificationContract {
    /**
     * @inheritdoc IVerificationContract
     */
    function verify(address caster) external pure returns (bool) {
        if (uint256(uint160(caster)) % 2 == 0) {
            return true;
        } else {
            return false;
        }
    }
    // TODO do one for owning an NFT
}
