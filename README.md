# AhhbitTracker SDK (v2.0.0)

Production-grade TypeScript SDK for interacting with the **AhhbitTracker** smart contracts on the Stacks blockchain. Supports **Habit Tracker (v3)**, **Accountability Groups (v3)**, and **Streak Rewards (v3)**.

## Features

- 🏗️ **Typed Transaction Builders**: 14 distinct builders with automatic post-conditions (`Deny` mode by default) and validation.
- 🔍 **Read-Only Query Helpers**: 24 queries with parsing/unwrapping logic for Clarity types.
- 🛡️ **Clarity Error Decoding**: Map raw Solidity-style Clarity exit codes `(err uXXX)` to human-readable error messages and throw custom `AhhbitError` instances.
- ⚡ **Developer Utilities**: Check-in window calculations, block-to-time estimators, STX to microSTX formatter, address shorteners.
- 📦 **Dual Build Target**: Clean ESM + CJS outputs with tree-shaking enabled. Zero external dependencies.

---

## Install

```bash
npm install @yusufolosun/ahhbit-tracker-sdk @stacks/transactions @stacks/network
```

---

## Usage Quick Start

### 1. Habit Tracker (v3)

Create habits with STX stake, perform check-ins, register referrers, and withdraw/claim bonuses.

```typescript
import { 
  buildCreateHabit, 
  buildCheckIn, 
  buildRegisterReferrer,
  getHabit, 
  getForfeitStatus 
} from '@yusufolosun/ahhbit-tracker-sdk';
import { STACKS_MAINNET } from '@stacks/network';

// 1. Register a referrer (Optional, one-time)
const referrerTx = buildRegisterReferrer('SP2ZDG5S3N0H45DSV4027732VND9HPHS4HQQPFFA');

// 2. Create a habit (stake 5 STX = 5,000,000 microSTX)
const createTx = buildCreateHabit('Read Books', 5_000_000, 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z');

// 3. Query habit details
const habit = await getHabit(1, STACKS_MAINNET);
console.log(habit?.name); // "Read Books"
console.log(habit?.bonusWeight); // 1

// 4. Query forfeit/penalty stats
const penaltyInfo = await getForfeitStatus(1, STACKS_MAINNET);
console.log(penaltyInfo.pendingPenalty); // microSTX penalty if slashed now
```

### 2. Accountability Groups (v3)

Create or join staking groups. The group pool is divided among members who successfully complete their habits.

```typescript
import { 
  buildCreateGroup, 
  buildJoinGroup, 
  getGroup, 
  getGroupShare 
} from '@yusufolosun/ahhbit-tracker-sdk';

// 1. Create a group: stake 10 STX, duration 1000 blocks (~7 days), habit ID 1
const groupTx = buildCreateGroup(
  10_000_000, 
  1000, 
  1, 
  'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z'
);

// 2. Join an existing group
const joinTx = buildJoinGroup(
  12, // Group ID
  2,  // Caller's Habit ID
  'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z',
  10_000_000 // Stake amount required
);
```

### 3. Streak Rewards (v3)

Contribute to the reward pool and claim milestone rewards (7, 14, 30, 60, or 90-day streaks).

```typescript
import { 
  buildFundRewardPool, 
  buildClaimMilestoneReward, 
  getRewardPoolBalance 
} from '@yusufolosun/ahhbit-tracker-sdk';

// 1. Fund the reward pool with 50 STX
const fundTx = buildFundRewardPool(50_000_000, 'SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z');

// 2. Claim milestone reward for habit ID 3 for reaching a 14-day streak
const claimTx = buildClaimMilestoneReward(3, 14);
```

---

## Error Handling Patterns

The SDK decodes Stacks/Clarity error tuples `(err uXXX)` into custom `AhhbitError` objects.

```typescript
import { decodeContractError, isAhhbitError } from '@yusufolosun/ahhbit-tracker-sdk';

try {
  // Assume a transaction fails on-chain and returns "(err u103)"
  const rawTxError = '(err u103)';
  const decoded = decodeContractError(rawTxError);
  
  if (decoded) {
    console.log(decoded.code); // 103
    console.log(decoded.message); // "Habit not found"
  }
} catch (err) {
  if (isAhhbitError(err)) {
    console.error(`Contract Error [${err.code}]: ${err.message}`);
  }
}
```

---

## Utility Function Examples

```typescript
import { 
  toSTX, 
  toMicroSTX, 
  formatSTX, 
  shortenAddress, 
  blocksToTime,
  getCheckInWindowState 
} from '@yusufolosun/ahhbit-tracker-sdk';

// Formatting
formatSTX(1_500_000); // "1.50 STX"
shortenAddress('SP1N3809W9CBWWX04KN3TCQHP8A9GN520BD4JMP8Z'); // "SP1N38...MP8Z"

// Conversions
blocksToTime(96); // "~16 hours"
blocksToTime(144); // "~1 day"

// Habit Check-In Window Calculation
const windowState = getCheckInWindowState(
  { isActive: true, lastCheckInBlock: 105200 }, 
  105300 // Current block height
);
console.log(windowState); // "cooldown", "available", "urgent", "expired", etc.
```

---

## Custom Contract Override

You can target custom contract deployments or testnets globally by passing the optional `contract` argument to builders and queries.

```typescript
import { TESTNET_CONTRACT, buildCreateHabit } from '@yusufolosun/ahhbit-tracker-sdk';

// 1. Using SDK's pre-configured Testnet contracts
const testnetTx = buildCreateHabit(
  'Exercise', 
  50_000_000, 
  sender, 
  TESTNET_CONTRACT
);

// 2. Custom local/devnet deployment
const customTx = buildCreateHabit('Exercise', 50_000_000, sender, {
  contractAddress: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5',
  contractName: 'my-custom-habit-tracker'
});
```

---

## Migration from v1.x -> v2.0

Version `2.0` introduces **breaking changes** to support the `v3` on-chain contract upgrades.

1. **Default Contract Target**: The default `MAINNET_CONTRACT` now targets `habit-tracker-v3` (v2 contract target is deprecated).
2. **Removed Constant/Error Code**: `ErrorCode.CHECK_IN_WINDOW_EXPIRED` (106) and `ErrorCode.TRANSFER_FAILED` (110) are removed from the constants since they do not exist in the v3 contracts.
3. **Check-In Window Change**: `CHECK_IN_WINDOW` is updated from `144` blocks to `192` blocks (~32 hours).
4. **Flexible Withdrawal Post-Condition**: `buildWithdrawStake` now uses a greater-than-or-equal post-condition (`willSendGte`) instead of `willSendEq`. This prevents transaction failures due to partial forfeits in the v3 contract.

---

## API Reference

### 1. Habit Tracker Module

**Transaction Builders:**
- `buildCreateHabit(name, stakeAmount, sender, contract?)`
- `buildCheckIn(habitId, contract?)`
- `buildSlashHabit(habitId, contract?)`
- `buildWithdrawStake(habitId, stakeAmount, contract?)`
- `buildClaimBonus(habitId, contract?)`
- `buildRegisterReferrer(referrerAddress, contract?)`

**Read-Only Queries:**
- `getHabit(habitId, network, contract?)` -> `Promise<Habit | null>`
- `getUserHabits(address, network, contract?)` -> `Promise<UserHabits>`
- `getHabitStreak(habitId, network, contract?)` -> `Promise<number>`
- `getPoolBalance(network, contract?)` -> `Promise<number>`
- `getTotalHabits(network, contract?)` -> `Promise<number>`
- `getUserStats(address, network, contract?)` -> `Promise<UserStats>`
- `getForfeitStatus(habitId, network, contract?)` -> `Promise<ForfeitStatus>`
- `getEstimatedBonusShare(network, contract?)` -> `Promise<number>`
- `getUnclaimedCompletedHabits(network, contract?)` -> `Promise<number>`
- `getUnclaimedCompletedWeight(network, contract?)` -> `Promise<number>`
- `getReferrer(address, network, contract?)` -> `Promise<ReferralInfo | null>`
- `getReferrerStats(address, network, contract?)` -> `Promise<ReferrerStats>`
- `getReferralBoost(address, network, contract?)` -> `Promise<number>`
- `getExpiredHabits(address, network, contract?)` -> `Promise<number[]>`

### 2. Accountability Groups Module

**Transaction Builders:**
- `buildCreateGroup(stakeAmount, duration, habitId, senderAddress, contract?)`
- `buildJoinGroup(groupId, habitId, senderAddress, groupStakeAmount, contract?)`
- `buildSettleMember(groupId, memberAddress, contract?)`
- `buildClaimGroupReward(groupId, contract?)`
- `buildFinalizeGroup(groupId, contract?)`
- `buildRefundFailedGroup(groupId, memberAddress, contract?)`

**Read-Only Queries:**
- `getGroup(groupId, network, contract?)` -> `Promise<Group | null>`
- `getGroupShare(groupId, network, contract?)` -> `Promise<number>`
- `getMemberInfo(groupId, address, network, contract?)` -> `Promise<GroupMember | null>`
- `getMemberGroups(address, network, contract?)` -> `Promise<MemberGroups>`
- `getTotalGroups(network, contract?)` -> `Promise<number>`

### 3. Streak Rewards Module

**Transaction Builders:**
- `buildFundRewardPool(amount, senderAddress, contract?)`
- `buildClaimMilestoneReward(habitId, milestone, contract?)`

**Read-Only Queries:**
- `getMilestoneReward(milestone, network, contract?)` -> `Promise<MilestoneReward | null>`
- `getRewardPoolBalance(network, contract?)` -> `Promise<number>`
- `isMilestoneClaimed(habitId, milestone, network, contract?)` -> `Promise<boolean>`
- `getClaimDetails(habitId, milestone, network, contract?)` -> `Promise<ClaimDetails | null>`
- `getTotalDistributed(network, contract?)` -> `Promise<number>`

---

## Type Reference

```typescript
export interface Habit {
  owner: string;
  name: string;
  stakeAmount: number;
  currentStreak: number;
  lastCheckInBlock: number;
  createdAtBlock: number;
  isActive: boolean;
  isCompleted: boolean;
  bonusWeight: number;
  bonusClaimed: boolean;
}

export interface ForfeitStatus {
  habitId: number;
  isActive: boolean;
  stakeAmount: number;
  initialStake: number;
  missedWindows: number;
  unappliedMissed: number;
  pendingPenalty: number;
  stakeAfterPenalty: number;
  isInPenaltyZone: boolean;
  blocksUntilNextMiss: number;
  pctStakeRemaining: number;
}

export interface Group {
  creator: string;
  stakeAmount: number;
  startBlock: number;
  endBlock: number;
  memberCount: number;
  isActive: boolean;
  isSettled: boolean;
  totalStaked: number;
  successfulCount: number;
  settledCount: number;
}
```

---

## License

MIT © [Yusufolosun](https://github.com/Yusufolosun)
