import { Dashboard } from "@/features/dashboard/ui/Dashboard";
import { AssignedCardsWidget } from "@/features/card/ui/AssignedCardsWidget";
import { DueSoonCardsWidget } from "@/features/card/ui/DueSoonCardsWidget";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-y-8 p-8 max-w-[1200px] mx-auto">
            {/* Header chào mừng (Có thể thêm nếu muốn) */}
            <div className="flex flex-col gap-y-1">
                <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
                <p className="text-muted-foreground">Đây là tổng quan công việc của bạn hôm nay.</p>
            </div>

            {/* KHU VỰC NHIỆM VỤ CÁ NHÂN (SCRUM-163 & 164) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AssignedCardsWidget />
                <DueSoonCardsWidget />
            </div>

            <hr className="border-gray-100" />

            {/* DANH SÁCH WORKSPACE (Code cũ của bạn) */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">Your Workspaces</h2>
                <Dashboard />
            </div>
        </div>
    );
}