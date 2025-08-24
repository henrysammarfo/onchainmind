// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @title AIRegistry
 * @dev Central registry for AI Twin metadata, embeddings, and user mapping
 * Stores AI twin information and manages the ecosystem
 */
contract AIRegistry is Ownable {
    uint256 private _aiTwinCounter;
    
    // AI Twin metadata structure
    struct AITwinMetadata {
        uint256 tokenId;
        address owner;
        string name;
        string personality;
        string avatar;
        string[] traits;
        uint256 reputation;
        uint256 level;
        uint256 createdAt;
        uint256 lastUpdated;
        bool isActive;
        string[] skills;
        uint256[] activityHistory;
        string[] socialConnections;
    }
    
    // Mapping from token ID to AI Twin metadata
    mapping(uint256 => AITwinMetadata) public aiTwinRegistry;
    
    // Mapping from user address to token ID
    mapping(address => uint256) public userToAITwin;
    
    // Mapping from AI Twin name to token ID (for uniqueness)
    mapping(string => uint256) public nameToTokenId;
    
    // Array of all AI Twin token IDs
    uint256[] public allAITwins;
    
    // Events
    event AITwinRegistered(uint256 indexed tokenId, address indexed owner, string name);
    event AITwinUpdated(uint256 indexed tokenId, string name, string personality);
    event AITwinDeactivated(uint256 indexed tokenId);
    event AITwinActivated(uint256 indexed tokenId);
    event SkillAdded(uint256 indexed tokenId, string skill);
    event SocialConnectionAdded(uint256 indexed tokenId, string connection);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new AI Twin
     * @param owner The owner address
     * @param name The AI Twin name
     * @param personality The personality description
     * @param avatar The avatar URI
     * @param traits Array of personality traits
     * @param skills Array of skills
     */
    function registerAITwin(
        address owner,
        string memory name,
        string memory personality,
        string memory avatar,
        string[] memory traits,
        string[] memory skills
    ) external onlyOwner returns (uint256) {
        require(owner != address(0), "Invalid owner address");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(nameToTokenId[name] == 0, "Name already taken");
        require(userToAITwin[owner] == 0, "User already has an AI Twin");
        
        _aiTwinCounter++;
        uint256 tokenId = _aiTwinCounter;
        
        aiTwinRegistry[tokenId] = AITwinMetadata({
            tokenId: tokenId,
            owner: owner,
            name: name,
            personality: personality,
            avatar: avatar,
            traits: traits,
            reputation: 100, // Starting reputation
            level: 1, // Starting level
            createdAt: block.timestamp,
            lastUpdated: block.timestamp,
            isActive: true,
            skills: skills,
            activityHistory: new uint256[](0),
            socialConnections: new string[](0)
        });
        
        userToAITwin[owner] = tokenId;
        nameToTokenId[name] = tokenId;
        allAITwins.push(tokenId);
        
        emit AITwinRegistered(tokenId, owner, name);
        return tokenId;
    }
    
    /**
     * @dev Update AI Twin metadata
     * @param tokenId The token ID
     * @param name New name
     * @param personality New personality
     * @param avatar New avatar URI
     * @param traits New traits array
     */
    function updateAITwin(
        uint256 tokenId,
        string memory name,
        string memory personality,
        string memory avatar,
        string[] memory traits
    ) external {
        require(aiTwinRegistry[tokenId].isActive, "AI Twin not found or inactive");
        require(
            aiTwinRegistry[tokenId].owner == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        
        // Check if new name is available (if changed)
        if (keccak256(bytes(aiTwinRegistry[tokenId].name)) != keccak256(bytes(name))) {
            require(nameToTokenId[name] == 0, "Name already taken");
            nameToTokenId[aiTwinRegistry[tokenId].name] = 0; // Remove old name mapping
            nameToTokenId[name] = tokenId; // Add new name mapping
        }
        
        aiTwinRegistry[tokenId].name = name;
        aiTwinRegistry[tokenId].personality = personality;
        aiTwinRegistry[tokenId].avatar = avatar;
        aiTwinRegistry[tokenId].traits = traits;
        aiTwinRegistry[tokenId].lastUpdated = block.timestamp;
        
        emit AITwinUpdated(tokenId, name, personality);
    }
    
    /**
     * @dev Update AI Twin reputation and level
     * @param tokenId The token ID
     * @param newReputation New reputation score
     * @param newLevel New level
     */
    function updateAITwinStats(
        uint256 tokenId,
        uint256 newReputation,
        uint256 newLevel
    ) external onlyOwner {
        require(aiTwinRegistry[tokenId].isActive, "AI Twin not found or inactive");
        
        aiTwinRegistry[tokenId].reputation = newReputation;
        aiTwinRegistry[tokenId].level = newLevel;
        aiTwinRegistry[tokenId].lastUpdated = block.timestamp;
    }
    
    /**
     * @dev Add skill to AI Twin
     * @param tokenId The token ID
     * @param skill The skill to add
     */
    function addSkill(uint256 tokenId, string memory skill) external {
        require(aiTwinRegistry[tokenId].isActive, "AI Twin not found or inactive");
        require(
            aiTwinRegistry[tokenId].owner == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        require(bytes(skill).length > 0, "Skill cannot be empty");
        
        aiTwinRegistry[tokenId].skills.push(skill);
        aiTwinRegistry[tokenId].lastUpdated = block.timestamp;
        
        emit SkillAdded(tokenId, skill);
    }
    
    /**
     * @dev Add social connection to AI Twin
     * @param tokenId The token ID
     * @param connection The social connection
     */
    function addSocialConnection(uint256 tokenId, string memory connection) external {
        require(aiTwinRegistry[tokenId].isActive, "AI Twin not found or inactive");
        require(
            aiTwinRegistry[tokenId].owner == msg.sender || msg.sender == owner(),
            "Not authorized"
        );
        require(bytes(connection).length > 0, "Connection cannot be empty");
        
        aiTwinRegistry[tokenId].socialConnections.push(connection);
        aiTwinRegistry[tokenId].lastUpdated = block.timestamp;
        
        emit SocialConnectionAdded(tokenId, connection);
    }
    
    /**
     * @dev Add activity to AI Twin history
     * @param tokenId The token ID
     * @param activityScore The activity score
     */
    function addActivity(uint256 tokenId, uint256 activityScore) external onlyOwner {
        require(aiTwinRegistry[tokenId].isActive, "AI Twin not found or inactive");
        
        aiTwinRegistry[tokenId].activityHistory.push(activityScore);
        aiTwinRegistry[tokenId].lastUpdated = block.timestamp;
    }
    
    /**
     * @dev Deactivate an AI Twin
     * @param tokenId The token ID
     */
    function deactivateAITwin(uint256 tokenId) external onlyOwner {
        require(aiTwinRegistry[tokenId].isActive, "AI Twin already inactive");
        
        aiTwinRegistry[tokenId].isActive = false;
        emit AITwinDeactivated(tokenId);
    }
    
    /**
     * @dev Activate an AI Twin
     * @param tokenId The token ID
     */
    function activateAITwin(uint256 tokenId) external onlyOwner {
        require(!aiTwinRegistry[tokenId].isActive, "AI Twin already active");
        
        aiTwinRegistry[tokenId].isActive = true;
        emit AITwinActivated(tokenId);
    }
    
    /**
     * @dev Get AI Twin metadata by token ID
     * @param tokenId The token ID
     * @return The AI Twin metadata
     */
    function getAITwinMetadata(uint256 tokenId) external view returns (AITwinMetadata memory) {
        return aiTwinRegistry[tokenId];
    }
    
    /**
     * @dev Get AI Twin metadata by user address
     * @param user The user address
     * @return The AI Twin metadata
     */
    function getAITwinByUser(address user) external view returns (AITwinMetadata memory) {
        uint256 tokenId = userToAITwin[user];
        require(tokenId != 0, "User has no AI Twin");
        return aiTwinRegistry[tokenId];
    }
    
    /**
     * @dev Check if user has an AI Twin
     * @param user The user address
     * @return True if user has an AI Twin
     */
    function hasAITwin(address user) external view returns (bool) {
        return userToAITwin[user] != 0;
    }
    
    /**
     * @dev Get all AI Twin token IDs
     * @return Array of all AI Twin token IDs
     */
    function getAllAITwins() external view returns (uint256[] memory) {
        return allAITwins;
    }
    
    /**
     * @dev Get total number of AI Twins
     * @return Total count of AI Twins
     */
    function getTotalAITwins() external view returns (uint256) {
        return _aiTwinCounter;
    }
    
    /**
     * @dev Get AI Twins by trait
     * @param trait The trait to search for
     * @return Array of token IDs with the specified trait
     */
    function getAITwinsByTrait(string memory trait) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](allAITwins.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allAITwins.length; i++) {
            uint256 tokenId = allAITwins[i];
            if (aiTwinRegistry[tokenId].isActive) {
                string[] memory traits = aiTwinRegistry[tokenId].traits;
                for (uint256 j = 0; j < traits.length; j++) {
                    if (keccak256(bytes(traits[j])) == keccak256(bytes(trait))) {
                        result[count] = tokenId;
                        count++;
                        break;
                    }
                }
            }
        }
        
        // Resize array to actual count
        uint256[] memory finalResult = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
    
    /**
     * @dev Get AI Twins by skill
     * @param skill The skill to search for
     * @return Array of token IDs with the specified skill
     */
    function getAITwinsBySkill(string memory skill) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](allAITwins.length);
        uint256 count = 0;
        
        for (uint256 i = 0; i < allAITwins.length; i++) {
            uint256 tokenId = allAITwins[i];
            if (aiTwinRegistry[tokenId].isActive) {
                string[] memory skills = aiTwinRegistry[tokenId].skills;
                for (uint256 j = 0; j < skills.length; j++) {
                    if (keccak256(bytes(skills[j])) == keccak256(bytes(skill))) {
                        result[count] = tokenId;
                        count++;
                        break;
                    }
                }
            }
        }
        
        // Resize array to actual count
        uint256[] memory finalResult = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            finalResult[i] = result[i];
        }
        
        return finalResult;
    }
}
