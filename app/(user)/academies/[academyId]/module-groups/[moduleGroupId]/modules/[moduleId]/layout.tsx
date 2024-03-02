import { Open_Sans } from "next/font/google";
const openSans = Open_Sans({ subsets: ["latin"] });
// TODO: FIX THE LAYOUT IDK WHY, THE NAVBAR FROM PARENT LAYOUT STILL RENDERED
const ModuleDetailLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <main className={openSans.className}>{children}</main>
    </div>
  );
};

export default ModuleDetailLayout;
