export const EthercastPosterABI = [
	{
		name: 'cast',
		type: 'function',
		stateMutability: 'payable',
		inputs: [
			{ type: 'string', name: 'content' },
			{ type: 'string[]', name: 'tags' },
			{ type: 'address', name: 'verificationContract' }
		],
		outputs: []
	},
	{
		name: 'NewPost',
		type: 'event',
		inputs: [
			{ type: 'address', name: 'user', indexed: true },
			{ type: 'string', name: 'content' },
			{ type: 'string[]', name: 'tags', indexed: true },
			{ type: 'address', name: 'verificationAddress', indexed: true }
		]
	}
];
