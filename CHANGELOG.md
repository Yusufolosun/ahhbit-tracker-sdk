# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] - 2026-06-13

Comprehensive rewrite to support Stacks v3 contract deployments and introduce complete companion contract modules.

### Added
- **Accountability Groups (v3) Module**: Complete support for accountability contract calls (`create-group`, `join-group`, `settle-member`, `claim-group-reward`, `finalize-group`, `refund-failed-group`) and read-only query states.
- **Streak Rewards (v3) Module**: Complete support for funding the reward pool and claiming milestone reward tiers (7, 14, 30, 60, 90 check-ins).
- **Referral System Integration**: Added referrer registration (`buildRegisterReferrer`) and query functions (`getReferrer`, `getReferrerStats`, `getReferralBoost`).
- **Clarity Error Decoding**: Custom `AhhbitError` wrapper class with static decoding utility (`decodeContractError`) for parsing Clarity raw `(err uXXX)` strings into structured metadata and messages.
- **Check-In Window Utility**: Developer helpers (`getCheckInWindowState`, `getBlocksRemaining`, `getBlocksUntilNextCheckIn`, `isEligibleForCheckIn`, `isEligibleToWithdraw`) to determine live check-in eligibility on the client side.
- **Input Validation Module**: Assertions and validators for stake amounts, group durations, fund amounts, and habit names.
- **Developer Conversions**: `toSTX`, `toMicroSTX`, `formatSTX`, `shortenAddress`, `blocksToTime` utilities.
- **Testnet Contract Configs**: Pre-configured `TESTNET_CONTRACT` deployment parameters.

### Changed
- **Default Contract Target**: Main tracker contract updated from `habit-tracker-v2` to `habit-tracker-v3`.
- **Check-in Window**: Constant `CHECK_IN_WINDOW` increased from `144` to `192` blocks (~32 hours).
- **Stake Limits**: Set `MAX_STAKE_AMOUNT` to `100_000_000` microSTX (100 STX).
- **Withdrawal Post-Condition**: Refactored `buildWithdrawStake` post-conditions from exact STX transfer amount check (`willSendEq`) to greater-than-or-equal check (`willSendGte`). This prevents failed withdrawals resulting from partial forfeits on-chain.
- **Treashaking**: Enabled tree-shaking support in `tsup` bundler for smaller output bundle sizes.

### Removed
- **Deprecated Error Codes**: Removed `ErrorCode.CHECK_IN_WINDOW_EXPIRED` (106) and `ErrorCode.TRANSFER_FAILED` (110) from constants as they are no longer used on-chain.
- **Flat Client Layout**: Deleted flat file `src/client.ts` in favor of modular structure (`src/habit/`, `src/groups/`, `src/rewards/`).

---

## [1.1.1] - 2026-06-12

Initial stable release supporting `habit-tracker-v2` contract functions.
