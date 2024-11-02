import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/Dropdown"
import { emotions, outcomes } from "@/schema/schema"

function DropdownMenu({ isEmotion }: { isEmotion: boolean }) {
  const options = isEmotion ? emotions : outcomes;

  return (
    <Select>
      <SelectTrigger className="w-[180px] hover:border-gray-600 hover:text-gray-400">
        <SelectValue placeholder={isEmotion ? "Select an Emotion" : "Select an Outcome"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option} className="hover:text-gray-500 hover:cursor-pointer">
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>   

  );
}

export default DropdownMenu;
  