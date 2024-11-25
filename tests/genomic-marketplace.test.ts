import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock contract state
let users: Map<string, number> = new Map();
let datasets: Map<number, any> = new Map();
let nextUserId = 0;
let nextDatasetId = 0;

// Mock contract functions
const registerUser = (sender: string): { type: 'ok' | 'err', value: number } => {
  if (users.has(sender)) {
    return { type: 'err', value: 102 }; // err-already-exists
  }
  const userId = nextUserId++;
  users.set(sender, userId);
  return { type: 'ok', value: userId };
};

const addDataset = (sender: string, price: number, description: string, ipfsHash: string): { type: 'ok' | 'err', value: number } => {
  const userId = users.get(sender);
  if (userId === undefined) {
    return { type: 'err', value: 101 }; // err-not-found
  }
  const datasetId = nextDatasetId++;
  datasets.set(datasetId, { owner: userId, price, description, ipfsHash });
  return { type: 'ok', value: datasetId };
};

const getDataset = (datasetId: number): any | undefined => {
  return datasets.get(datasetId);
};

const getUserId = (address: string): number | undefined => {
  return users.get(address);
};

describe('Genomic Marketplace', () => {
  beforeEach(() => {
    // Reset the mock contract state before each test
    users.clear();
    datasets.clear();
    nextUserId = 0;
    nextDatasetId = 0;
  });
  
  it('should allow users to register', () => {
    const result = registerUser('user1');
    expect(result.type).toBe('ok');
    expect(result.value).toBe(0);
    
    const userId = getUserId('user1');
    expect(userId).toBe(0);
  });
  
  it('should not allow users to register twice', () => {
    const firstResult = registerUser('user1');
    expect(firstResult.type).toBe('ok');
    
    const secondResult = registerUser('user1');
    expect(secondResult.type).toBe('err');
    expect(secondResult.value).toBe(102); // err-already-exists
  });
  
  it('should allow users to add datasets', () => {
    registerUser('user1');
    
    const result = addDataset('user1', 100, 'Test Dataset', 'QmTest');
    expect(result.type).toBe('ok');
    expect(result.value).toBe(0);
    
    const dataset = getDataset(0);
    expect(dataset).toBeDefined();
    expect(dataset.owner).toBe(0);
    expect(dataset.price).toBe(100);
    expect(dataset.description).toBe('Test Dataset');
    expect(dataset.ipfsHash).toBe('QmTest');
  });
  
  it('should not allow unregistered users to add datasets', () => {
    const result = addDataset('unregistered_user', 100, 'Test Dataset', 'QmTest');
    expect(result.type).toBe('err');
    expect(result.value).toBe(101); // err-not-found
  });
  
  it('should allow retrieving user IDs', () => {
    registerUser('user1');
    registerUser('user2');
    
    const user1Id = getUserId('user1');
    const user2Id = getUserId('user2');
    
    expect(user1Id).toBe(0);
    expect(user2Id).toBe(1);
  });
  
  it('should allow retrieving datasets', () => {
    registerUser('user1');
    addDataset('user1', 100, 'Dataset 1', 'QmTest1');
    addDataset('user1', 200, 'Dataset 2', 'QmTest2');
    
    const dataset1 = getDataset(0);
    const dataset2 = getDataset(1);
    
    expect(dataset1).toBeDefined();
    expect(dataset1.description).toBe('Dataset 1');
    expect(dataset2).toBeDefined();
    expect(dataset2.description).toBe('Dataset 2');
  });
});

