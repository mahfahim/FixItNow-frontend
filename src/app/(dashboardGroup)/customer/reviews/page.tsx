// src/app/(dashboardGroup)/customer/reviews/page.tsx
import { GetMeReviews } from "@/components/share/cust-GetMeReviews";

export const metadata = {
    title: "My Reviews | FixItNow Customer",
    description: "Manage and view your submitted reviews for technicians.",
};

export default function CustomerReviewsPage() {
    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            <GetMeReviews />
        </div>
    );
}