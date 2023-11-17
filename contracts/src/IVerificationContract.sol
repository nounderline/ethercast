// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IVerificationContract {
    /// @dev for now, verify only verifies the address sending message.
    function verify(address caster) external returns (bool);
}
