import { z } from "zod";

// Test schemas logic
const RESERVED_DISPLAY_NAMES = new Set([
  "admin", "administrator", "junghyeon", "root", "system", "moderator", "teacher", "support"
]);

const personalInfoSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Họ và tên tối thiểu 2 ký tự" })
    .max(60, { message: "Họ và tên tối đa 60 ký tự" })
    .regex(
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/,
      { message: "Họ và tên chỉ được chứa chữ cái và khoảng trắng" }
    ),
  displayName: z
    .string()
    .trim()
    .min(3)
    .max(24)
    .regex(/^[a-zA-Z0-9_.-]+$/)
    .refine((val) => !RESERVED_DISPLAY_NAMES.has(val.toLowerCase())),
  gender: z.enum(["male", "female", "other", "undisclosed"]),
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const d = new Date(val);
      const now = new Date();
      const age = now.getFullYear() - d.getFullYear();
      return age >= 8 && age <= 100;
    }),
  nationalityCode: z.string().min(2).max(2).default("VN"),
});

const contactAccountSchema = z.object({
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const cleaned = val.replace(/[\s.-]/g, "");
      return /^(\+84|0)(3|5|7|8|9)[0-9]{8}$/.test(cleaned);
    }),
});

console.log("=== RUNNING PROFILE SCHEMAS UNIT TESTS ===");

// 1. Vietnamese Diacritics Name Test
const validNames = [
  "Nguyễn Văn A",
  "Trần Thị Hương Giang",
  "Lê Hoàng Anh",
  "Đỗ Đức Mạnh",
  "Vũ Đình Trọng",
];
for (const name of validNames) {
  const res = personalInfoSchema.safeParse({
    fullName: name,
    displayName: "junghyeon_learner",
    gender: "male",
    nationalityCode: "VN",
  });
  if (!res.success) {
    console.error(`FAILED valid name test: ${name}`, res.error.format());
    process.exit(1);
  }
}
console.log("  [PASS] Vietnamese names with diacritics validated successfully.");

// 2. Reserved & Invalid Display Name Test
const invalidDisplayNames = ["admin", "root", "teacher", "a b", "hi@you", "ab"];
for (const dn of invalidDisplayNames) {
  const res = personalInfoSchema.safeParse({
    fullName: "Nguyễn Văn A",
    displayName: dn,
    gender: "female",
    nationalityCode: "VN",
  });
  if (res.success) {
    console.error(`FAILED invalid display name test: ${dn} should have failed!`);
    process.exit(1);
  }
}
console.log("  [PASS] Reserved & format-invalid display names correctly rejected.");

// 3. Vietnamese Phone Formats Test
const validPhones = ["0988112233", "0988 112 233", "+84988112233", "0375 572 569", "0912-334-455"];
for (const phone of validPhones) {
  const res = contactAccountSchema.safeParse({ phone });
  if (!res.success) {
    console.error(`FAILED valid phone test: ${phone}`, res.error.format());
    process.exit(1);
  }
}
console.log("  [PASS] Vietnamese phone numbers in all standard formats validated.");

// 4. Invalid Phone Formats Test
const invalidPhones = ["123456", "0123456789", "0988abc", "+1234567890123"];
for (const phone of invalidPhones) {
  const res = contactAccountSchema.safeParse({ phone });
  if (res.success) {
    console.error(`FAILED invalid phone test: ${phone} should have failed!`);
    process.exit(1);
  }
}
console.log("  [PASS] Invalid phone numbers correctly rejected.");

// 5. Age Limits Test (8 to 100)
const validDobs = ["2010-05-15", "1995-12-01", "1950-01-01"];
for (const dob of validDobs) {
  const res = personalInfoSchema.safeParse({
    fullName: "Lê Văn C",
    displayName: "le_van_c",
    gender: "male",
    dateOfBirth: dob,
    nationalityCode: "VN",
  });
  if (!res.success) {
    console.error(`FAILED valid dob test: ${dob}`, res.error.format());
    process.exit(1);
  }
}

const invalidDobs = ["2024-01-01", "1850-01-01"]; // Age 2 (too young) or 176 (too old)
for (const dob of invalidDobs) {
  const res = personalInfoSchema.safeParse({
    fullName: "Lê Văn C",
    displayName: "le_van_c",
    gender: "male",
    dateOfBirth: dob,
    nationalityCode: "VN",
  });
  if (res.success) {
    console.error(`FAILED invalid dob test: ${dob} should have failed!`);
    process.exit(1);
  }
}
console.log("  [PASS] Age bounds (8-100) enforced accurately.");

console.log("\nALL P-1 SCHEMA TESTS PASSED!");
