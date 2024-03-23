import { init as ucaInit } from 'unicode-collation-algorithm2';

if (typeof window !== 'undefined') {
  console.log('Initializing UCA...');
  ucaInit();
}
