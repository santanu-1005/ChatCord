import React from 'react'

const Card = (props) => {
  return (
    <div className='p-4 bg-white rounded-lg shadow-sm'>
      <h3 className="font-medium text-lg mb-2">{props.title}</h3>
      <p className="text-gray-600">{props.description}</p>
    </div>
  )
}

export default Card;