import React, { useEffect } from 'react'
import './CardRight.css'
import {motion} from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useAnimation } from 'framer-motion'
const Cardleft = () => {
    const animationreverse=useAnimation()
    const animation=useAnimation()
  const handlescrollbar=useAnimation()
    const{ref,inView}=useInView({
      threshold:0.3
    })
    useEffect(()=>{
      if(inView){
        handlescrollbar.start({
          top:5,
          transition:{
            type:"spring",duration:10,bounce:0.1
          }
        })
      }
if(!inView){
  handlescrollbar.start({
   bottom:0
  })
}


  if(inView){
    animation.start({
      x:0,
      transition:{
        type:"spring",duration:2,bounce:0.2
      }
    })
  }
  if(!inView){
    animation.start({x:'100vw'})
 
  }
  if(inView){
    animationreverse.start({
    bottom:'-4vh',
      transition:{
        type:"spring",duration:2,bounce:0.2
      }
    })

  }
  if(!inView){
    animationreverse.start({bottom:'-0vw'})
 
  }
    },[inView])
  return (
    <>
      
<div className="container-fluid text-light mb-4 mt-5 card_main " ref={ref}>
    <div className="row" >
        <div className="col-12  col-sm-4 col-md-3  ms-auto text-center left_serviceimg">
        <motion.div className='left_image'  animate={animationreverse}>
          <img  className='img-fluid ' src="../assests/dog_grooming 1.png" alt="" /> 
        </motion.div>
      
       
        </div>

        <div className="col-12 col-sm-6 col-md-3  left_heading">
        <motion.div className='scrollbar' animate={handlescrollbar} ></motion.div>
   
   <p>
Instantly
   Book a Professional 
Pet Groomer Online, 
Whenever you need one.
   </p>
        </div>
    </div>
</div>
    
    </>
  )
}

export default Cardleft
