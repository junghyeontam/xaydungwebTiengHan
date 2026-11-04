import type { LearnerOrStaffRole } from "@junghyeon/rbac";

export interface TestPersona {
  id: string;
  email: string;
  fullName: string;
  role: LearnerOrStaffRole;
  is2faEnabled: boolean;
}

export const TEST_PERSONAS: Record<LearnerOrStaffRole, TestPersona> = {
  guest: {
    id: "persona-guest",
    email: "",
    fullName: "Khách vãng lai",
    role: "guest",
    is2faEnabled: false,
  },
  learner: {
    id: "persona-learner",
    email: "learner@junghyeon.vn",
    fullName: "Nguyễn Minh Anh",
    role: "learner",
    is2faEnabled: false,
  },
  teacher: {
    id: "persona-teacher",
    email: "teacher@junghyeon.vn",
    fullName: "Thầy Park JungHyeon",
    role: "teacher",
    is2faEnabled: false,
  },
  content_editor: {
    id: "persona-editor",
    email: "editor@junghyeon.vn",
    fullName: "Lê Thu Hà",
    role: "content_editor",
    is2faEnabled: false,
  },
  publisher: {
    id: "persona-publisher",
    email: "publisher@junghyeon.vn",
    fullName: "Trần Quang Huy",
    role: "publisher",
    is2faEnabled: true,
  },
  sales_crm: {
    id: "persona-sales",
    email: "sales@junghyeon.vn",
    fullName: "Phạm Ngọc Linh",
    role: "sales_crm",
    is2faEnabled: false,
  },
  support_agent: {
    id: "persona-support",
    email: "support@junghyeon.vn",
    fullName: "Vũ Hoàng Nam",
    role: "support_agent",
    is2faEnabled: false,
  },
  marketing: {
    id: "persona-marketing",
    email: "marketing@junghyeon.vn",
    fullName: "Đặng Khánh Vy",
    role: "marketing",
    is2faEnabled: false,
  },
  read_only: {
    id: "persona-readonly",
    email: "auditor@junghyeon.vn",
    fullName: "Hoàng Thanh Tùng",
    role: "read_only",
    is2faEnabled: true,
  },
  admin: {
    id: "persona-admin",
    email: "ops@junghyeon.vn",
    fullName: "Nguyễn Quản Trị",
    role: "admin",
    is2faEnabled: true,
  },
  super_admin: {
    id: "persona-superadmin",
    email: "admin@junghyeon.vn",
    fullName: "Super Admin JungHyeon",
    role: "super_admin",
    is2faEnabled: true,
  },
};
