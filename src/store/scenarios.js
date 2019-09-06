import { EASY } from '_constants/game';

export default new Map([
    [0, {
        icon: 'https://avatars.dicebear.com/v2/jdenticon/birds.svg',
        title: 'Explore Birds',
        difficulty: EASY,
        poster: 'https://avatars.dicebear.com/v2/jdenticon/birds.svg',
        progress: 0,
        description: 'Learn more about birds species with "Explore Brids" puzzles'
    }],
    [1, {
        icon: 'https://avatars.dicebear.com/v2/jdenticon/trees.svg',
        title: 'Explore Trees',
        difficulty: EASY,
        poster: 'https://avatars.dicebear.com/v2/jdenticon/trees.svg',
        progress: 0.33,
        description: 'Learn more about trees species with "Explore Trees" puzzles'
    }],
    [2, {
        icon: 'https://avatars.dicebear.com/v2/jdenticon/space.svg',
        title: 'Explore Space',
        difficulty: EASY,
        poster: 'https://avatars.dicebear.com/v2/jdenticon/space.svg',
        progress: 0.66,
        description: 'Learn more about Space with "Explore Space" puzzles'
    }]
]);