import { Inngest } from "inngest";
import { connectDb } from "./db.js";
import User from "../models/user.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "shorya-talentiq" });

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    await connectDb();

    const {
      id,
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = event.data;

    // Prevent saving a user with a null/undefined clerkId
    if (!id) {
      throw new Error(
        `Clerk ID is missing. Event data: ${JSON.stringify(event.data)}`
      );
    }

    const newUser = {
      clerkId: id,
      email: email_addresses?.[0]?.email_address || "",
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImage: image_url || "",
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser.clerkId,
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    await connectDb();

    const { id } = event.data;

    if (!id) {
      throw new Error("Clerk ID is missing from delete event");
    }

    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id);
  }
);

export const functions = [syncUser, deleteUserFromDB];