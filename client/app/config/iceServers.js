export const iceServers = [
  {
    urls: process.env.NEXT_PUBLIC_STUN_SERVER,
  },
  {
    urls: process.env.NEXT_PUBLIC_TURN_SERVER,
    username: process.env.NEXT_PUBLIC_TURN_USERNAME,
    credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
  },
  {
    urls: `${process.env.NEXT_PUBLIC_TURN_SERVER}?transport=tcp`,
    username: process.env.NEXT_PUBLIC_TURN_USERNAME,
    credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
  },
  {
    urls: "turn:global.relay.metered.ca:443",
    username: process.env.NEXT_PUBLIC_TURN_USERNAME,
    credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
  },
  {
    urls: "turns:global.relay.metered.ca:443?transport=tcp",
    username: process.env.NEXT_PUBLIC_TURN_USERNAME,
    credential: process.env.NEXT_PUBLIC_TURN_CREDENTIAL,
  },
];
