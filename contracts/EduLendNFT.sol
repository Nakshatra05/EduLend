// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";


contract MySoulToken is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    using Strings for uint256;

    uint256[] public courses;
    enum Status{ Ongoing, Completed, Defaulted}

    struct CourseInfo { 
        uint256 courseIdIndex;
        uint256 deadline;
        Status status;
    }
    mapping(uint256=>CourseInfo) private token2courseInfo;

    uint256 public penalty = 300000000;
    address public admin ;

    constructor(address _admin) ERC721("EDULEN", "EDULEN") {
        admin = _admin;
    }

    function updateAdmin(address _admin) external onlyOwner {
        admin = _admin;
    } 

    modifier onlyAdmin {
      require(msg.sender == admin);
      _;
   }

    function add_course(uint256 _courseId) internal returns(uint256) {
        for(uint i =0; i<courses.length; i++){
            if (courses[i]==_courseId){
                return i ;
            }
        }
        courses.push(_courseId);
        return courses.length-1;
    }

    function safeMint(address to, uint256 _courseId, uint256 _deadline) public onlyAdmin {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        uint256 courseInd = add_course(_courseId);
        token2courseInfo[tokenId] = CourseInfo(courseInd, _deadline, Status.Ongoing);
    }

    function setCompleted(uint256 _tokenId ) public onlyAdmin{
        token2courseInfo[_tokenId].status = Status.Completed;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        require(token2courseInfo[tokenId].status == Status.Completed, "Can burn only Completed Course Tokens");
        super._burn(tokenId);
    }
    
    function getTokenIdStatus(uint256 _tokenId) public view returns(string memory status){
        if (token2courseInfo[_tokenId].status == Status.Completed)
            status = "Completed";
        else if (token2courseInfo[_tokenId].status == Status.Ongoing && block.timestamp>token2courseInfo[_tokenId].deadline)
            status = "Defaulted";
        else
            status = "Ongoing";
    }
    
    function payPenaltyAndBurnTokens(uint256 tokenId) payable external{
        require(
            (token2courseInfo[tokenId].status == Status.Ongoing)&&(block.timestamp>token2courseInfo[tokenId].deadline),
            "Applicable only for Defaulted Course Tokens"
        );
        require(msg.value > penalty, "Incorrect penalty paid");
        super._burn(tokenId);
    }

    function generateSVG(uint256 tokenId, uint256 courseId, string memory status) internal virtual view returns (string memory svg) {

        string memory course = courseId.toString();
        string memory token = tokenId.toString();
        if (bytes(token).length == 1) token = string(abi.encodePacked('0',token));

        string memory bg = "#d083f1";
        if (token2courseInfo[tokenId].status == Status.Completed)
            bg = "#bef1af"; 
        else if (token2courseInfo[tokenId].status == Status.Ongoing && block.timestamp>token2courseInfo[tokenId].deadline)
            bg = "#f76a5a"; 

        svg =  string(abi.encodePacked(
            "<svg xmlns='http://www.w3.org/2000/svg' style='background:#0' width='300' height='250'>",
            "<rect id='header' x='0' y='0' width='350' height='48' opacity='85%' fill='#1a1a19'/>",
            "<text id='TokenId' x='80' y='25' fill='#f3bef3' style='font: 20px Copperplate;'> Edu-Lend #",token,"</text>",
            "<rect id='bg' x='0' y='50' width='100%' height='100%' opacity='85%' fill='",bg,"'>",
            "<animate attributeName='opacity' dur='5s'  values='0; 0.35; 0.50; 0.95; 1; 0.95; 0.50; 0.35; 0' repeatCount='indefinite' /> </rect>",
            "<path id='Course Border'  stroke='#000000' stroke-width='3' opacity='90%' d='M 38 80 v 30 h 250 v -30 z' fill='#ffffff'/>",
            "<text id='CourseId' x='45' y='100' style='font-family:Monospace;font-size:15'>CourseId: ",course,"</text>"
            "<path id='Course Border'  stroke='#000000' stroke-width='3' opacity='90%' d='M 38 160 v 30 h 250 v -30 z' fill='#ffffff'/>",
            "<text id='Status' x='45' y='180' style='font-family:Monospace;font-size:15'>Status: ",status,"</text>"
        ));
        svg = string(abi.encodePacked(svg,  "</svg>" ));
        return svg ;
    }


    function generateFinalMetaJson(uint256 tokenId) internal view returns (string memory){
        string memory token = tokenId.toString();
        if (bytes(token).length == 1) token = string(abi.encodePacked('0',token));
        string memory nftName = string(abi.encodePacked("Edu-Lend #", tokenId.toString())) ;

        uint256 courseId = courses[ token2courseInfo[tokenId].courseIdIndex ];
        string memory status = getTokenIdStatus(tokenId);
        
        string memory finalSvg = generateSVG(tokenId, courseId, status);

        // Get all the JSON metadata in place and base64 encode it.
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        // set the title of minted NFT.
                        '{"name": "',nftName,'",',
                        ' "description": "Edu-Lend NFTs !",',
                        ' "attributes": [],',
                        ' "image": "data:image/svg+xml;base64,',
                        //add data:image/svg+xml;base64 and then append our base64 encode our svg.
                        Base64.encode(bytes(finalSvg)),
                        '"}'
                    )
                )
            )
        );

        // prepend data:application/json;base64, to our data.
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return finalTokenUri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId),"TokenId not found");
        return generateFinalMetaJson(tokenId);
        // return super.tokenURI(tokenId);
    }


    function _transfer(address from, address to, uint256 tokenId) internal virtual override(ERC721){
        revert("Non-Transferrable Tokens");
    }

    function getTokenSVG(uint256 tokenId) public view returns(string memory finalSvg){
        uint256 courseId = courses[ token2courseInfo[tokenId].courseIdIndex ];
        string memory status = getTokenIdStatus(tokenId);
        finalSvg = generateSVG(tokenId, courseId, status);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function getTimestamp() public view returns(uint256){
        return block.timestamp;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}