"use strict";

import { ServiceSchema } from "moleculer";
import DbService from "moleculer-db";
import MongooseAdapter from "moleculer-db-adapter-mongoose";
const { MoleculerError } = require("moleculer").Errors;
import User from "../models/User";

interface UserModel {
	name: string,
	email: string,
	createdAt?: Date,
}

const userService: ServiceSchema = {
	name: "users",
	mixins: [DbService],
	adapter: new MongooseAdapter(
		process.env.MONGO_URI || "mongodb://localhost/test-project"
	),
	model: User,
	actions: {
		create: {
			params: {
				user: { type: "object" },
			},
			async handler(ctx) {
				try {
					const entity: UserModel = ctx.params.user;
					let user: any = await User.findOne({ email: entity.email });

					if (user) {
						throw new MoleculerError(
							"Email already exists",
							422,
							"",
							[{ field: "email", message: "is exist" }]
						);
					}

					user = new User(ctx.params.user);
					return await user.save();
				} catch (error) {
					return error;
				}
			},
		},

		getAllUsers: {
			async handler(ctx) {
				try {
					const users: any = await User.find();

					return users;
				} catch (error) {
					return error;
				}
			},
		},

		getOneUser: {
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				try {
					const user: any = await User.findById(ctx.params.id);
					if (!user)
						throw new MoleculerError("User not found", 400, "", [
							{ message: "User not found in database." },
						]);
					return user;
				} catch (error) {
					return error;
				}
			},
		},

		updateUser: {
			params: {
				id: { type: "string" },
				user: { type: "object" },
			},
			async handler(ctx) {
				try {
					let user: any = await User.findById(ctx.params.id);
					if (!user)
						throw new MoleculerError("User not found", 400, "", [
							{ message: "User not found in database." },
						]);

					user = await User.findOneAndUpdate(
						{ _id: ctx.params.id },
						ctx.params.user,
						{ new: true }
					);

					return user;
				} catch (error) {
					return error;
				}
			},
		},

		deleteUser: {
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				try {
					let user: any = await User.findById(ctx.params.id);
					if (!user)
						throw new MoleculerError("User not found", 400, "", [
							{ message: "User not found in database." },
						]);

					user = await User.findOneAndRemove({ _id: ctx.params.id });

					return user;
				} catch (error) {
					return error;
				}
			},
		},
	},
};

export = userService;
