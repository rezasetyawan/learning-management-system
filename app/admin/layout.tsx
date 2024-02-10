import Navbar from "@/components/admin/navbar";
import Sidebar from "@/components/admin/sidebar";

const DashboardLayout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <div className="h-full">
      <div className="h-[80px] lg:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden lg:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="lg:pl-56 pt-[80px] h-full">
        {children}
        {modal}
        <div id="modal-root" />
      </main>
    </div>
  );
};

export default DashboardLayout;
