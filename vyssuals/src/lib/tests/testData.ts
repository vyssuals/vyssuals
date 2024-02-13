// testData.ts

import { type DataItem } from '../types';
import { addDataItem } from '../store';

// Function to generate a random number between min and max (inclusive)
function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to select a random element from an array
function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

// Define possible values for the 'category' attribute
const categories: string[] = ['walls', 'doors', 'floors', 'windows', 'roofs', 'ceilings', 'stairs'];
const levels: string[] = ['level1', 'level2', 'level3'];
const fireRating: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
const heights: number[] = [3.5, 4.22, 4.5, 7];
const someLongParameterName: string[] = ['Alphaaaaaaaaaaaaaaaa', 'Betaaaaaaaaaaa', 'Gammaaaaa', 'Deltaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'Epsilonaaaa', 'Zetaaaaa'];

export function generateDummyData(dataSource: string, count: number) {
    const timestamp = new Date();
    for (let i = 1; i <= count; i++) {
        const item: DataItem = {
            id: `item_${i}`,
            dataSource,
            timestamp,
            attributes: {
                Area: getRandomNumber(1, 10), // Generate a random value for 'area'
                Category: getRandomElement(categories), // Select a random category
                Level: getRandomElement(levels), // Select a random level
                // Generate a random value for 'fireRating' if the category is 'walls' or 'floors
                'Fire Rating': (categories.includes('walls') || categories.includes('floors')) ? getRandomElement(fireRating) : undefined,
                // Generate a random value for 'height' if the category is 'walls'
                Height: (categories.includes('walls')) ? getRandomElement(heights) : undefined,
                'Some Long Parameter Name That Never Keeps on Goooooooooooooooooing': getRandomElement(someLongParameterName), // Select a random value for 'someLongParameterName
            },
        };
        addDataItem(item);
    }
}
