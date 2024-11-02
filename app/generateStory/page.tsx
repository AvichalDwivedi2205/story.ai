import SideBar from "@/components/story/Sidebar";
import DescriptionStory from "@/components/story/DescriptionStory";

function page() {
  return (
    <div className="flex flex-col md:flex-row bg-slate-950">
      <div className="fixed md:relative z-50 w-full md:w-auto">
        <SideBar />
      </div>
      <div className="w-full md:pl-20 mt-20 md:mt-0 flex justify-center md:block">
        <DescriptionStory />
      </div>
    </div>
  );
}

export default page;
