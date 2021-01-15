"use strict";

import { ServiceSchema } from "moleculer";
import DbService from "moleculer-db";
import MongooseAdapter from "moleculer-db-adapter-mongoose";
import Post from "../models/Post";
const { MoleculerError } = require("moleculer").Errors;

const postService: ServiceSchema = {
	name: "posts",
	mixins: [DbService],
	adapter: new MongooseAdapter(
		process.env.MONGO_URI || "mongodb://localhost/test-project"
	),
	model: Post,
	settings: {},
	dependencies: [],
	actions: {
		createPost: {
			params: {
				author: { type: "object" },
				title: { type: "string" },
				content: { type: "string" },
			},
			async handler(ctx) {
				try {
					const entity: any = {
						author: ctx.params.author,
						title: ctx.params.title,
						content: ctx.params.content,
					};

					let post: any = new Post(entity);
					return await post.save();
				} catch (error) {
					return error;
				}
			},
		},

		getAllPosts: {
			async handler(ctx) {
				try {
					const posts: any = await Post.find().populate("author");

					return posts;
				} catch (error) {
					return error;
				}
			},
		},

		getPost: {
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				try {
					const post: any = await Post.findById(
						ctx.params.id
					).populate("author");

					if (!post)
						throw new MoleculerError("Post not found", 400, "", [
							{ message: "Post not found in database." },
						]);

					return post;
				} catch (error) {
					return error;
				}
			},
		},
	},
};

export = postService;
