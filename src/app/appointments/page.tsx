
import AppointmentBookingForm from "@/components/appointments/appointment-booking-form";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function AppointmentsPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <AppointmentBookingForm />
      </main>

      <SiteFooter />
    </>
  );
}
