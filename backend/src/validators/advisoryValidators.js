import { z } from 'zod';

export const advisorySchema = z.object({
  crop: z
    .string()
    .min(2, { message: 'Crop name must be at least 2 characters' })
    .max(60, { message: 'Crop name must not exceed 60 characters' })
    .trim(),
  location: z
    .string()
    .min(2, { message: 'Location must be at least 2 characters' })
    .max(100, { message: 'Location must not exceed 100 characters' })
    .trim(),
  soilType: z.enum([
    'Black Soil',
    'Red Soil',
    'Sandy Soil',
    'Clay Soil',
    'Loamy Soil',
    'Alluvial Soil',
    'Unknown',
  ], {
    errorMap: () => ({ message: 'Please select a valid soil type' }),
  }),
  growthStage: z.enum([
    'Seedling',
    'Vegetative',
    'Flowering',
    'Fruiting',
    'Harvest',
    'Unknown',
  ], {
    errorMap: () => ({ message: 'Please select a valid crop growth stage' }),
  }),
  symptoms: z
    .string()
    .max(3000, { message: 'Symptoms description cannot exceed 3000 characters' })
    .trim()
    .optional()
    .default('General crop health inspection and seasonal advisory'),
  irrigation: z.enum([
    'Rainfed',
    'Drip',
    'Sprinkler',
    'Flood/Furrow',
    'Other',
    'Unknown',
  ], {
    errorMap: () => ({ message: 'Please select a valid irrigation method' }),
  }),
  weather: z
    .string()
    .max(600, { message: 'Weather details cannot exceed 600 characters' })
    .optional()
    .default(''),
  additionalInformation: z
    .string()
    .max(1500, { message: 'Additional information cannot exceed 1500 characters' })
    .optional()
    .default(''),
  language: z.enum(['en', 'te', 'hi'], {
    errorMap: () => ({ message: 'Language must be en, te, or hi' }),
  }).default('en'),
});
