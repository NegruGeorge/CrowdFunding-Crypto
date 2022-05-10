import React from 'react'

export default function InvestInProject({projectAddress}:any) {
    console.log(projectAddress)
  return (
      <>
      <div>InvestInProject</div>
        <div>{ projectAddress === "" ? "nimic": "date"}</div>
      </>
  )
}
