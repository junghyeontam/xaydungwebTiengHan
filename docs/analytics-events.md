# JungHyeon Korean — Learner Analytics Events Catalog

This catalog documents the telemetry events emitted by the learner application and ingested by the Admin Analytics engine into the `analytics_events` table.

## Event Schema

```sql
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(64) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(64),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
```

---

## 1. Learning & Progression Events

| Event Type | Trigger Point | Payload Metadata | Admin Aggregation |
|---|---|---|---|
| `lesson_started` | User opens a lesson view | `{ lessonId, slug, stageId, level, category }` | Active learners, lesson drop-off rate |
| `lesson_completed` | User completes all slides & quiz | `{ lessonId, score, durationSeconds, xpEarned }` | Completion rate, difficulty score |
| `exercise_answered` | User submits a quiz answer | `{ lessonId, exerciseId, isCorrect, attemptNumber }` | Problematic questions, error frequency |
| `card_reviewed` | SRS flashcard graded (Again/Good/Easy) | `{ cardId, vocabId, rating, interval, repetition }` | Retention curve, daily active cards |
| `streak_updated` | Daily streak milestone hit | `{ currentStreak, longestStreak }` | Learner habit retention |

---

## 2. Acquisition & Sales Funnel Events

| Event Type | Trigger Point | Payload Metadata | Admin Aggregation |
|---|---|---|---|
| `signup_completed` | New account created | `{ method: 'google' \| 'email' \| 'magic_link', locale }` | Signup velocity, acquisition channels |
| `consultation_submitted` | Advisory form submitted | `{ leadId, goal, preferredTime, phone }` | Realtime lead bell, conversion rate |
| `checkout_started` | User clicks to purchase plan/book | `{ productId, planName, price, currency }` | Cart abandonment analysis |
| `order_paid` | Payment confirmed | `{ orderId, productId, amount, paymentMethod }` | Revenue charts, ARPU, MRR |
| `level_test_completed` | Learner completes placement test | `{ score, recommendedLevel, answersCount }` | Initial skill distribution |

---

## 3. Feedback & Realtime Alerts

| Event Type | Trigger Point | Payload Metadata | Admin Action |
|---|---|---|---|
| `content_reported` | Learner clicks "Báo lỗi nội dung" | `{ contentType, contentId, reason, userComment }` | Dispatched to Admin Inbox & Notification Bell |
| `banner_clicked` | Learner interacts with promotion banner | `{ bannerId, placement, destinationUrl }` | CTR & marketing ROI tracking |
| `search_executed` | Learner searches dictionary or roadmap | `{ query, resultCount }` | Unmet content demand analysis |

---

## 4. Learner Profile & Account Events

| Event Type | Trigger Point | Payload Metadata | Admin Action & Segment Feeds |
|---|---|---|---|
| `profile_viewed` | Learner visits `/profile` or `/profile/settings/*` | `{ tab, completenessPercent, isVip }` | Profile engagement & onboarding drop-off tracking |
| `profile_field_saved` | Learner saves any of the 5 SectionCards | `{ sectionCardId, updatedFieldsCount, completenessDelta }` | Segment analysis (learning goals, target level, location) |
| `avatar_changed` | User uploads custom photo or selects mascot | `{ avatarKind: 'upload' \| 'preset', mascotId }` | Persona & engagement metrics |
| `email_change_requested` | Learner initiates email modification | `{ oldEmailMasked, newEmailMasked }` | Security audit alerts & dual-notice dispatch |
| `data_export_requested` | Learner clicks "Tải xuống dữ liệu cá nhân" | `{ format: 'json' \| 'csv' }` | GDPR compliance pipeline monitoring |
| `account_deletion_requested` | Learner requests account deletion | `{ reason, scheduledFor, graceDays: 14 }` | Customer retention alert & offboarding funnel |

---

## Integration in Code

Client-side events use non-blocking Beacon API via `src/features/analytics/tracker.ts`:

```typescript
import { trackAnalyticsEvent } from "@/features/analytics/tracker";

// Example: Tracking lesson completion
trackAnalyticsEvent("lesson_completed", {
  userId: currentUser?.id,
  metadata: {
    lessonId: "hangul-01",
    score: 100,
    durationSeconds: 240,
    xpEarned: 50,
  },
});
```
