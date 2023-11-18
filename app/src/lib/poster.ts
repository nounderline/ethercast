import { parseAbi } from 'viem';

const PosterABI = parseAbi([
	`function cast(string calldata content, string[] calldata tags, address verificationContract) public payable`,
	`event NewPost(address indexed user, string content, string[] indexed tags, address indexed verificationAddress)`
]);
