import React from 'react'

function page() {
  return (
    <div>
      {process.env.FIREBASE_API_KEY}
    </div>
  )
}

export default page
