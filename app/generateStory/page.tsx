import SideBar from "@/components/story/Sidebar"
import DescriptionStory from "@/components/story/DescriptionStory"

function page() {
  return (
    <div className="flex flex-row">
      <div className="z-50">
      <SideBar />
      </div>
      <div  className="pl-20 fixed">
      <DescriptionStory />
      </div>
    </div>
  )
}

export default page
