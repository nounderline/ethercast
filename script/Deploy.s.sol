// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {Poster} from "../src/Poster.sol";
import {ExampleVerificationContract} from "../src/ExampleVerificationContract.sol";
import {ProtocolFunder} from "../src/ProtocolFunder.sol";

contract PosterScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        uint256 fundingMax = vm.envUint("FUNDING_MAX");
        address fundingRecipient = vm.envAddress("FUNDING_RECIPIENT");

        vm.startBroadcast(deployerPrivateKey);

        ExampleVerificationContract verificationContract = new ExampleVerificationContract();
        ProtocolFunder protocolFunder = new ProtocolFunder(fundingRecipient, fundingMax);

        Poster poster = new Poster(address(protocolFunder));

        vm.stopBroadcast();

        console2.log("CONTRACT ADDRESSES");
        console2.log("ExampleVerificationContract: %s", address(verificationContract));
        console2.log("ProtocolFunder: %s", address(protocolFunder));
        console2.log("Poster: %s", address(poster));
    }
}
