export interface FamousAsteroid {
  id: string;
  name: string;
  diameter: number;
  material: string;
  velocity: number;
  description: string;
  historicalEvent?: string;
}

export const FAMOUS_ASTEROIDS: FamousAsteroid[] = [
  {
    id: 'apophis',
    name: '99942 Apophis',
    diameter: 370,
    material: 'stone',
    velocity: 30.73,
    description: 'Close approach in 2029 will bring it within 31,000 km of Earth',
    historicalEvent: 'Future encounter (April 13, 2029)'
  },
  {
    id: 'bennu',
    name: '101955 Bennu',
    diameter: 492,
    material: 'carbon',
    velocity: 27.7,
    description: 'Target of NASA\'s OSIRIS-REx sample return mission',
    historicalEvent: 'Visited by spacecraft 2018-2021'
  },
  {
    id: 'chelyabinsk',
    name: 'Chelyabinsk Meteor',
    diameter: 20,
    material: 'stone',
    velocity: 19.16,
    description: 'Exploded over Russia in 2013, injuring 1,500 people',
    historicalEvent: 'February 15, 2013'
  },
  {
    id: 'tunguska',
    name: 'Tunguska Event',
    diameter: 60,
    material: 'stone',
    velocity: 27,
    description: 'Largest impact event in recorded history, flattened 2,000 km² of forest',
    historicalEvent: 'June 30, 1908'
  },
  {
    id: 'barringer',
    name: 'Barringer Crater Impactor',
    diameter: 50,
    material: 'iron',
    velocity: 12.8,
    description: 'Created the famous Meteor Crater in Arizona ~50,000 years ago',
    historicalEvent: '~50,000 years ago'
  },
  {
    id: 'chicxulub',
    name: 'Chicxulub Impactor',
    diameter: 10000,
    material: 'stone',
    velocity: 20,
    description: 'Caused the extinction of dinosaurs 66 million years ago',
    historicalEvent: '66 million years ago'
  },
  {
    id: 'vredefort',
    name: 'Vredefort Impactor',
    diameter: 15000,
    material: 'stone',
    velocity: 20,
    description: 'Created the largest verified impact crater on Earth',
    historicalEvent: '~2 billion years ago'
  },
  {
    id: 'eros',
    name: '433 Eros',
    diameter: 16840,
    material: 'stone',
    velocity: 24.36,
    description: 'First asteroid orbited by a spacecraft',
    historicalEvent: 'Visited by NEAR Shoemaker 2000-2001'
  },
  {
    id: 'ryugu',
    name: '162173 Ryugu',
    diameter: 900,
    material: 'carbon',
    velocity: 26.8,
    description: 'Target of Japan\'s Hayabusa2 sample return mission',
    historicalEvent: 'Samples returned December 2020'
  },
  {
    id: 'itokawa',
    name: '25143 Itokawa',
    diameter: 330,
    material: 'stone',
    velocity: 25,
    description: 'First asteroid from which samples were returned to Earth',
    historicalEvent: 'Visited by Hayabusa 2005'
  },
  {
    id: 'vesta',
    name: '4 Vesta',
    diameter: 525000,
    material: 'stone',
    velocity: 19.34,
    description: 'Second-largest asteroid in the asteroid belt',
    historicalEvent: 'Visited by Dawn spacecraft 2011-2012'
  },
  {
    id: 'ceres',
    name: '1 Ceres',
    diameter: 939000,
    material: 'ice',
    velocity: 17.9,
    description: 'Largest object in the asteroid belt, classified as a dwarf planet',
    historicalEvent: 'Currently orbited by Dawn spacecraft'
  },
  {
    id: 'psyche',
    name: '16 Psyche',
    diameter: 226000,
    material: 'iron',
    velocity: 18.5,
    description: 'Metallic asteroid possibly the exposed core of a protoplanet',
    historicalEvent: 'NASA mission launching 2023'
  },
  {
    id: 'oumuamua',
    name: '1I/\'Oumuamua',
    diameter: 230,
    material: 'stone',
    velocity: 87.3,
    description: 'First confirmed interstellar object detected passing through our solar system',
    historicalEvent: 'October 2017'
  },
  {
    id: 'didymos',
    name: '65803 Didymos',
    diameter: 780,
    material: 'stone',
    velocity: 23.92,
    description: 'Target of NASA\'s DART mission - first asteroid deflection test',
    historicalEvent: 'DART impact September 26, 2022'
  }
];
