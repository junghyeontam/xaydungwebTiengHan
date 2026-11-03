/**
 * sm2.ts - Thuật toán Spaced Repetition SM-2 chuẩn hoá
 * Dùng để tính toán khoảng thời gian lặp lại ngắt quãng cho từng thẻ ghi nhớ.
 *
 * Đánh giá chất lượng nhớ (Quality 0 - 3):
 * 0: Quên hoàn toàn (Blackout)
 * 1: Khó (Hard - Nhớ lờ mờ sau khi vất vả suy nghĩ)
 * 2: Tốt (Good - Nhớ chính xác sau một chút đắn đo)
 * 3: Dễ (Easy - Nhớ ngay lập tức và chính xác tuyệt đối)
 */

export interface SM2Item {
  repetitions: number; // Số lần ôn tập thành công liên tiếp
  interval: number; // Khoảng cách đến lần ôn tiếp theo (tính theo ngày)
  easinessFactor: number; // Hệ số dễ nhớ (EF, mặc định 2.5, min 1.3)
  nextReviewDate: string; // ISO date string
}

export type ReviewGrade = 0 | 1 | 2 | 3;

export function calculateSM2(
  grade: ReviewGrade,
  item: SM2Item = {
    repetitions: 0,
    interval: 0,
    easinessFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
  }
): SM2Item {
  let { repetitions, interval, easinessFactor } = item;

  // Nếu trả lời sai/quên (Grade 0 hoặc 1)
  if (grade < 2) {
    repetitions = 0;
    interval = 1; // Ôn lại vào ngày mai
  } else {
    // Trả lời tốt hoặc dễ (Grade 2 hoặc 3)
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
  }

  // Cập nhật hệ số dễ nhớ (Easiness Factor EF)
  // Công thức chuẩn SM-2: EF' = EF + (0.1 - (3 - grade) * (0.08 + (3 - grade) * 0.02))
  const q = grade; // Trong SM-2 cổ điển thang 0-5, quy đổi 0-3 tương ứng thang 2-5
  const gradeScale5 = q === 0 ? 0 : q === 1 ? 3 : q === 2 ? 4 : 5;
  easinessFactor =
    easinessFactor +
    (0.1 - (5 - gradeScale5) * (0.08 + (5 - gradeScale5) * 0.02));
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  // Tính ngày ôn tiếp theo
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    repetitions,
    interval,
    easinessFactor: Number(easinessFactor.toFixed(2)),
    nextReviewDate: nextDate.toISOString(),
  };
}
