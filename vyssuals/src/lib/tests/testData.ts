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
const categories: string[] = ['walls', 'doors', 'floors'];

export function generateDummyData() {
    for (let i = 1; i <= 10; i++) {
        const item: DataItem = {
            id: `item_${i}`,
            attributes: {
                area: getRandomNumber(10, 100), // Generate a random value for 'area'
                category: getRandomElement(categories), // Select a random category
            },
        };
        addDataItem(item);
    }
}
