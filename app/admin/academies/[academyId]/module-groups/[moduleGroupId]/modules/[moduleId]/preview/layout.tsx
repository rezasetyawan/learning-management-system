import { Open_Sans } from "next/font/google";
const openSans = Open_Sans({ subsets: ["latin"] });
const ModuleDetailLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className={`${openSans.className} h-full`}>{children}</div>;
};

export default ModuleDetailLayout;
