// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * @title ReputationScore
 * @dev ERC20-style reputation points system for AI Twins
 * Users earn reputation through interactions, transactions, and social activities
 */
contract ReputationScore is ERC20, Ownable {
    
    // Mapping from user address to reputation data
    mapping(address => ReputationData) public userReputation;
    
    // Reputation data structure
    struct ReputationData {
        uint256 totalEarned;
        uint256 totalSpent;
        uint256 lastUpdated;
        uint256 level;
        uint256[] transactionHistory;
        string[] achievements;
    }
    
    // Reputation levels and thresholds
    uint256[] public levelThresholds;
    
    // Events
    event ReputationEarned(address indexed user, uint256 amount, string reason);
    event ReputationSpent(address indexed user, uint256 amount, string reason);
    event LevelUp(address indexed user, uint256 newLevel);
    event AchievementUnlocked(address indexed user, string achievement);
    
    constructor() ERC20("OnchainMind Reputation", "REP") Ownable(msg.sender) {
        // Initialize level thresholds
        levelThresholds = [0, 100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000];
    }
    
    /**
     * @dev Award reputation points to a user
     * @param user The user address
     * @param amount The amount of reputation to award
     * @param reason The reason for awarding reputation
     */
    function awardReputation(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        
        _mint(user, amount);
        
        ReputationData storage data = userReputation[user];
        data.totalEarned += amount;
        data.lastUpdated = block.timestamp;
        data.transactionHistory.push(amount);
        
        // Check for level up
        uint256 newLevel = calculateLevel(balanceOf(user));
        if (newLevel > data.level) {
            data.level = newLevel;
            emit LevelUp(user, newLevel);
        }
        
        emit ReputationEarned(user, amount, reason);
    }
    
    /**
     * @dev Deduct reputation points from a user
     * @param user The user address
     * @param amount The amount of reputation to deduct
     * @param reason The reason for deducting reputation
     */
    function deductReputation(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(user) >= amount, "Insufficient reputation balance");
        
        _burn(user, amount);
        
        ReputationData storage data = userReputation[user];
        data.totalSpent += amount;
        data.lastUpdated = block.timestamp;
        data.transactionHistory.push(amount);
        
        emit ReputationSpent(user, amount, reason);
    }
    
    /**
     * @dev Add achievement for a user
     * @param user The user address
     * @param achievement The achievement description
     */
    function addAchievement(address user, string memory achievement) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(bytes(achievement).length > 0, "Achievement cannot be empty");
        
        userReputation[user].achievements.push(achievement);
        emit AchievementUnlocked(user, achievement);
    }
    
    /**
     * @dev Calculate user level based on reputation balance
     * @param balance The user's reputation balance
     * @return The calculated level
     */
    function calculateLevel(uint256 balance) public view returns (uint256) {
        for (uint256 i = levelThresholds.length - 1; i >= 0; i--) {
            if (balance >= levelThresholds[i]) {
                return i;
            }
        }
        return 0;
    }
    
    /**
     * @dev Get user reputation data
     * @param user The user address
     * @return The user's reputation data
     */
    function getUserReputationData(address user) external view returns (ReputationData memory) {
        return userReputation[user];
    }
    
    /**
     * @dev Get user level
     * @param user The user address
     * @return The user's current level
     */
    function getUserLevel(address user) external view returns (uint256) {
        return userReputation[user].level;
    }
    
    /**
     * @dev Get total reputation earned by a user
     * @param user The user address
     * @return Total reputation earned
     */
    function getTotalEarned(address user) external view returns (uint256) {
        return userReputation[user].totalEarned;
    }
    
    /**
     * @dev Get total reputation spent by a user
     * @param user The user address
     * @return Total reputation spent
     */
    function getTotalSpent(address user) external view returns (uint256) {
        return userReputation[user].totalSpent;
    }
    
    /**
     * @dev Get user achievements
     * @param user The user address
     * @return Array of achievement strings
     */
    function getUserAchievements(address user) external view returns (string[] memory) {
        return userReputation[user].achievements;
    }
    
    /**
     * @dev Get user transaction history
     * @param user The user address
     * @return Array of transaction amounts
     */
    function getUserTransactionHistory(address user) external view returns (uint256[] memory) {
        return userReputation[user].transactionHistory;
    }
    
    /**
     * @dev Update level thresholds (owner only)
     * @param newThresholds New array of level thresholds
     */
    function updateLevelThresholds(uint256[] memory newThresholds) external onlyOwner {
        require(newThresholds.length > 0, "Thresholds array cannot be empty");
        
        // Validate thresholds are in ascending order
        for (uint256 i = 1; i < newThresholds.length; i++) {
            require(newThresholds[i] > newThresholds[i-1], "Thresholds must be in ascending order");
        }
        
        levelThresholds = newThresholds;
    }
    
    /**
     * @dev Get current level thresholds
     * @return Array of level thresholds
     */
    function getLevelThresholds() external view returns (uint256[] memory) {
        return levelThresholds;
    }
    
    /**
     * @dev Override transfer function to prevent regular transfers
     * Reputation can only be awarded/deducted by the contract owner
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        revert("Reputation tokens cannot be transferred directly");
    }
    
    /**
     * @dev Override transferFrom function to prevent regular transfers
     */
    function transferFrom(address from, address to, uint256 amount) public virtual override returns (bool) {
        revert("Reputation tokens cannot be transferred directly");
    }
}
