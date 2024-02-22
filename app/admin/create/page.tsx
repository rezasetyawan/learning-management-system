import { cookies } from "next/headers";
import CreateForm from "./components/create-form";

const CreatePage = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  return <CreateForm accessToken={accessToken} />;
};

export default CreatePage;
