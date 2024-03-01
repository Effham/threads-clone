"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  path,
  image,
}: Params): Promise<void> => {
  connectToDB();

  try {
    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (e: any) {
    throw new Error(`Failed to create/update user : ${e.message}`);
  }
};

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
    //   .populate({
    //     path: "communities",
    //     model: Community,
    //   });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export const fetchUserPosts = async (userId: string) => {
  try {
    connectToDB();

    const threads = await User.findOne({ id: userId })
      .populate({
        path: "threads",
        model: Thread,
        populate: {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      })
      .exec();

    return threads;
  } catch (error: any) {}
};
