import { AdminRole } from "@/features/auth-rbac/types";
import { checkPermission } from "@/features/auth-rbac/require-permission";
import { maskEmail, maskPhone, maskName } from "@/lib/utils/masking";
import { recordAuditLog } from "@/features/audit/audit-service";

export interface RefundProposal {
  id: string;
  orderId: string;
  proposedBy: string;
  proposedAt: string;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  note?: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  plan: string;
  amount: number;
  status: "paid" | "pending" | "refund_proposed" | "refunded";
  method: string;
  createdAt: string;
  refundProposal?: RefundProposal;
}

interface OrdersGlobalState {
  orders: AdminOrder[];
}

const globalForOrders = globalThis as unknown as { __jh_orders?: OrdersGlobalState };

if (!globalForOrders.__jh_orders) {
  globalForOrders.__jh_orders = {
    orders: [
      {
        id: "ORD-8921",
        orderNumber: "JH-2026-8921",
        customerName: "Nguyễn Hải Đăng",
        customerEmail: "haidang.nguyen@gmail.com",
        customerPhone: "0988 112 233",
        plan: "Gói VIP TOPIK 1 Năm",
        amount: 1290000,
        status: "paid",
        method: "PayOS / VietQR",
        createdAt: "10 phút trước",
      },
      {
        id: "ORD-8920",
        orderNumber: "JH-2026-8920",
        customerName: "Lê Phương Thảo",
        customerEmail: "thao.le@company.vn",
        customerPhone: "0912 334 455",
        plan: "Gói VIP Trọn đời",
        amount: 2490000,
        status: "paid",
        method: "Chuyển khoản SePay",
        createdAt: "45 phút trước",
      },
      {
        id: "ORD-8919",
        orderNumber: "JH-2026-8919",
        customerName: "Phạm Văn Minh",
        customerEmail: "minh.pham@outlook.com",
        customerPhone: "0934 889 001",
        plan: "Gói Luyện đề TOPIK 3-4",
        amount: 690000,
        status: "pending",
        method: "Thẻ ATM Nội địa",
        createdAt: "2 giờ trước",
      },
      {
        id: "ORD-8918",
        orderNumber: "JH-2026-8918",
        customerName: "Hoàng Gia Huy",
        customerEmail: "giahuy.hoang@gmail.com",
        customerPhone: "0977 665 544",
        plan: "Gói VIP 6 Tháng",
        amount: 890000,
        status: "paid",
        method: "MoMo QR",
        createdAt: "Hôm qua",
      },
    ],
  };
}

const ordersStore = globalForOrders.__jh_orders.orders;

export function getAllOrders(role: AdminRole = "super_admin"): AdminOrder[] {
  const permPii = checkPermission(role, "learners", "view_pii").authorized;
  const permRevenue = checkPermission(role, "revenue", "view").authorized;

  return ordersStore.map((ord) => {
    return {
      ...ord,
      customerName: permPii ? ord.customerName : maskName(ord.customerName),
      customerEmail: permPii ? ord.customerEmail : maskEmail(ord.customerEmail),
      customerPhone: permPii ? ord.customerPhone : maskPhone(ord.customerPhone),
      amount: permRevenue ? ord.amount : -1, // -1 signals hidden/masked revenue
    };
  });
}

export async function createOrder(params: {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  plan: string;
  amount: number;
  method?: string;
  status?: "paid" | "pending";
}): Promise<AdminOrder> {
  const newOrder: AdminOrder = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    orderNumber: `JH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: params.customerName || "Học viên JungHyeon",
    customerEmail: params.customerEmail || "hocvien@junghyeon.vn",
    customerPhone: params.customerPhone || "0988 112 233",
    plan: params.plan,
    amount: params.amount,
    status: params.status || "paid",
    method: params.method || "PayOS / VietQR",
    createdAt: "Vừa xong",
  };

  ordersStore.unshift(newOrder);

  await recordAuditLog({
    actorEmail: newOrder.customerEmail,
    actorRole: "learner",
    action: "order:create",
    entityType: "order",
    entityId: newOrder.id,
    details: { plan: newOrder.plan, amount: newOrder.amount, method: newOrder.method },
  });

  return newOrder;
}

export async function proposeOrderRefund(params: {
  orderId: string;
  proposedBy: string;
  role: AdminRole;
  amount: number;
  reason: string;
}): Promise<AdminOrder> {
  const perm = checkPermission(params.role, "orders", "refund_propose");
  if (!perm.authorized) {
    throw new Error(perm.error || "Permission denied to propose refund");
  }

  const order = ordersStore.find((o) => o.id === params.orderId);
  if (!order) throw new Error(`Order ${params.orderId} not found`);

  const refundId = `REF-${Date.now()}`;
  const proposal: RefundProposal = {
    id: refundId,
    orderId: params.orderId,
    proposedBy: params.proposedBy,
    proposedAt: new Date().toISOString(),
    amount: params.amount,
    reason: params.reason,
    status: "pending",
  };

  order.status = "refund_proposed";
  order.refundProposal = proposal;

  await recordAuditLog({
    actorEmail: params.proposedBy,
    actorRole: params.role,
    action: "order:refund_propose",
    entityType: "order",
    entityId: params.orderId,
    details: { refundId, amount: params.amount, reason: params.reason },
  });

  return order;
}

export async function approveOrderRefund(params: {
  orderId: string;
  approvedBy: string;
  role: AdminRole;
  notes?: string;
}): Promise<AdminOrder> {
  const perm = checkPermission(params.role, "orders", "refund_approve");
  if (!perm.authorized) {
    throw new Error(perm.error || "Permission denied to approve refund");
  }

  const order = ordersStore.find((o) => o.id === params.orderId);
  if (!order) throw new Error(`Order ${params.orderId} not found`);
  if (!order.refundProposal || order.refundProposal.status !== "pending") {
    throw new Error("No pending refund proposal exists for this order");
  }

  // Two-Person Rule: Proposer cannot be Approver
  if (
    order.refundProposal.proposedBy.toLowerCase().trim() ===
    params.approvedBy.toLowerCase().trim()
  ) {
    throw new Error(
      "Two-person rule violation: Proposer cannot approve their own refund request."
    );
  }

  order.refundProposal.status = "approved";
  order.refundProposal.approvedBy = params.approvedBy;
  order.refundProposal.approvedAt = new Date().toISOString();
  order.refundProposal.note = params.notes;
  order.status = "refunded";

  await recordAuditLog({
    actorEmail: params.approvedBy,
    actorRole: params.role,
    action: "order:refund_approve",
    entityType: "order",
    entityId: params.orderId,
    details: {
      refundId: order.refundProposal.id,
      amount: order.refundProposal.amount,
      proposer: order.refundProposal.proposedBy,
      approver: params.approvedBy,
    },
  });

  return order;
}
