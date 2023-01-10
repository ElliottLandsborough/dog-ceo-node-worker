import { Env } from "./libraries/data"

import { processRoutes, Route } from "./libraries/router"

import {
	breedNotFound,
	responseString,
	responseOneDimensional,
	responseTwoDimensional,
	responseTwoDimensionalWithAlt,
} from "./libraries/response"

import {
	Params,
	listAllBreeds,
	listMainBreeds,
	listSubBreeds,
	getBreedImages,
	getBreedImageRandom,
	getBreedImagesRandom,
	getBreedImagesRandomAlt,
	getBreedImageRandomCount,
	getBreedImageRandomCountAlt,
	listRandomMainBreeds,
	listRandomBreedsWithSub,
	listRandomSubBreeds,
} from "./libraries/breeds"

import {
	getClient
} from "./libraries/data"

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const client = getClient(env);
		env.S3_CLIENT = client;
		return handleRequest(request, env);
	}
}

export async function handleRequest(request: Request, env: Env) {
	const { pathname } = new URL(request.url);

		const routes: Array<Route> = [
			{
				route: '/api/breeds/list/all',
				handler: async () => {
					return responseTwoDimensional(Object.fromEntries(await listAllBreeds(env)));
				},
			},
			{
				route: '/api/breeds/list/all/random',
				handler: async () => {
					const params = {count: 1} as Params;
					const breeds = await listRandomBreedsWithSub(env, params);
					if (breeds.has('NOTFOUND')) {
						return breedNotFound();
					}
					return responseTwoDimensional(Object.fromEntries(breeds));
				},
			},
			{
				route: '/api/breeds/list/all/random/:count',
				handler: async (params: Params) => {
					return responseTwoDimensional(Object.fromEntries(await listRandomBreedsWithSub(env, params)));
				},
			},
			{
				route: '/api/breeds/list',
				handler: async () => {
					const breeds = await listMainBreeds(env);
					return responseOneDimensional(Array.from(breeds.keys()));
				},
			},
			{
				route: '/api/breeds/list/random',
				handler: async () => {
					const params = {count: 1} as Params;
					const breeds = await listRandomMainBreeds(env, params);
					if (breeds.has('NOTFOUND')) {
						return breedNotFound();
					}
					return responseString(Array.from(breeds.keys())[0]);
				},
			},
			{
				route: '/api/breeds/list/random/:count',
				handler: async (params: Params) => {
					const breeds = await listRandomMainBreeds(env, params);
					return responseOneDimensional(Array.from(breeds.keys()));
				},
			},
			{
				route: '/api/breed/:breed1/list',
				handler: async(params: Params) => {
					return responseTwoDimensional(Object.fromEntries(await listSubBreeds(env, params)));
				},
			},
			{
				route: '/api/breed/:breed1/list/random',
				handler: async(params: Params) => {
					const breeds = await listRandomSubBreeds(env, params);
					return responseString(breeds[0]);
				},
			},
			{
				route: '/api/breed/:breed1/list/random/:count',
				handler: async(params: Params) => {
					return responseOneDimensional(await listRandomSubBreeds(env, params));
				},
			},
			{
				route: '/api/breeds/image/random',
				handler: async () => {
					return responseString(await getBreedImageRandom(env));
				},
			},
			{
				route: '/api/breeds/image/random/:count',
				handler: async (params: Params) => {
					return responseOneDimensional(await getBreedImageRandomCount(env, params));
				},
			},
			{
				route: '/api/breeds/image/random/:count/alt',
				handler: async (params: Params) => {
					return responseTwoDimensionalWithAlt(await getBreedImageRandomCountAlt(env, params));
				},
			},
			{
				route: '/api/breed/:breed1/images',
				handler: async (params: Params) => {
					return responseOneDimensional(await getBreedImages(env, params));
				},
			},
			{
				route: '/api/breed/:breed1/images/random',
				handler: async (params: Params) => {
					const images = await getBreedImagesRandom(env, params);
					return responseString(images[0]);
				},
			},
			{
				route: '/api/breed/:breed1/images/random/:count',
				handler: async (params: Params) => {
					return responseOneDimensional(await getBreedImagesRandom(env, params));
				},
			},
			{
				route: '/api/breed/:breed1/images/random/:count/alt',
				handler: async (params: Params) => {
					return responseTwoDimensionalWithAlt(await getBreedImagesRandomAlt(env, params));
				},
			},
			{
				route: '/api/breed/:breed1/:breed2/images',
				handler: async (params: Params) => {
					return responseOneDimensional(await getBreedImages(env, params));
				},
			},
			{
				route: '/api/breed/:breed1/:breed2/images/random',
				handler: async (params: Params) => {
					const images = await getBreedImagesRandom(env, params);
					return responseString(images[0]);
				},
			},
			{
				route: '/api/breed/:breed1/:breed2/images/random/:count',
				handler: async (params: Params) => {
					const images = await getBreedImagesRandom(env, params);
					return responseOneDimensional(images);
				},
			},
			{
				route: '/api/breed/:breed1/:breed2/images/random/:count/alt',
				handler: async (params: Params) => {
					const images = await getBreedImagesRandomAlt(env, params);
					return responseTwoDimensionalWithAlt(images);
				},
			},
		];

		return processRoutes(pathname, routes);
}
