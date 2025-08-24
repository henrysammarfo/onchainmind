// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @title AIIdentity
 * @dev ERC721 NFT representing an AI Twin for each user
 * Each AI Twin learns from wallet activity and on-chain behavior
 */
contract AIIdentity is ERC721, Ownable {
    uint256 private _tokenIds;
    
    // Mapping from user address to token ID
    mapping(address => uint256) public userToTokenId;
    
    // Mapping from token ID to user address
    mapping(uint256 => address) public tokenIdToUser;
    
    // AI Twin metadata structure
    struct AITwinData {
        string name;
        string personality;
        uint256 reputation;
        uint256 createdAt;
        uint256 lastInteraction;
        string[] traits;
        uint256[] activityScores;
    }
    
    // Mapping from token ID to AI Twin data
    mapping(uint256 => AITwinData) public aiTwinData;
    
    // Events
    event AITwinMinted(address indexed user, uint256 indexed tokenId, string name);
    event AITwinUpdated(uint256 indexed tokenId, string name, string personality);
    event ReputationUpdated(uint256 indexed tokenId, uint256 newReputation);
    
    constructor() ERC721("OnchainMind AI Twin", "AITWIN") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new AI Twin NFT for a user
     * @param user The address of the user
     * @param name The name of the AI Twin
     * @param personality The personality description
     * @param traits Array of personality traits
     */
    function mintAITwin(
        address user,
        string memory name,
        string memory personality,
        string[] memory traits
    ) external onlyOwner returns (uint256) {
        require(user != address(0), "Invalid user address");
        require(userToTokenId[user] == 0, "User already has an AI Twin");
        require(bytes(name).length > 0, "Name cannot be empty");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(user, newTokenId);
        
        // Set up AI Twin data
        userToTokenId[user] = newTokenId;
        tokenIdToUser[newTokenId] = user;
        
        aiTwinData[newTokenId] = AITwinData({
            name: name,
            personality: personality,
            reputation: 100, // Starting reputation
            createdAt: block.timestamp,
            lastInteraction: block.timestamp,
            traits: traits,
            activityScores: new uint256[](0)
        });
        
        emit AITwinMinted(user, newTokenId, name);
        return newTokenId;
    }
    
    /**
     * @dev Update AI Twin metadata
     * @param tokenId The token ID to update
     * @param name New name
     * @param personality New personality
     * @param traits New traits array
     */
    function updateAITwin(
        uint256 tokenId,
        string memory name,
        string memory personality,
        string[] memory traits
    ) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender || msg.sender == owner(), "Not authorized");
        
        aiTwinData[tokenId].name = name;
        aiTwinData[tokenId].personality = personality;
        aiTwinData[tokenId].traits = traits;
        
        emit AITwinUpdated(tokenId, name, personality);
    }
    
    /**
     * @dev Update reputation score for an AI Twin
     * @param tokenId The token ID
     * @param newReputation The new reputation score
     */
    function updateReputation(uint256 tokenId, uint256 newReputation) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        aiTwinData[tokenId].reputation = newReputation;
        aiTwinData[tokenId].lastInteraction = block.timestamp;
        
        emit ReputationUpdated(tokenId, newReputation);
    }
    
    /**
     * @dev Add activity score for an AI Twin
     * @param tokenId The token ID
     * @param score The activity score to add
     */
    function addActivityScore(uint256 tokenId, uint256 score) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        
        aiTwinData[tokenId].activityScores.push(score);
        aiTwinData[tokenId].lastInteraction = block.timestamp;
    }
    
    /**
     * @dev Get AI Twin data
     * @param tokenId The token ID
     * @return AI Twin data structure
     */
    function getAITwinData(uint256 tokenId) external view returns (AITwinData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return aiTwinData[tokenId];
    }
    
    /**
     * @dev Get user's AI Twin token ID
     * @param user The user address
     * @return The token ID of the user's AI Twin
     */
    function getUserAITwinId(address user) external view returns (uint256) {
        return userToTokenId[user];
    }
    
    /**
     * @dev Check if user has an AI Twin
     * @param user The user address
     * @return True if user has an AI Twin
     */
    function hasAITwin(address user) external view returns (bool) {
        return userToTokenId[user] != 0;
    }
    
    /**
     * @dev Get total supply of AI Twins
     * @return Total number of AI Twins minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
    
    // Override required functions
    function _baseURI() internal pure override returns (string memory) {
        return "https://onchainmind.com/api/ai-twin/";
    }
}
