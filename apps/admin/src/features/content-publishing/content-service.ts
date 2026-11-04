import { LESSONS_DATABASE, LessonDetail } from "@/lib/data/lessons-data";
import { recordAuditLog } from "@/features/audit/audit-service";
import { revalidatePath } from "next/cache";

export interface ContentVersion {
  id: string;
  entityType: "lesson" | "roadmap" | "banner";
  entityId: string; // e.g. lessonSlug
  versionNumber: number;
  status: "draft" | "in_review" | "approved" | "published" | "archived" | "scheduled";
  title: string;
  data: LessonDetail;
  changelog?: string;
  comments?: { author: string; role: string; comment: string; createdAt: string }[];
  authorEmail: string;
  authorRole: string;
  publishedBy?: string;
  publishedAt?: string;
  scheduledPublishAt?: string | null;
  scheduledUnpublishAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LessonRegistryItem {
  slug: string;
  publishedVersionId: string | null;
  status: "published" | "draft" | "archived";
  scheduledUnpublishAt?: string | null;
  updatedAt: string;
}

// Persistent global singleton across HMR, worker threads, and SSR bundles
interface GlobalPublishingState {
  versionsStore: Map<string, ContentVersion>;
  lessonRegistry: Map<string, LessonRegistryItem>;
}

const globalForPublishing = globalThis as unknown as { __jh_publishing?: GlobalPublishingState };

if (!globalForPublishing.__jh_publishing) {
  const versionsStore = new Map<string, ContentVersion>();
  const lessonRegistry = new Map<string, LessonRegistryItem>();

  // Initialize baseline published seed lessons
  Object.entries(LESSONS_DATABASE).forEach(([slug, detail]) => {
    const versionId = `v-seed-${slug}`;
    const seedVersion: ContentVersion = {
      id: versionId,
      entityType: "lesson",
      entityId: slug,
      versionNumber: 1,
      status: "published",
      title: detail.title,
      data: detail,
      changelog: "Initial published seed curriculum",
      authorEmail: "curriculum@junghyeon.vn",
      authorRole: "super_admin",
      publishedBy: "system",
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    versionsStore.set(`${slug}_v1`, seedVersion);
    lessonRegistry.set(slug, {
      slug,
      publishedVersionId: versionId,
      status: "published",
      updatedAt: new Date().toISOString(),
    });
  });

  globalForPublishing.__jh_publishing = {
    versionsStore,
    lessonRegistry,
  };
}

const versionsStore = globalForPublishing.__jh_publishing.versionsStore;
const lessonRegistry = globalForPublishing.__jh_publishing.lessonRegistry;

/**
 * 1. Create a lesson draft (by content_editor)
 */
export async function createLessonDraft(params: {
  slug: string;
  title: string;
  koreanTitle?: string;
  levelBadge?: string;
  levelName?: string;
  introduction?: string;
  authorEmail: string;
  authorRole: string;
  data?: Partial<LessonDetail>;
}): Promise<ContentVersion> {
  const { slug, title, authorEmail, authorRole } = params;

  const newLessonDetail: LessonDetail = {
    slug,
    title,
    koreanTitle: params.koreanTitle || "신규 강의",
    levelBadge: params.levelBadge || "SƠ CẤP",
    levelName: params.levelName || "TOPIK 1 • Sơ cấp",
    estimatedMinutes: 20,
    totalXp: 35,
    introduction: params.introduction || "Nội dung bài học bản nháp mới khởi tạo.",
    vocabulary: params.data?.vocabulary || [
      {
        id: "v-draft-1",
        korean: "선생님",
        romaja: "seonsaengnim",
        meaning: "Giáo viên / Thầy cô",
        audioText: "선생님",
        exampleKorean: "선생님, 안녕하세요!",
        exampleRomaja: "Seonsaengnim, annyeonghaseyo!",
        exampleMeaning: "Thầy ơi, em chào thầy ạ!",
      },
    ],
    grammarRules: params.data?.grammarRules || [
      {
        title: "Cấu trúc danh từ + 입니다 (Là...)",
        formula: "Danh từ + 입니다",
        explanation: "Đuôi câu trang trọng dùng khi giới thiệu bản thân hoặc đồ vật.",
        examples: [
          {
            korean: "저는 학생입니다.",
            romaja: "Jeoneun haksaeng-imnida.",
            meaning: "Tôi là học sinh.",
          },
        ],
      },
    ],
    exercises: params.data?.exercises || [
      {
        id: "ex-draft-1",
        type: "multiple-choice",
        instruction: "Chọn đuôi câu trang trọng mang nghĩa 'là':",
        question: "저는 베트남 사람_____.",
        options: ["입니다", "아닙니다", "있습니다", "없습니다"],
        correctAnswer: "입니다",
        explanation: "Dùng '입니다' để khẳng định 'Tôi là người Việt Nam'.",
        xp: 15,
      },
    ],
  };

  const versionId = `ver-${slug}-v1-${Date.now()}`;
  const version: ContentVersion = {
    id: versionId,
    entityType: "lesson",
    entityId: slug,
    versionNumber: 1,
    status: "draft",
    title,
    data: newLessonDetail,
    changelog: "Khởi tạo bản nháp bài học",
    comments: [],
    authorEmail,
    authorRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  versionsStore.set(`${slug}_v1`, version);
  lessonRegistry.set(slug, {
    slug,
    publishedVersionId: null, // NOT published!
    status: "draft",
    updatedAt: new Date().toISOString(),
  });

  await recordAuditLog({
    actorEmail: authorEmail,
    actorRole: authorRole,
    action: "lesson:create_draft",
    entityType: "lesson",
    entityId: slug,
    details: { version: 1, title, status: "draft" },
  });

  return version;
}

/**
 * 2. Submit draft for review
 */
export async function submitForReview(params: {
  slug: string;
  versionNumber: number;
  actorEmail: string;
  actorRole: string;
}): Promise<ContentVersion> {
  const key = `${params.slug}_v${params.versionNumber}`;
  const version = versionsStore.get(key);
  if (!version) throw new Error(`Version ${key} not found`);

  version.status = "in_review";
  version.updatedAt = new Date().toISOString();
  versionsStore.set(key, version);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "lesson:submit_review",
    entityType: "lesson",
    entityId: params.slug,
    details: { versionNumber: params.versionNumber, status: "in_review" },
  });

  return version;
}

/**
 * 3. Add reviewer comment
 */
export async function addReviewerComment(params: {
  slug: string;
  versionNumber: number;
  comment: string;
  actorEmail: string;
  actorRole: string;
}): Promise<ContentVersion> {
  const key = `${params.slug}_v${params.versionNumber}`;
  const version = versionsStore.get(key);
  if (!version) throw new Error(`Version ${key} not found`);

  version.comments = version.comments || [];
  version.comments.push({
    author: params.actorEmail,
    role: params.actorRole,
    comment: params.comment,
    createdAt: new Date().toISOString(),
  });
  version.updatedAt = new Date().toISOString();
  versionsStore.set(key, version);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "lesson:add_comment",
    entityType: "lesson",
    entityId: params.slug,
    details: { comment: params.comment },
  });

  return version;
}

/**
 * 4. Approve draft
 */
export async function approveDraft(params: {
  slug: string;
  versionNumber: number;
  actorEmail: string;
  actorRole: string;
}): Promise<ContentVersion> {
  const allowedRoles = ["super_admin", "admin", "publisher"];
  if (!allowedRoles.includes(params.actorRole)) {
    throw new Error(`Forbidden: Role '${params.actorRole}' does not have permission 'content.approve'.`);
  }

  const key = `${params.slug}_v${params.versionNumber}`;
  const version = versionsStore.get(key);
  if (!version) throw new Error(`Version ${key} not found`);

  // Two-person rule: Author cannot approve their own draft
  if (
    version.authorEmail &&
    params.actorEmail &&
    version.authorEmail.toLowerCase().trim() === params.actorEmail.toLowerCase().trim()
  ) {
    throw new Error("Two-person rule violation: Author cannot approve their own content draft.");
  }

  version.status = "approved";
  version.updatedAt = new Date().toISOString();
  versionsStore.set(key, version);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "lesson:approve",
    entityType: "lesson",
    entityId: params.slug,
    details: { versionNumber: params.versionNumber, status: "approved" },
  });

  return version;
}

/**
 * 5. Publish lesson (Strict RBAC: only roles with publish permission)
 */
export async function publishLesson(params: {
  slug: string;
  versionNumber: number;
  actorEmail: string;
  actorRole: string;
}): Promise<ContentVersion> {
  // Check permission: only super_admin, admin, and publisher have content.publish
  const allowedRoles = ["super_admin", "admin", "publisher"];
  if (!allowedRoles.includes(params.actorRole)) {
    throw new Error(`Forbidden: Role '${params.actorRole}' does not have permission 'content.publish'.`);
  }

  const key = `${params.slug}_v${params.versionNumber}`;
  const version = versionsStore.get(key);
  if (!version) throw new Error(`Version ${key} not found`);

  // Two-person rule: Author cannot publish their own draft
  if (
    version.authorEmail &&
    params.actorEmail &&
    version.authorEmail.toLowerCase().trim() === params.actorEmail.toLowerCase().trim()
  ) {
    throw new Error("Two-person rule violation: Author cannot publish their own content draft.");
  }

  // Archive any other published versions for this slug
  for (const [k, v] of Array.from(versionsStore.entries())) {
    if (v.entityId === params.slug && v.versionNumber !== params.versionNumber && v.status === "published") {
      v.status = "archived";
      versionsStore.set(k, v);
    }
  }

  version.status = "published";
  version.publishedBy = params.actorEmail;
  version.publishedAt = new Date().toISOString();
  version.updatedAt = new Date().toISOString();
  versionsStore.set(key, version);

  // Update live registry
  lessonRegistry.set(params.slug, {
    slug: params.slug,
    publishedVersionId: version.id,
    status: "published",
    updatedAt: new Date().toISOString(),
  });

  // Revalidate Next.js cache
  try {
    revalidatePath(`/lessons/${params.slug}`);
    revalidatePath("/roadmap");
    revalidatePath("/sitemap.xml");
  } catch {}

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "lesson:publish",
    entityType: "lesson",
    entityId: params.slug,
    details: { versionNumber: params.versionNumber, publishedVersionId: version.id },
  });

  return version;
}

/**
 * 6. Edit a published lesson (Creates a new draft version, e.g. v2)
 */
export async function editPublishedLesson(params: {
  slug: string;
  updatedTitle: string;
  updatedData?: Partial<LessonDetail>;
  authorEmail: string;
  authorRole: string;
}): Promise<ContentVersion> {
  const currentPublished = getPublishedLesson(params.slug);
  if (!currentPublished) throw new Error(`Published lesson '${params.slug}' not found`);

  // Find max version number
  let maxVer = 1;
  for (const v of Array.from(versionsStore.values())) {
    if (v.entityId === params.slug && v.versionNumber > maxVer) {
      maxVer = v.versionNumber;
    }
  }

  const newVerNumber = maxVer + 1;
  const versionId = `ver-${params.slug}-v${newVerNumber}-${Date.now()}`;

  const updatedDetail: LessonDetail = {
    ...currentPublished,
    title: params.updatedTitle,
    ...params.updatedData,
  };

  const newVersion: ContentVersion = {
    id: versionId,
    entityType: "lesson",
    entityId: params.slug,
    versionNumber: newVerNumber,
    status: "draft",
    title: params.updatedTitle,
    data: updatedDetail,
    changelog: `Chỉnh sửa nội dung tạo bản nháp v${newVerNumber}`,
    comments: [],
    authorEmail: params.authorEmail,
    authorRole: params.authorRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  versionsStore.set(`${params.slug}_v${newVerNumber}`, newVersion);

  await recordAuditLog({
    actorEmail: params.authorEmail,
    actorRole: params.authorRole,
    action: `lesson:create_draft_v${newVerNumber}`,
    entityType: "lesson",
    entityId: params.slug,
    details: { versionNumber: newVerNumber, title: params.updatedTitle },
  });

  return newVersion;
}

/**
 * 7. Rollback to a specific version
 */
export async function rollbackLesson(params: {
  slug: string;
  targetVersionNumber: number;
  actorEmail: string;
  actorRole: string;
}): Promise<ContentVersion> {
  const allowedRoles = ["super_admin", "publisher"];
  if (!allowedRoles.includes(params.actorRole)) {
    throw new Error(`Forbidden: Role '${params.actorRole}' cannot rollback published content.`);
  }

  const targetKey = `${params.slug}_v${params.targetVersionNumber}`;
  const targetVersion = versionsStore.get(targetKey);
  if (!targetVersion) throw new Error(`Target version ${targetKey} not found`);

  // Archive currently published version
  for (const [k, v] of Array.from(versionsStore.entries())) {
    if (v.entityId === params.slug && v.status === "published") {
      v.status = "archived";
      versionsStore.set(k, v);
    }
  }

  // Restore target version as published
  targetVersion.status = "published";
  targetVersion.publishedBy = params.actorEmail;
  targetVersion.publishedAt = new Date().toISOString();
  targetVersion.updatedAt = new Date().toISOString();
  versionsStore.set(targetKey, targetVersion);

  lessonRegistry.set(params.slug, {
    slug: params.slug,
    publishedVersionId: targetVersion.id,
    status: "published",
    updatedAt: new Date().toISOString(),
  });

  try {
    revalidatePath(`/lessons/${params.slug}`);
    revalidatePath("/roadmap");
    revalidatePath("/sitemap.xml");
  } catch {}

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "lesson:rollback",
    entityType: "lesson",
    entityId: params.slug,
    details: { targetVersionNumber: params.targetVersionNumber, restoredVersionId: targetVersion.id },
  });

  return targetVersion;
}

/**
 * 8. Schedule publish
 */
export async function schedulePublish(params: {
  slug: string;
  versionNumber: number;
  publishAt: string; // ISO date string
  actorEmail: string;
  actorRole: string;
}): Promise<ContentVersion> {
  const key = `${params.slug}_v${params.versionNumber}`;
  const version = versionsStore.get(key);
  if (!version) throw new Error(`Version ${key} not found`);

  version.status = "scheduled";
  version.scheduledPublishAt = params.publishAt;
  version.updatedAt = new Date().toISOString();
  versionsStore.set(key, version);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "lesson:schedule_publish",
    entityType: "lesson",
    entityId: params.slug,
    details: { versionNumber: params.versionNumber, publishAt: params.publishAt },
  });

  return version;
}

/**
 * 9. Schedule unpublish
 */
export async function scheduleUnpublish(params: {
  slug: string;
  unpublishAt: string; // ISO date string
  actorEmail: string;
  actorRole: string;
}): Promise<LessonRegistryItem> {
  const reg = lessonRegistry.get(params.slug);
  if (!reg) throw new Error(`Lesson ${params.slug} not found`);

  reg.scheduledUnpublishAt = params.unpublishAt;
  reg.updatedAt = new Date().toISOString();
  lessonRegistry.set(params.slug, reg);

  await recordAuditLog({
    actorEmail: params.actorEmail,
    actorRole: params.actorRole,
    action: "lesson:schedule_unpublish",
    entityType: "lesson",
    entityId: params.slug,
    details: { unpublishAt: params.unpublishAt },
  });

  return reg;
}

/**
 * 10. Evaluate scheduled jobs (Called periodically or during test triggers)
 */
export async function evaluateScheduledJobs(): Promise<{
  published: string[];
  unpublished: string[];
}> {
  const now = new Date();
  const published: string[] = [];
  const unpublished: string[] = [];

  // 1. Process scheduled publishes
  for (const [key, version] of Array.from(versionsStore.entries())) {
    if (version.status === "scheduled" && version.scheduledPublishAt) {
      const scheduledTime = new Date(version.scheduledPublishAt);
      if (now >= scheduledTime) {
        version.status = "published";
        version.publishedAt = now.toISOString();
        version.scheduledPublishAt = null;
        versionsStore.set(key, version);

        lessonRegistry.set(version.entityId, {
          slug: version.entityId,
          publishedVersionId: version.id,
          status: "published",
          updatedAt: now.toISOString(),
        });

        published.push(`${version.entityId} v${version.versionNumber}`);

        await recordAuditLog({
          actorEmail: "scheduler@junghyeon.vn",
          actorRole: "system",
          action: "lesson:auto_published_scheduled",
          entityType: "lesson",
          entityId: version.entityId,
          details: { versionNumber: version.versionNumber },
        });
      }
    }
  }

  // 2. Process scheduled unpublishes
  for (const [slug, reg] of Array.from(lessonRegistry.entries())) {
    if (reg.status === "published" && reg.scheduledUnpublishAt) {
      const scheduledTime = new Date(reg.scheduledUnpublishAt);
      if (now >= scheduledTime) {
        reg.status = "archived";
        reg.publishedVersionId = null;
        reg.scheduledUnpublishAt = null;
        reg.updatedAt = now.toISOString();
        lessonRegistry.set(slug, reg);

        unpublished.push(slug);

        await recordAuditLog({
          actorEmail: "scheduler@junghyeon.vn",
          actorRole: "system",
          action: "lesson:auto_unpublished_scheduled",
          entityType: "lesson",
          entityId: slug,
          details: { unpublishTime: now.toISOString() },
        });
      }
    }
  }

  if (published.length > 0 || unpublished.length > 0) {
    try {
      revalidatePath("/roadmap");
      revalidatePath("/sitemap.xml");
    } catch {}
  }

  return { published, unpublished };
}

/**
 * Query active published lesson for learner site
 */
export function getPublishedLesson(slug: string): LessonDetail | null {
  const reg = lessonRegistry.get(slug);
  if (!reg || reg.status !== "published" || !reg.publishedVersionId) {
    return null;
  }

  for (const version of Array.from(versionsStore.values())) {
    if (version.id === reg.publishedVersionId && version.status === "published") {
      return version.data;
    }
  }

  return null;
}

/**
 * Query all published lessons for roadmap and sitemap
 */
export function getAllPublishedLessons(): { slug: string; title: string; levelBadge: string }[] {
  const list: { slug: string; title: string; levelBadge: string }[] = [];

  for (const [slug, reg] of Array.from(lessonRegistry.entries())) {
    if (reg.status === "published" && reg.publishedVersionId) {
      for (const version of Array.from(versionsStore.values())) {
        if (version.id === reg.publishedVersionId && version.status === "published") {
          list.push({
            slug: version.entityId,
            title: version.title,
            levelBadge: version.data.levelBadge || "SƠ CẤP",
          });
          break;
        }
      }
    }
  }

  return list;
}

/**
 * Query all versions for admin management
 */
export function getAllVersions(): ContentVersion[] {
  return Array.from(versionsStore.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
