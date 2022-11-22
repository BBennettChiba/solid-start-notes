import { createServerData$, redirect } from "solid-start/server";
import { getUser } from "./session";
import { db } from "./index";

export const useUser = () =>
  createServerData$(async (_, { request }) => {
    const user = await getUser(db, request);

    if (!user) {
      throw redirect("/login");
    }

    return user;
  });
