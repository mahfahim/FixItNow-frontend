import { getMyProfile } from "@/actions/getMe.action";
import TechnicianReviewsClient from "../_components/TechnicianReviewsClient";

export default async function TechnicianReviewsPage() {
    const profileRes = await getMyProfile();

    const technicianId =
        profileRes?.data?.technicianProfile?.id ||
        profileRes?.data?.id ||
        "";

    return <TechnicianReviewsClient technicianId={technicianId} />;
}