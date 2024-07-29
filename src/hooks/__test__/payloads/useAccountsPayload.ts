const payload1 = {
  hashedPassword:
    "0x5e275fae17e242926c01a96878c42e32848ab37e3bcdda430bb9f501e2f8051a",
  generatedMnemonic:
    "harsh april identify stay entry  switch again march defense plano comic end",
  walletCount: 1,
  walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
  isFirstTime: true,
};

const payload2 = {
  hashedPassword:
    "0x5e275fae17e242926c01a96878c42e32848ab37e3bcdda430bb9f501e2f8051a",
  generatedMnemonic:
    "harsh april identify stay entry  switch again march defense plano comic end",
  walletCount: 4,
  walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
  isFirstTime: false,
};

const payload3 = {
  hashedPassword:
    "0x5e275fae17e242926c01a96878c42e32848ab37e3bcdda430bb9f501e2f8051a",
  generatedMnemonic:
    "harsh april identify stay entry  switch again march defense plano comic end",
  walletCount: 4,
  walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
  isFirstTime: false,
};

const payload4 = {
  hashedPassword:
    "0x5e275fae17e242926c01a96878c42e32848ab37e3bcdda430bb9f501e2f8051a",
  generatedMnemonic:
    "harsh april identify stay entry  switch again march defense plano comic end",
  walletCount: 4,
  walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
  isFirstTime: false,
};

const fromSeed_return_value = {
  secretKey: [
    117, 29, 155, 50, 140, 67, 116, 44, 11, 185, 64, 236, 147, 3, 143, 0, 133,
    206, 114, 177, 245, 155, 177, 38, 79, 22, 133, 149, 12, 54, 122, 93, 156,
    170, 222, 3, 5, 78, 49, 156, 57, 232, 27, 96, 32, 178, 13, 46, 116, 97, 149,
    83, 148, 212, 75, 197, 93, 174, 34, 185, 167, 181, 167, 54,
  ],
};

const payload5 = {
  hashedPassword:
    "0x5e275fae17e242926c01a96878c42e32848ab37e3bcdda430bb9f501e2f8051a",
  generatedMnemonic:
    "harsh april identify stay entry  switch again march defense plano comic end",
  walletCount: 1,
  walletId: "2a6280e4-e1b0-4750-837f-28e0660470dd",
  isFirstTime: true,
};
const secretKeyArray = [
  8, 137, 35, 93, 34, 82, 217, 183, 133, 69, 14, 64, 90, 14, 219, 241, 253, 30,
  114, 153, 166, 58, 40, 64, 84, 63, 161, 6, 146, 114, 184, 164, 138, 30, 164,
  98, 143, 126, 188, 189, 221, 176, 119, 237, 38, 150, 227, 134, 138, 83, 41,
  27, 30, 172, 135, 90, 252, 46, 115, 72, 121, 253, 190, 137,
];
const fromSecretKey_return_value1 = {
  secretKey: secretKeyArray,
  publicKey: "AJAN1vu1oYaXRRHfhoZ5SE1sYBcqTabG5ZTGSH2eLrFJ",
};

const fromSecretKey_return_value2 = {
  secretKey: secretKeyArray,
  publicKey: "EzfGRY4W8VtXY3Bg65Hg7zncpXJ2Qhw6uCZNnVNFkx3Q",
};

const fromSecretKey_return_value3 = {
  secretKey: secretKeyArray,
  publicKey: "8j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
};
const fromSecretKey_return_value4 = {
  secretKey: secretKeyArray,
  publicKey: "7j49zYQn5WASDy4tZzsi2sHCSgUnywJz89d8ER4wuoti",
};

const parseSeedPhrase_return_value = {
  publicKey: "ed25519:7PXTwJskAkoB2bCYLCXGimVc9kZUk1mMDTxs83griCVN",
  secretKey:
    "ed25519:2sLTS5xayviX244811BiThyP5KHmR5NtBDSxok7wjtT4UtQAfDZEjSZCj8MowUXvGiw21Nae2i7UzysFyycRS2sJ",
};

const nearApiJs_KeyPair_fromString_return_value = {
  getPublicKey: jest
    .fn()
    .mockReturnValue(
      "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1"
    ),
};
const nearApiJs_utils_PublicKey_fromString_return_value = {
  data: "5eeb5878647747efa8d53129c85f0cfc60370049e40fc9dc2f331d51db2f58d1",
};

const privatekey =
  "2d68d7fad4a0d360b1a7ef932ca0dac960bca077316ebd4d90c7a447d7d1ec5a";
const wrong_PrivateKey =
  "2d68d7fad4a0d360b1a7ef932ca0dac960bca077316ebd4d90c7a447d7d1ec5";
const wrong_PrivateKey_Solana = "";
const privatekey2 = "";
const walletId = "2a6280e4-e1b0-4750-837f-28e0660470dd";
const EVM_Account_Import = "ACCOUNT IMPORTED EVM";
const SOLANA_Account_Import = "ACCOUNT IMPORTED SOLANA";
export {
  payload1,
  payload2,
  payload3,
  payload4,
  payload5,
  fromSeed_return_value,
  fromSecretKey_return_value1,
  fromSecretKey_return_value2,
  parseSeedPhrase_return_value,
  nearApiJs_KeyPair_fromString_return_value,
  nearApiJs_utils_PublicKey_fromString_return_value,
  privatekey,
  wrong_PrivateKey,
  walletId,
  EVM_Account_Import,
  fromSecretKey_return_value3,
  fromSecretKey_return_value4,
  SOLANA_Account_Import,
  privatekey2,
  wrong_PrivateKey_Solana,
};
