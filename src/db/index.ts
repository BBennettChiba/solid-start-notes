import { PrismaClient } from "@prisma/client";
import { isServer } from "solid-js/web";
export const db = isServer ? new PrismaClient() : null;
