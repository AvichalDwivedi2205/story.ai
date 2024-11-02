import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/Card"
import Dropdownmenu from './Dropdown-menu' 

function DescriptionStory() {
  return (
    <div className='fixed'>
       <Card className='w-[800px] text-center'>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
            <div className='grid grid-cols-2 place-items-center'>
                <Dropdownmenu isEmotion={true}/>
                <Dropdownmenu isEmotion={false}/>
            </div>
        </CardContent>
        <CardFooter>
            <p>Card Footer</p>
        </CardFooter>
        </Card>
    </div>
  )
}

export default DescriptionStory
