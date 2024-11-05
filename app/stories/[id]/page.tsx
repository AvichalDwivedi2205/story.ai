import CreditsDisplay from "@/components/CreditsDisplay";
import ChatMessage from "@/components/ChatMessage";
import { Story } from "@/schema/schema";
import { getStoryById } from "@/config/firebase";


export default async function StoryPage({ params }: { params: { id: string } }) {

    const story: Story | null = await getStoryById(params.id)
    console.log(story)
    if(!story){
        return <div className="text-center p-8">Story not found</div>
    }


}