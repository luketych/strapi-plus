# Decision: Switch from env vars to config vars

**Date:** 2025-04-03  
**Author:** @luketych

## Summary
To simplify working with VSCode dev containers, we removed `.env` variables and replaced them with a config file-based system.

## Motivation
- `.env` management was messy with container environments.
- VSCode dev containers work better with explicit config files.
- Easier onboarding and consistent behavior across environments.

## Tradeoffs
- Need to maintain config files per environment
- Slightly more verbose setup

## Status
✅ Implemented and merged into `main` from `envToConfig`
