/*
Subscriptions are what set everything in motion
To create a Subscription:
- Call Observable.subscribe
- Pass in implementation of reaction. This is where you can decide how to react(-ive programming) to each event.
  - Object implementing Observer interface (next, error, complete)
  - Or 3 separate callbacks. Don't need to provide all
  - nothing
 */
