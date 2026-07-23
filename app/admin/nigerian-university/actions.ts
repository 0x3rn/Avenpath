"use server";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createFaculty(name: string, slug: string) {
  try {
    await db.insert(schema.levels).values({
      name,
      slug,
      region: 'nigerian-university'
    });
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDepartment(facultyId: number, name: string, slug: string) {
  try {
    await db.insert(schema.categories).values({
      levelId: facultyId,
      name,
      slug
    });
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createUniversityCourse(
  departmentId: number, 
  levelName: string, 
  className: string, // Semester
  name: string, 
  slug: string,
  id: string
) {
  try {
    await db.insert(schema.subjects).values({
      id,
      categoryId: departmentId,
      country: "Nigeria",
      curriculum: "University",
      levelName,
      className,
      name,
      slug
    });
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
