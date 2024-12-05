// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IEduLendNFT{

    function updateAdmin(address _admin) external;

    function safeMint(address to, uint256 _courseId, uint256 _deadline) external;

    function setCompleted(uint256 _tokenId) external;
    
    function getTokenIdStatus(uint256 _tokenId) external view returns(string memory status);
       
}