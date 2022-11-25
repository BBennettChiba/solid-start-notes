import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
/**@TODO If move on from SQL Lite make this createMany */
export const createTag = async (name: string) => {
  try {
    const tag = await db.tag.create({ data: { name } });
    return tag;
  } catch (e) {
    console.log(e);
  }
};

export const createNote = async (
  title: string,
  tags: string[],
  content: string
) => {
  try {
    const note = await db.note.create({
      data: {
        user: {
          connect: {
            username: "kody",
          },
        },
        content,
        title,
        tags: {
          connectOrCreate: tags.map((name) => ({
            create: { name },
            where: { name },
          })),
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const getNotes = async () => {
  try {
    const notes = await db.note.findMany({
      include: { user: true, tags: true },
    });
    return notes;
  } catch (e) {}
};

export const getNote = async (id: string) => {
  try {
    const note = await db.note.findUnique({
      where: { id },
      include: { tags: true, user: true },
    });
    return note;
  } catch (e) {
    return null;
  }
};

export const getTags = async () => {
  try {
    const tags = await db.tag.findMany({ select: { name: true, id: true } });
    return tags;
  } catch (e) {
    return null;
  }
};
