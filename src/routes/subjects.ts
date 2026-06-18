import express, { Router } from "express";
import { or, ilike, and, sql, eq, getTableColumns } from "drizzle-orm";
import { departments, subjects } from "../db/schema";
import { db } from "../db";
const router = express.Router();

//This route will get all subjects with optional search,filtering and pagination
router.get("/", async (req: express.Request, res: express.Response) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;
    const currentPage = Math.max(1, +page);
    const limitPerPage = Math.max(1, +limit);
    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];

    //If search query exists,filter by subject name or subject code
    if (search) {
      filterConditions.push(
        or(
          ilike(subjects.name, `%${search}%`),
          ilike(subjects.code, `%${search}%`),
        ),
      );
    }

    //if department filter exists,
    if (department) {
      filterConditions.push(ilike(departments.name, `%${departments}%`));
    }
    //combine all filters using AND if they exist

    const whereClause =
      filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount: number = countResult[0]?.count ?? 0;

    const subjectsList = await db
      .select({
        ...getTableColumns(subjects),
        departments: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(subjects.createdAt)
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectsList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / totalCount),
      },
    });
  } catch (err) {
    console.log(`Get /subject ${err}`);
    res.status(500).send("Failed to get /subject");
  }
});
export default router;
