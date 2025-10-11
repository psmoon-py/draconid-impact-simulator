export interface AsteroidTypePreview {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  credit: string;
  characteristics: string[];
}

export const ASTEROID_TYPE_PREVIEWS: AsteroidTypePreview[] = [
  {
    id: 'stony',
    name: 'Stony (S-type)',
    description: 'Most common type, composed primarily of silicate minerals',
    imageUrl: 'https://solarsystem.nasa.gov/system/stellar_items/image_files/705_feature_1600x900_eros.jpg',
    credit: 'NASA/JHUAPL',
    characteristics: [
      'Silicate rock composition',
      'Moderate albedo (0.10-0.22)',
      'Common in inner asteroid belt',
    ]
  },
  {
    id: 'carbonaceous',
    name: 'Carbonaceous (C-type)',
    description: 'Dark, carbon-rich asteroids from the outer belt',
    imageUrl: 'https://solarsystem.nasa.gov/system/stellar_items/image_files/795_feature_1600x900_bennu.jpg',
    credit: 'NASA/Goddard/University of Arizona',
    characteristics: [
      'Carbon-rich composition',
      'Very low albedo (0.03-0.10)',
      'Primitive materials from early solar system',
    ]
  },
  {
    id: 'iron',
    name: 'Iron (M-type)',
    description: 'Metallic asteroids, possibly cores of destroyed planetesimals',
    imageUrl: 'https://solarsystem.nasa.gov/system/resources/detail_files/788_psyche-16.jpg',
    credit: 'NASA/JPL-Caltech/ASU',
    characteristics: [
      'Iron-nickel metal composition',
      'High radar reflectivity',
      'Remnants of planetary cores',
    ]
  },
  {
    id: 'stony-iron',
    name: 'Stony-Iron',
    description: 'Mixed composition of metal and silicates',
    imageUrl: 'https://solarsystem.nasa.gov/system/news_items/main_images/851_PIA23142.jpg',
    credit: 'NASA/JPL-Caltech',
    characteristics: [
      'Mixed metal-silicate composition',
      'Moderate density',
      'Rare asteroid type',
    ]
  },
];
