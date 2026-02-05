import React, {createContext} from "react"
export const allAnimations = createContext(null)

const AnimationContext = (props) => {

   
    const contextvalue = {  }
    return (
        <allAnimations.Provider value={contextvalue}>
            {props.children}
        </allAnimations.Provider>
    )
}

export default AnimationContext
