// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {IVerificationContract} from "./IVerificationContract.sol";

interface INFTBalanceOf {
    function balanceOf(address owner) external view returns (uint256);
}

contract DummyVerificationContract is IVerificationContract {
    function verify(address /*caster*/ ) external view returns (bool) {
        return true;
    }
}
