// SPDX-License-Identifier: MIT

pragma solidity 0.8.19;

import { SchemaResolver } from "https://github.com/ethereum-attestation-service/eas-contracts/contracts/resolver/SchemaResolver.sol";

import { IEAS, Attestation } from "https://github.com/ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "hardhat/console.sol";

import "./GovernanceToken.sol";
import "./IEduLend.sol";

contract Resolver is SchemaResolver {
    // address private immutable _targetAttester;
    IEduLendNFT public eduLendNFT;

    address public PAYMENT_TOKEN;

    bytes32 public USER_REG_SCHEMA_ID;
    bytes32 public ORG_VALIDATION_SCHEMA_ID ;
    bytes32 public USER_ACK_SCHEMA_ID ;
    bytes32 public ORG_COMPLETION_SCHEMA_ID ;
    bytes32 public SCHEMA_ID;


    function setEduLendNFT(IEduLendNFT nft) external {
        eduLendNFT = nft;
    }

    function setSchemaIDs(bytes32[4] memory ids) external{
        USER_REG_SCHEMA_ID = ids[0];
        ORG_VALIDATION_SCHEMA_ID = ids[1];
        USER_ACK_SCHEMA_ID = ids[2];
        ORG_COMPLETION_SCHEMA_ID = ids[3];
    }

    event Debug(string,uint,uint);


    MyGovernor public governor;

    uint public TEST_AMOUNT;
                    
    constructor(IEAS eas) SchemaResolver(eas) {

    }
    struct Loan {
        address user;
        uint amount;
        uint courseID;
        address orgAddr;
        string mailID;
        string socials;
        uint proposalID;
        uint completionID;
    }

    Loan[] public loan;
    mapping(bytes32 => uint) public ledger;
    function onAttest(Attestation calldata attestation, uint256 /value/) internal  override returns (bool) {

        if (attestation.schema == USER_REG_SCHEMA_ID) {
            (uint amount,uint courseID,address orgAddr,string memory mailId,string memory socials ) = abi.decode(attestation.data,(uint,uint,address,string,string));
            
            Loan memory temp;
            
            temp.user = msg.sender;
            temp.amount =amount;
            temp.courseID =courseID;
            temp.orgAddr = orgAddr;
            temp.mailID = mailId;
            temp.socials = socials;

            loan.push(temp);

            ledger[attestation.uid] = loan.length - 1;        
        }
        else if (attestation.schema == ORG_VALIDATION_SCHEMA_ID) {
            Loan memory temp = loan[ledger[attestation.refUID]];

            //submit ppl
            // loan[ledger[attestation.refUID]].proposalID = governor.propose([PAYMENT_TOKEN],["0"],[abi.encodeWithSelector(IERC20.transfer.selector, temp.orgAddr,temp.amount)],"");
            // TODO - Mint NFT

            eduLendNFT.safeMint(temp.user,temp.courseID,block.timestamp + 1 weeks);
        }
        else if (attestation.schema == USER_ACK_SCHEMA_ID){
            (uint loanId) = abi.decode(attestation.data,(uint));
            Loan memory temp = loan[loanId];
            require(temp.user == msg.sender,"!caller");
            // Payment Success - Transfer tkns to org 
            // loan[loanId].completionID = governor.execute([PAYMENT_TOKEN],[0],[abi.encodeWithSelector(IERC20.transfer.selector, temp.orgAddr,temp.amount)]);
        }
        else if (attestation.schema == ORG_COMPLETION_SCHEMA_ID){

            eduLendNFT.setCompleted(0);

        }

        return true;

    }

    function onRevoke(Attestation calldata /attestation/, uint256 /value/) internal pure override returns (bool) {
        return true;
    }
}