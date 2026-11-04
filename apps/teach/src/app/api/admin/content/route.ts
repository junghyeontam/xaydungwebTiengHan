import { NextRequest, NextResponse } from "next/server";
import {
  createLessonDraft,
  submitForReview,
  addReviewerComment,
  approveDraft,
  publishLesson,
  editPublishedLesson,
  rollbackLesson,
  schedulePublish,
  scheduleUnpublish,
  getAllVersions,
  getPublishedLesson,
  getAllPublishedLessons,
} from "@/features/content-publishing/content-service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const publishedOnly = searchParams.get("published") === "true";

  if (slug) {
    const lesson = getPublishedLesson(slug);
    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found or not published" }, { status: 404 });
    }
    return NextResponse.json({ success: true, lesson });
  }

  if (publishedOnly) {
    return NextResponse.json({ success: true, lessons: getAllPublishedLessons() });
  }

  return NextResponse.json({ success: true, versions: getAllVersions() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      actorEmail = "admin@junghyeon.vn",
      actorRole = "super_admin",
      authorEmail = body.actorEmail || "admin@junghyeon.vn",
      authorRole = body.actorRole || "super_admin",
    } = body;

    switch (action) {
      case "create_draft": {
        const draft = await createLessonDraft({
          slug: body.slug,
          title: body.title,
          koreanTitle: body.koreanTitle,
          levelBadge: body.levelBadge,
          levelName: body.levelName,
          authorEmail,
          authorRole,
        });
        return NextResponse.json({ success: true, draft }, { status: 201 });
      }

      case "submit_review": {
        const version = await submitForReview({
          slug: body.slug,
          versionNumber: body.versionNumber || 1,
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, version });
      }

      case "add_comment": {
        const version = await addReviewerComment({
          slug: body.slug,
          versionNumber: body.versionNumber || 1,
          comment: body.comment,
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, version });
      }

      case "approve": {
        const version = await approveDraft({
          slug: body.slug,
          versionNumber: body.versionNumber || 1,
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, version });
      }

      case "publish": {
        const version = await publishLesson({
          slug: body.slug,
          versionNumber: body.versionNumber || 1,
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, version });
      }

      case "edit_published": {
        const version = await editPublishedLesson({
          slug: body.slug,
          updatedTitle: body.updatedTitle,
          authorEmail,
          authorRole,
        });
        return NextResponse.json({ success: true, version });
      }

      case "rollback": {
        if (actorRole === "content_editor") {
          return NextResponse.json({ error: "Forbidden: Cannot rollback" }, { status: 403 });
        }

        const version = await rollbackLesson({
          slug: body.slug,
          targetVersionNumber: body.targetVersionNumber || 1,
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, version });
      }

      case "schedule_publish": {
        const version = await schedulePublish({
          slug: body.slug,
          versionNumber: body.versionNumber || 1,
          publishAt: body.publishAt,
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, version });
      }

      case "schedule_unpublish": {
        const reg = await scheduleUnpublish({
          slug: body.slug,
          unpublishAt: body.unpublishAt,
          actorEmail,
          actorRole,
        });
        return NextResponse.json({ success: true, registry: reg });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (err: any) {
    const isForbidden = err?.message?.includes("Forbidden");
    const isTwoPerson = err?.message?.includes("Two-person rule");
    const status = isForbidden || isTwoPerson ? 403 : 500;
    return NextResponse.json(
      {
        error: err?.message || "Internal error",
        code: isTwoPerson ? "TWO_PERSON_RULE_VIOLATION" : isForbidden ? "FORBIDDEN" : "ERROR",
      },
      { status }
    );
  }
}
