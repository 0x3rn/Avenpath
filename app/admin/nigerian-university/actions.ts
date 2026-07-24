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

export async function checkCourseExists(name: string) {
  try {
    const { ilike, sql } = await import("drizzle-orm");
    const existing = await db.query.subjects.findFirst({
      where: ilike(sql`TRIM(${schema.subjects.name})`, name.trim())
    });
    if (existing) {
      return { exists: true, subjectId: existing.id };
    }
    return { exists: false, subjectId: null };
  } catch (error: any) {
    return { exists: false, subjectId: null, error: error.message };
  }
}

export async function searchGlobalCourses(query: string) {
  try {
    const { ilike, sql } = await import("drizzle-orm");
    const results = await db.query.subjects.findMany({
      where: ilike(sql`TRIM(${schema.subjects.name})`, `%${query.trim()}%`),
      limit: 10,
      columns: {
        id: true,
        name: true,
        slug: true
      }
    });
    return { success: true, results };
  } catch (error: any) {
    return { success: false, results: [], error: error.message };
  }
}

export async function shareUniversityCourse(subjectId: string, departmentId: number) {
  try {
    await db.insert(schema.courseShares).values({
      subjectId,
      categoryId: departmentId
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
      levelName: levelName.trim(),
      className: className.trim(),
      name: name.trim(),
      slug: slug.trim()
    });
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editFaculty(id: number, name: string, slug: string) {
  try {
    const { eq } = await import("drizzle-orm");
    await db.update(schema.levels)
      .set({ name, slug })
      .where(eq(schema.levels.id, id));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFaculty(id: number) {
  try {
    const { eq } = await import("drizzle-orm");
    await db.delete(schema.levels).where(eq(schema.levels.id, id));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editDepartment(id: number, name: string, slug: string) {
  try {
    const { eq } = await import("drizzle-orm");
    await db.update(schema.categories)
      .set({ name, slug })
      .where(eq(schema.categories.id, id));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDepartment(id: number) {
  try {
    const { eq } = await import("drizzle-orm");
    await db.delete(schema.categories).where(eq(schema.categories.id, id));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editUniversityCourse(
  id: string, 
  name: string, 
  slug: string,
  levelName?: string,
  className?: string
) {
  try {
    const { eq } = await import("drizzle-orm");
    const updateData: any = { name: name.trim(), slug: slug.trim() };
    if (levelName) updateData.levelName = levelName.trim();
    if (className) updateData.className = className.trim();

    await db.update(schema.subjects)
      .set(updateData)
      .where(eq(schema.subjects.id, id));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUniversityCourse(id: string) {
  try {
    const { eq } = await import("drizzle-orm");
    await db.delete(schema.subjects).where(eq(schema.subjects.id, id));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function unlinkUniversityCourse(subjectId: string, departmentId: number) {
  try {
    const { eq, and } = await import("drizzle-orm");
    await db.delete(schema.courseShares)
      .where(and(
        eq(schema.courseShares.subjectId, subjectId),
        eq(schema.courseShares.categoryId, departmentId)
      ));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function transferOwnershipAndDelete(subjectId: string, oldDepartmentId: number) {
  try {
    const { eq } = await import("drizzle-orm");
    const shares = await db.query.courseShares.findMany({
      where: eq(schema.courseShares.subjectId, subjectId),
      limit: 1
    });

    if (shares.length > 0) {
      const newOwnerId = shares[0].categoryId;
      await db.update(schema.subjects)
        .set({ categoryId: newOwnerId })
        .where(eq(schema.subjects.id, subjectId));
      
      await db.delete(schema.courseShares)
        .where(eq(schema.courseShares.id, shares[0].id));
        
      revalidatePath("/admin/nigerian-university");
      return { success: true };
    }
    
    await db.delete(schema.subjects).where(eq(schema.subjects.id, subjectId));
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function editUniversityCourseAlias(subjectId: string, departmentId: number, name: string, slug: string, isOwner: boolean) {
  try {
    const { eq, and } = await import("drizzle-orm");
    
    if (isOwner) {
      const shares = await db.query.courseShares.findMany({
        where: eq(schema.courseShares.subjectId, subjectId),
        limit: 1
      });

      if (shares.length > 0) {
        const newOwnerId = shares[0].categoryId;
        await db.update(schema.subjects)
          .set({ categoryId: newOwnerId })
          .where(eq(schema.subjects.id, subjectId));
          
        await db.delete(schema.courseShares).where(eq(schema.courseShares.id, shares[0].id));
        
        await db.insert(schema.courseShares).values({
          subjectId: subjectId,
          categoryId: departmentId,
          aliasName: name.trim(),
          aliasSlug: slug.trim(),
        });
      } else {
        await db.update(schema.subjects)
          .set({ name: name.trim(), slug: slug.trim() })
          .where(eq(schema.subjects.id, subjectId));
      }
    } else {
      await db.update(schema.courseShares)
        .set({ aliasName: name.trim(), aliasSlug: slug.trim() })
        .where(and(
          eq(schema.courseShares.subjectId, subjectId),
          eq(schema.courseShares.categoryId, departmentId)
        ));
    }
    
    revalidatePath("/admin/nigerian-university");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
